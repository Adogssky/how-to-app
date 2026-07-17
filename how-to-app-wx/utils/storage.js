const PREFIX = 'howto_';

function get(key, defaultValue = null) {
  try {
    return wx.getStorageSync(PREFIX + key) || defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function set(key, value) {
  try {
    wx.setStorageSync(PREFIX + key, value);
  } catch (e) {
    console.error('storage set failed', e);
  }
}

function remove(key) {
  try {
    wx.removeStorageSync(PREFIX + key);
  } catch (e) {
    console.error('storage remove failed', e);
  }
}

module.exports = {
  get,
  set,
  remove
};
