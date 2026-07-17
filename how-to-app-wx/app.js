App({
  globalData: {
    exerciseLibrary: []
  },

  onLaunch() {
    const { loadExerciseLibrary } = require('./utils/request');
    loadExerciseLibrary().then(lib => {
      this.globalData.exerciseLibrary = lib;
    }).catch(() => {
      this.globalData.exerciseLibrary = [];
    });
  }
});
