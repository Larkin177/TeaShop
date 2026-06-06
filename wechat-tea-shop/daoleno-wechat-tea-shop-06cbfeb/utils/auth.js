var WXAPI = require("apifm-wxapi");

function checkHasLogined() {
  return new Promise(function(resolve) {
    var token = wx.getStorageSync("token");
    if (!token) {
      resolve(false);
      return;
    }
    resolve(true);
  });
}

function wxaCode() {
  return new Promise(function(resolve) {
    wx.login({
      success: function(res) { resolve(res.code); },
      fail: function() { resolve(null); }
    });
  });
}

function login(page) {
  wx.login({
    success: function(res) {
      var code = res.code;
      WXAPI.login_wx(code).then(function(loginRes) {
        if (loginRes.code === 0 && loginRes.data && loginRes.data.token) {
          wx.setStorageSync("token", loginRes.data.token);
          wx.setStorageSync("uid", loginRes.data.user ? loginRes.data.user.id : "");
          wx.setStorageSync("userInfo", loginRes.data.user);
          if (page && page.onShow) page.onShow();
        }
      });
    }
  });
}

function register(page) { login(page); }

function loginOut() {
  wx.removeStorageSync("token");
  wx.removeStorageSync("uid");
  wx.removeStorageSync("userInfo");
}

function getUserInfo() {
  return new Promise(function(resolve) { resolve(null); });
}

function checkAndAuthorize(scope) {
  return new Promise(function(resolve) { resolve(); });
}

module.exports = {
  checkHasLogined: checkHasLogined,
  wxaCode: wxaCode,
  getUserInfo: getUserInfo,
  login: login,
  register: register,
  loginOut: loginOut,
  checkAndAuthorize: checkAndAuthorize
};