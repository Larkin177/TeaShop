const WXAPI = require("apifm-wxapi");
const CONFIG = require("config.js");
const AUTH = require("utils/auth");

App({
  onLaunch: function () {
    // 设置默认店铺名称
    wx.setStorageSync("mallName", "茶铺 Tea Shop");

    const that = this;
    // 检测新版本
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启应用？",
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        },
      });
    });

    // 初次加载判断网络情况
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType;
        if (networkType === "none") {
          that.globalData.isConnected = false;
          wx.showToast({
            title: "当前无网络",
            icon: "loading",
            duration: 2000,
          });
        }
      },
    });

    // 监听网络状态变化
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false;
        wx.showToast({
          title: "网络已断开",
          icon: "none",
          duration: 2000,
        });
      } else {
        that.globalData.isConnected = true;
        wx.hideToast();
      }
    });
  },

  onShow(e) {
    this.globalData.launchOption = e;
    // 保存邀请人
    if (e && e.query && e.query.inviter_id) {
      wx.setStorageSync("referrer", e.query.inviter_id);
    }
    // 自动登录（检查token）
    AUTH.checkHasLogined().then((isLogined) => {
      if (!isLogined) {
        // 不自动弹出登录，让各页面自行判断
      }
    });
  },

  globalData: {
    isConnected: true,
    apiBaseUrl: CONFIG.apiBaseUrl,
  },
});
