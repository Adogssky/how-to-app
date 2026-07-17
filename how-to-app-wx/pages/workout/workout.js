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

function formatDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
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

function calculateBest1RM(exerciseName) {
  const workouts = storage.get('workouts', {});
  let best = 0;
  Object.values(workouts).forEach(day => {
    day.exercises.forEach(ex => {
      if (!ex.name || ex.name.toLowerCase() !== exerciseName.toLowerCase()) return;
      ex.sets.forEach(set => {
        const w = parseFloat(set.weight);
        const r = parseFloat(set.reps);
        if (!w || !r || w <= 0 || r <= 0) return;
        const rm = w * (1 + 0.033 * (r - 1));
        if (rm > best) best = rm;
      });
    });
  });
  return best;
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  const t = (value - inMin) / (inMax - inMin);
  const clamped = Math.max(0, Math.min(1, t));
  return outMin + (outMax - outMin) * clamped;
}

function interpolateColor(a, b, t) {
  const ah = parseInt(a.replace('#', ''), 16);
  const bh = parseInt(b.replace('#', ''), 16);
  const ar = (ah >> 16) & 255, ag = (ah >> 8) & 255, ab = ah & 255;
  const br = (bh >> 16) & 255, bg = (bh >> 8) & 255, bb = bh & 255;
  const rr = Math.round(ar + (br - ar) * t);
  const rg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);
  return `rgb(${rr}, ${rg}, ${rb})`;
}

function getStrengthStyle(value, activeColor) {
  const baseWidth = 2.8;
  const maxWidth = 6.5;
  const ref = 100;
  let ratio = Math.min(value / ref, 1.5);
  if (ratio < 0.1) ratio = 0.1;
  const width = baseWidth + (maxWidth - baseWidth) * Math.min(ratio, 1);
  const color = interpolateColor('#cccccc', activeColor, Math.min(ratio, 1));
  return { width, color };
}

function generateHumanSVG(shoulderW, waistW, upperStyle, lowerStyle) {
  const cx = 60;
  const headY = 18;
  const neckY = 30;
  const shoulderY = 38;
  const waistY = 75;
  const hipY = 85;
  const kneeY = 130;
  const ankleY = 175;

  const shoulderL = cx - shoulderW / 2;
  const shoulderR = cx + shoulderW / 2;
  const waistL = cx - waistW / 2;
  const waistR = cx + waistW / 2;
  const hipW = waistW + 6;
  const hipL = cx - hipW / 2;
  const hipR = cx + hipW / 2;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 200">
      <g>
        <circle cx="${cx}" cy="${headY}" r="12" fill="#fff" stroke="${upperStyle.color}" stroke-width="${upperStyle.width}" />
        <path d="M${cx} ${neckY} L${cx} ${shoulderY}" stroke="${upperStyle.color}" stroke-width="${upperStyle.width}" fill="none" stroke-linecap="round" />
        <path d="M${shoulderL} ${shoulderY} L${shoulderR} ${shoulderY}" stroke="${upperStyle.color}" stroke-width="${upperStyle.width}" fill="none" stroke-linecap="round" />
        <path d="M${shoulderL} ${shoulderY} L${waistL} ${waistY} L${hipL} ${hipY} L${hipR} ${hipY} L${waistR} ${waistY} L${shoulderR} ${shoulderY}" stroke="${upperStyle.color}" stroke-width="${upperStyle.width}" fill="none" stroke-linejoin="round" stroke-linecap="round" />
        <path d="M${shoulderL} ${shoulderY} L35 60 L30 88" stroke="${upperStyle.color}" stroke-width="${upperStyle.width}" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M${shoulderR} ${shoulderY} L85 60 L90 88" stroke="${upperStyle.color}" stroke-width="${upperStyle.width}" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M${hipL} ${hipY} L45 ${kneeY} L40 ${ankleY}" stroke="${lowerStyle.color}" stroke-width="${lowerStyle.width}" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M${hipR} ${hipY} L75 ${kneeY} L80 ${ankleY}" stroke="${lowerStyle.color}" stroke-width="${lowerStyle.width}" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </g>
    </svg>
  `;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.trim());
}

function generateFigureSvg() {
  const bench = calculateBest1RM('Bench Press');
  const squat = calculateBest1RM('Squat');
  const deadlift = calculateBest1RM('Deadlift');
  const lower = (squat + deadlift) / 2;
  const profile = storage.get('body_profile', {});
  const weight = parseFloat(profile.weight) || 70;
  const shoulderWidth = mapRange(bench, 0, 120, 34, 54);
  const waistWidth = mapRange(weight + lower * 0.3, 50, 180, 18, 32);
  const upperStyle = getStrengthStyle(bench, '#6b5ce7');
  const lowerStyle = getStrengthStyle(lower, '#5cb38f');
  return generateHumanSVG(shoulderWidth, waistWidth, upperStyle, lowerStyle);
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
    bodyProfile: { gender: 'male', height: '', weight: '' },
    big3: { squat: 0, bench: 0, deadlift: 0 },
    figureSvg: '',
    calendarMonth: '',
    calendarDays: [],
    selectedHistoryDate: '',
    historyDetail: null
  },

  timerInterval: null,
  timerSeconds: 0,
  currentTimerSet: null,

  onLoad() {
    this.renderToday();
    this.loadBodyProfile();
    this.renderHistory();
  },

  onShow() {
    this.renderToday();
    this.loadBodyProfile();
    this.renderHistory();
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
    if (tab === 'history') this.renderHistory();
    if (tab === 'body') this.loadBodyProfile();
  },

  // ===== History =====
  renderHistory() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const workouts = storage.get('workouts', {});
    const todayStr = todayKey();

    const headers = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const days = [];
    headers.forEach(h => days.push({ type: 'header', label: h }));
    for (let i = 0; i < firstDay; i++) {
      days.push({ type: 'empty' });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dateStr = formatDateKey(date);
      days.push({
        type: 'day',
        label: d,
        date: dateStr,
        hasWorkout: !!workouts[dateStr],
        isToday: dateStr === todayStr
      });
    }

    this.setData({
      calendarMonth: `${monthNames[month]} ${year}`,
      calendarDays: days
    });
  },

  onHistoryDayTap(e) {
    const date = e.currentTarget.dataset.date;
    const workouts = storage.get('workouts', {});
    const day = workouts[date];
    if (!day) return;

    const dateObj = new Date(date + 'T00:00:00');
    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const exercises = day.exercises.filter(ex => ex.type !== 'blank').map(ex => ({
      name: ex.name,
      setsText: ex.sets.filter(s => s.completed).map(s => `${s.weight}kg × ${s.reps}`).join(', ') || 'No completed sets'
    }));

    this.setData({
      selectedHistoryDate: date,
      historyDetail: {
        dateText: `${weekday}, ${monthDay}`,
        exercises
      }
    });
  },

  // ===== Body =====
  loadBodyProfile() {
    const profile = storage.get('body_profile', { gender: 'male', height: '', weight: '' });
    const big3 = {
      squat: calculateBest1RM('Squat'),
      bench: calculateBest1RM('Bench Press'),
      deadlift: calculateBest1RM('Deadlift')
    };
    const figureSvg = generateFigureSvg();
    this.setData({ bodyProfile: profile, big3, figureSvg });
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
    this.loadBodyProfile();
    wx.showToast({ title: 'Saved', icon: 'success' });
  },

  format1RM(value) {
    return value > 0 ? value.toFixed(1) + ' kg' : '—';
  },

  onUnload() {
    this.clearTimer();
  }
});
