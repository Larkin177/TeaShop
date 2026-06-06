var WXAPI = require("apifm-wxapi");
var CONFIG = require("config.js");
var AUTH = require("utils/auth");

App({
  onLaunch: function () {
    wx.setStorageSync("mallName", "古茗茶饮");
    var that = this;

    var updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: "更新提示",
        content: "新版本已准备好，是否重启应用？",
        success: function(res) { if (res.confirm) updateManager.applyUpdate(); }
      });
    });

    wx.getNetworkType({
      success: function(res) {
        if (res.networkType === "none") {
          that.globalData.isConnected = false;
          wx.showToast({ title: "当前无网络", icon: "loading", duration: 2000 });
        }
      }
    });

    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false;
        wx.showToast({ title: "网络已断开", icon: "none", duration: 2000 });
      } else {
        that.globalData.isConnected = true;
        wx.hideToast();
      }
    });
  },

  onShow: function (e) {
    this.globalData.launchOption = e;
    if (e && e.query && e.query.inviter_id) {
      wx.setStorageSync("referrer", e.query.inviter_id);
    }
    this.autoLogin();
  },

  autoLogin: function () {
    var token = wx.getStorageSync("token");
    if (token) {
      return;
    }
    wx.login({
      success: function (res) {
        if (res.code) {
          WXAPI.login_wx(res.code).then(function (loginRes) {
            if (loginRes.code === 0 && loginRes.data && loginRes.data.token) {
              wx.setStorageSync("token", loginRes.data.token);
              wx.setStorageSync("uid", loginRes.data.user ? loginRes.data.user.id : "");
              wx.setStorageSync("userInfo", loginRes.data.user);
              console.log("auto login success");
            }
          });
        }
      }
    });
  },

  globalData: {
    isConnected: true,
    apiBaseUrl: CONFIG.apiBaseUrl
  }
});
