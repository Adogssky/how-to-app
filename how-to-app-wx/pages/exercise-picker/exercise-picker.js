const app = getApp();
const { buildImageUrl } = require('../../utils/request');

Page({
  data: {
    search: '',
    selectedCategory: 'all',
    categories: ['all'],
    exercises: []
  },

  onLoad() {
    this.loadExercises();
  },

  onShow() {
    this.loadExercises();
  },

  loadExercises() {
    const library = app.globalData.exerciseLibrary || [];
    const complete = library.filter(ex => ex.instructions && (ex.image || ex.gif_url));
    const categories = ['all', ...new Set(complete.map(ex => ex.body_part))];
    this.setData({ exercises: complete, categories });
    this.filterExercises();
  },

  filterExercises() {
    const library = app.globalData.exerciseLibrary || [];
    const complete = library.filter(ex => ex.instructions && (ex.image || ex.gif_url));
    const filtered = complete.filter(ex => {
      const matchCat = this.data.selectedCategory === 'all' || ex.body_part === this.data.selectedCategory;
      const q = this.data.search.toLowerCase();
      const matchQ = ex.name.toLowerCase().includes(q) || ex.equipment.toLowerCase().includes(q);
      return matchCat && matchQ;
    }).slice(0, 50);
    this.setData({ exercises: filtered });
  },

  onSearchInput(e) {
    this.setData({ search: e.detail.value });
    this.filterExercises();
  },

  onCategoryTap(e) {
    this.setData({ selectedCategory: e.currentTarget.dataset.cat });
    this.filterExercises();
  },

  onSelectExercise(e) {
    const ex = e.currentTarget.dataset.ex;
    const pages = getCurrentPages();
    const workoutPage = pages[pages.length - 2];
    if (workoutPage && workoutPage.onAddExerciseFromPicker) {
      workoutPage.onAddExerciseFromPicker(ex);
    }
    wx.navigateBack();
  },

  goBack() {
    wx.navigateBack();
  }
});
