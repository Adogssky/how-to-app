const storage = require('../../utils/storage');

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function enrichExercise(ex) {
  if (ex.type === 'blank') return ex;
  const completed = ex.sets.filter(s => s.completed).length;
  return {
    ...ex,
    completedCount: completed,
    sets: ex.sets.map(s => ({
      ...s,
      restText: s.completed ? formatTime(s.restSeconds || 0) : ''
    }))
  };
}

function enrichWorkout(workout) {
  if (!workout) return workout;
  return {
    ...workout,
    exercises: workout.exercises.map(enrichExercise)
  };
}

Page({
  data: {
    tab: 'today',
    activeWorkout: null,
    currentIndex: 0,
    showTimer: false,
    timerLabel: '',
    timerText: '00:00',
    timerAction: '',
    timerMode: '',
    genderRange: ['male', 'female', 'other'],
    bodyProfile: { gender: 'male', height: '', weight: '', squat: '', bench: '', deadlift: '' }
  },

  timerInterval: null,
  timerSeconds: 0,
  currentTimerSet: null,

  onLoad() {
    this.renderToday();
    this.loadBodyProfile();
  },

  renderToday() {
    const today = todayKey();
    const workouts = storage.get('workouts', {});
    const todayWorkout = workouts[today];

    if (todayWorkout && todayWorkout.exercises && todayWorkout.exercises.length > 0) {
      this.setData({ activeWorkout: enrichWorkout(todayWorkout), currentIndex: 0 });
    } else {
      this.startDefaultWorkout();
    }
  },

  startDefaultWorkout() {
    const activeWorkout = {
      date: todayKey(),
      exercises: [{ type: 'blank' }]
    };
    this.saveWorkout(activeWorkout);
    this.setData({ activeWorkout: enrichWorkout(activeWorkout), currentIndex: 0 });
  },

  saveWorkout(workout) {
    const workouts = storage.get('workouts', {});
    workouts[workout.date] = workout;
    storage.set('workouts', workouts);
  },

  updateActiveWorkout(workout, extra = {}) {
    this.saveWorkout(workout);
    this.setData({ activeWorkout: enrichWorkout(workout), ...extra });
  },

  onSwiperChange(e) {
    this.setData({ currentIndex: e.detail.current });
  },

  goBack() {
    wx.navigateBack();
  },

  onBlankCardTap() {
    wx.navigateTo({ url: '/pages/exercise-picker/exercise-picker' });
  },

  onAddExerciseFromPicker(exercise) {
    const workout = this.data.activeWorkout;
    const blankIndex = workout.exercises.findIndex(ex => ex.type === 'blank');
    const newExercise = {
      type: 'exercise',
      id: exercise.id,
      name: exercise.name,
      body_part: exercise.body_part,
      equipment: exercise.equipment,
      instructions: exercise.instructions,
      image: exercise.image,
      gif_url: exercise.gif_url,
      sets: [{ weight: '', reps: '', completed: false, restSeconds: 0 }]
    };

    if (blankIndex >= 0) {
      workout.exercises[blankIndex] = newExercise;
    } else {
      workout.exercises.push(newExercise);
    }
    workout.exercises.push({ type: 'blank' });
    this.updateActiveWorkout(workout, { currentIndex: blankIndex >= 0 ? blankIndex : workout.exercises.length - 2 });
  },

  onWeightChange(e) {
    const { ex, set } = e.currentTarget.dataset;
    const workout = this.data.activeWorkout;
    workout.exercises[ex].sets[set].weight = e.detail.value;
    this.updateActiveWorkout(workout);
  },

  onRepsChange(e) {
    const { ex, set } = e.currentTarget.dataset;
    const workout = this.data.activeWorkout;
    workout.exercises[ex].sets[set].reps = e.detail.value;
    this.updateActiveWorkout(workout);
  },

  onStartSet(e) {
    const { ex, set } = e.currentTarget.dataset;
    this.clearTimer();
    this.currentTimerSet = { ex: parseInt(ex), set: parseInt(set) };
    this.setData({
      showTimer: true,
      timerLabel: 'Lifting',
      timerText: '00:00',
      timerAction: 'Stop',
      timerMode: 'lifting'
    });
    this.timerSeconds = 0;
    this.timerInterval = setInterval(() => {
      this.timerSeconds++;
      this.setData({ timerText: formatTime(this.timerSeconds) });
    }, 1000);
  },

  onTimerAction() {
    if (this.data.timerMode === 'lifting') {
      this.stopToRest();
    } else if (this.data.timerMode === 'rest') {
      this.completeSet();
    }
  },

  stopToRest() {
    this.clearTimer();
    this.setData({
      timerLabel: 'Rest',
      timerText: '00:00',
      timerAction: 'Next set!',
      timerMode: 'rest'
    });
    this.timerSeconds = 0;
    this.timerInterval = setInterval(() => {
      this.timerSeconds++;
      this.setData({ timerText: formatTime(this.timerSeconds) });
    }, 1000);
  },

  completeSet() {
    this.clearTimer();
    const { ex, set } = this.currentTimerSet;
    const workout = JSON.parse(JSON.stringify(this.data.activeWorkout));
    const s = workout.exercises[ex].sets[set];
    s.restSeconds = this.timerSeconds;
    s.completed = true;
    this.updateActiveWorkout(workout, { showTimer: false, timerMode: '' });
  },

  onSkipTimer() {
    this.clearTimer();
    if (this.data.timerMode === 'rest') {
      this.completeSet();
    } else {
      this.setData({ showTimer: false, timerMode: '' });
    }
  },

  clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  },

  onAddSet(e) {
    const { ex } = e.currentTarget.dataset;
    const workout = this.data.activeWorkout;
    workout.exercises[ex].sets.push({ weight: '', reps: '', completed: false, restSeconds: 0 });
    this.updateActiveWorkout(workout);
  },

  onRemoveExercise(e) {
    const { ex } = e.currentTarget.dataset;
    wx.showModal({
      title: 'Remove exercise?',
      success: (res) => {
        if (!res.confirm) return;
        const workout = this.data.activeWorkout;
        workout.exercises.splice(ex, 1);
        this.updateActiveWorkout(workout, { currentIndex: Math.min(this.data.currentIndex, workout.exercises.length - 1) });
      }
    });
  },

  onToggleDetails(e) {
    const { ex } = e.currentTarget.dataset;
    const key = `activeWorkout.exercises[${ex}].detailsOpen`;
    const val = !this.data.activeWorkout.exercises[ex].detailsOpen;
    this.setData({ [key]: val });
  },

  onResetToday() {
    wx.showModal({
      title: 'Reset today?',
      content: 'This will clear all records for today.',
      success: (res) => {
        if (!res.confirm) return;
        const workouts = storage.get('workouts', {});
        delete workouts[todayKey()];
        storage.set('workouts', workouts);
        this.startDefaultWorkout();
      }
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ tab });
  },

  loadBodyProfile() {
    const profile = storage.get('body_profile', { gender: 'male', height: '', weight: '', squat: '', bench: '', deadlift: '' });
    this.setData({ bodyProfile: profile });
  },

  onBodyInput(e) {
    const { field } = e.currentTarget.dataset;
    let value = e.detail.value;
    if (field === 'gender') {
      value = this.data.genderRange[value];
    }
    this.setData({ [`bodyProfile.${field}`]: value });
  },

  saveBodyProfile() {
    storage.set('body_profile', this.data.bodyProfile);
    wx.showToast({ title: 'Saved', icon: 'success' });
  },

  onUnload() {
    this.clearTimer();
  }
});
