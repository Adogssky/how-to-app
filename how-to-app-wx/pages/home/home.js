const storage = require('../../utils/storage');

const PROGRAM_LIBRARY = [
  {
    id: 'build-a-bike',
    title: 'Build a bike',
    subtitle: 'Choose road or mountain, then explore every part step by step.',
    icon: '🚴',
    gradient: 'gradient-1',
    path: '/pages/bike/bike'
  },
  {
    id: 'workout-at-gym',
    title: 'Workout at a gym',
    subtitle: 'Log today’s training with cards, timer and progress tracking.',
    icon: '🏋️',
    gradient: 'gradient-2',
    path: '/pages/workout/workout'
  }
];

const MAX_REFRESH = 3;

Page({
  data: {
    programs: [],
    currentIndex: 0,
    refreshCount: 0,
    remainRefresh: MAX_REFRESH
  },

  onLoad() {
    this.pushPrograms();
  },

  pushPrograms() {
    const shuffled = PROGRAM_LIBRARY.sort(() => Math.random() - 0.5);
    const votes = storage.get('program_votes', {});
    const programs = shuffled.map(p => {
      const v = votes[p.id] || { likes: 0, dislikes: 0 };
      return {
        ...p,
        likes: v.likes,
        dislikes: v.dislikes,
        likeDots: this.buildDots(v.likes),
        dislikeDots: this.buildDots(v.dislikes)
      };
    });
    this.setData({ programs, currentIndex: 0 });
  },

  buildDots(count) {
    const full = Math.min(Math.floor(count / 5), 5);
    return new Array(full).fill(0);
  },

  onSwiperChange(e) {
    this.setData({ currentIndex: e.detail.current });
  },

  onCardTap(e) {
    const { path } = e.currentTarget.dataset;
    wx.navigateTo({ url: path });
  },

  onVote(e) {
    const { id, type } = e.currentTarget.dataset;
    const votes = storage.get('program_votes', {});
    if (!votes[id]) votes[id] = { likes: 0, dislikes: 0 };
    votes[id][type + 's']++;
    storage.set('program_votes', votes);

    const programs = this.data.programs.map(p => {
      if (p.id !== id) return p;
      const newCount = p[type + 's'] + 1;
      return {
        ...p,
        [type + 's']: newCount,
        [type + 'Dots']: this.buildDots(newCount)
      };
    });
    this.setData({ programs });
  },

  onRefresh() {
    if (this.data.remainRefresh <= 0) {
      wx.showToast({ title: 'No refreshes left', icon: 'none' });
      return;
    }
    const refreshCount = this.data.refreshCount + 1;
    this.setData({ refreshCount, remainRefresh: MAX_REFRESH - refreshCount });
    this.pushPrograms();
  },

  onMoreTap() {
    wx.showModal({
      title: 'I know how to…',
      content: 'UGC program creation is coming soon in the mini-program.',
      showCancel: false
    });
  },

  renderDots(count) {
    return new Array(count).fill(0);
  }
});
