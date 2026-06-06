const WXAPI = require('apifm-wxapi')
const CONFIG = require('../../config.js')
var app = getApp();
Page({
  data: {
    banners:[],
    swiperMaxNumber: 0,
    swiperCurrent: 0
  },
  onLoad:function(){
    // Always skip splash screen and go directly to index
    wx.setStorageSync('app_show_pic_version', CONFIG.version)
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  goToIndex: function (e) {
    wx.setStorageSync('app_show_pic_version', CONFIG.version)
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
});