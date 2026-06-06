const WXAPI = require("apifm-wxapi");

async function checkSession() {
  return new Promise((resolve) => {
    wx.checkSession({
      success() {
        return resolve(true);
      },
      fail() {
        return resolve(false);
      },
    });
  });
}

// 检测登录状态，返回 true / false
async function checkHasLogined() {
  const token = wx.getStorageSync("token");
  if (!token) {
    return false;
  }
  const loggined = await checkSession();
  if (!loggined) {
    wx.removeStorageSync("token");
    wx.removeStorageSync("uid");
    wx.removeStorageSync("userInfo");
    return false;
  }
  const checkTokenRes = await WXAPI.checkToken(token);
  if (checkTokenRes.code != 0) {
    wx.removeStorageSync("token");
    wx.removeStorageSync("uid");
    wx.removeStorageSync("userInfo");
    return false;
  }
  return true;
}

async function wxaCode() {
  return new Promise((resolve) => {
    wx.login({
      success(res) {
        return resolve(res.code);
      },
      fail() {
        wx.showToast({
          title: "获取code失败",
          icon: "none",
        });
        return resolve(null);
      },
    });
  });
}

async function getUserInfo() {
  return new Promise((resolve) => {
    wx.getUserProfile({
      desc: "用于完善用户资料",
      success: (res) => {
        return resolve(res.userInfo);
      },
      fail: () => {
        // fallback to old api
        wx.getUserInfo({
          success: (r) => resolve(r.userInfo),
          fail: () => resolve(null),
        });
      },
    });
  });
}

// 微信一键登录（自动注册）
async function login(page) {
  wx.login({
    success: function (res) {
      const code = res.code;
      // 先尝试获取用户信息
      wx.getUserProfile({
        desc: "用于完善用户资料",
        success: function (infoRes) {
          const userInfo = infoRes.userInfo;
          WXAPI.login_wx_with_info(code, userInfo.nickName, userInfo.avatarUrl).then(function (loginRes) {
            if (loginRes.code == 0) {
              wx.setStorageSync("token", loginRes.data.token);
              wx.setStorageSync("uid", loginRes.data.uid || loginRes.data.user?.id);
              wx.setStorageSync("userInfo", loginRes.data.user);
              if (page) {
                page.onShow();
              }
            } else {
              wx.showModal({
                title: "无法登录",
                content: loginRes.message || "登录失败",
                showCancel: false,
              });
            }
          });
        },
        fail: function () {
          // 用户拒绝授权，使用默认信息登录
          WXAPI.login_wx(code).then(function (loginRes) {
            if (loginRes.code == 0) {
              wx.setStorageSync("token", loginRes.data.token);
              wx.setStorageSync("uid", loginRes.data.uid || loginRes.data.user?.id);
              wx.setStorageSync("userInfo", loginRes.data.user);
              if (page) {
                page.onShow();
              }
            } else {
              wx.showModal({
                title: "无法登录",
                content: loginRes.message || "登录失败",
                showCancel: false,
              });
            }
          });
        },
      });
    },
  });
}

// 注册（完善信息后登录）
async function register(page) {
  wx.login({
    success: function (res) {
      const code = res.code;
      wx.getUserProfile({
        desc: "用于完善用户资料",
        success: function (infoRes) {
          const userInfo = infoRes.userInfo;
          WXAPI.register_complex({
            code: code,
            nickname: userInfo.nickName,
            avatar: userInfo.avatarUrl,
          }).then(function (regRes) {
            // 注册完后登录
            login(page);
          });
        },
        fail: function () {
          WXAPI.register_complex({ code: code }).then(function () {
            login(page);
          });
        },
      });
    },
  });
}

function loginOut() {
  wx.removeStorageSync("token");
  wx.removeStorageSync("uid");
  wx.removeStorageSync("userInfo");
}

async function checkAndAuthorize(scope) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        if (!res.authSetting[scope]) {
          wx.authorize({
            scope: scope,
            success() {
              resolve();
            },
            fail() {
              wx.showModal({
                title: "无权操作",
                content: "需要获得您的授权",
                showCancel: false,
                confirmText: "立即授权",
                confirmColor: "#e64340",
                success(res) {
                  wx.openSetting();
                },
                fail(e) {
                  reject(e);
                },
              });
            },
          });
        } else {
          resolve();
        }
      },
      fail(e) {
        reject(e);
      },
    });
  });
}

module.exports = {
  checkHasLogined: checkHasLogined,
  wxaCode: wxaCode,
  getUserInfo: getUserInfo,
  login: login,
  register: register,
  loginOut: loginOut,
  checkAndAuthorize: checkAndAuthorize,
};
