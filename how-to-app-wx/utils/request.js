const EXERCISE_DATASET_URL = 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json';
const IMAGE_BASE_URL = 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images';

function wxRequest(url) {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method: 'GET',
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject(new Error(`Request failed: ${res.statusCode}`));
        }
      },
      fail: reject
    });
  });
}

function buildImageUrl(imageId) {
  if (!imageId) return '';
  if (imageId.startsWith('http')) return imageId;
  return `${IMAGE_BASE_URL}/${imageId}.jpg`;
}

async function loadExerciseLibrary() {
  try {
    const data = await wxRequest(EXERCISE_DATASET_URL);
    const list = Array.isArray(data) ? data : (data.exercises || []);
    return list.map(ex => ({
      id: ex.id || String(Math.random()).slice(2, 10),
      name: ex.name,
      body_part: ex.body_part || ex.bodyPart || ex.target || 'General',
      equipment: ex.equipment || 'Body weight',
      instructions: (ex.instructions && ex.instructions.en) ? ex.instructions.en : (ex.instructions || ''),
      image: buildImageUrl(ex.image),
      gif_url: buildImageUrl(ex.gif_url || ex.id)
    })).filter(ex => ex.name && ex.instructions);
  } catch (err) {
    console.log('External exercise dataset not loaded, using built-in fallback.');
    return getBuiltInExercises();
  }
}

function getBuiltInExercises() {
  return [
    { id: 'squat', name: 'Squat', body_part: 'Legs', equipment: 'Barbell', instructions: 'Stand with feet shoulder-width apart, lower your hips back and down, then stand back up.', image: '', gif_url: '' },
    { id: 'bench', name: 'Bench Press', body_part: 'Chest', equipment: 'Barbell', instructions: 'Lie on a bench, press the bar up from your chest until arms are extended.', image: '', gif_url: '' },
    { id: 'deadlift', name: 'Deadlift', body_part: 'Back', equipment: 'Barbell', instructions: 'Stand with feet under the bar, hinge at hips, grip the bar and stand up straight.', image: '', gif_url: '' },
    { id: 'press', name: 'Overhead Press', body_part: 'Shoulders', equipment: 'Barbell', instructions: 'Press the bar from shoulder height to overhead.', image: '', gif_url: '' },
    { id: 'row', name: 'Barbell Row', body_part: 'Back', equipment: 'Barbell', instructions: 'Bend over, pull the bar to your lower chest.', image: '', gif_url: '' }
  ];
}

module.exports = {
  wxRequest,
  loadExerciseLibrary,
  buildImageUrl
};
