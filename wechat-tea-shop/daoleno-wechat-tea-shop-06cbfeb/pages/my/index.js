const app = getApp()
const CONFIG = require('../../config.js')
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js')

Page({
  data: {
    wxlogin: true,
    loginPhone: '',
    loginPassword: '',
    balance: '0.00',
    freeze: 0,
    score: 0,
    growth: 0
  },
  onLoad() {},
  onShow() {
    var _this = this
    this.setData({ version: CONFIG.version })
    AUTH.checkHasLogined().then(function(isLogined) {
      _this.setData({ wxlogin: isLogined })
      if (isLogined) {
        _this.getUserApiInfo()
        _this.getUserAmount()
      }
    })
    TOOLS.showTabBarBadge()
  },
  aboutUs: function() {
    wx.showModal({ title: '\u5173\u4E8E\u6211\u4EEC', content: '\u53E4\u8317\u8336\u996E', showCancel: false })
  },
  loginOut: function() {
    AUTH.loginOut()
    wx.reLaunch({ url: '/pages/my/index' })
  },
  onPhoneInput: function(e) { this.setData({ loginPhone: e.detail.value }) },
  onPasswordInput: function(e) { this.setData({ loginPassword: e.detail.value }) },
  processPhoneLogin: function() {
    var phone = this.data.loginPhone
    var pwd = this.data.loginPassword
    if (!phone || phone.length !== 11) { wx.showToast({ title: '\u8BF7\u8F93\u5165\u624B\u673A\u53F7', icon: 'none' }); return }
    if (!pwd) { wx.showToast({ title: '\u8BF7\u8F93\u5165\u5BC6\u7801', icon: 'none' }); return }
    wx.showLoading({ title: '\u767B\u5F55\u4E2D...' })
    var _this = this
    WXAPI.login(phone, pwd).then(function(res) {
      wx.hideLoading()
      if (res.code === 0) {
        _this.setData({ wxlogin: true, loginPhone: '', loginPassword: '' })
        _this.onShow()
        wx.showToast({ title: '\u767B\u5F55\u6210\u529F', icon: 'success' })
      } else { wx.showToast({ title: res.message || '\u767B\u5F55\u5931\u8D25', icon: 'none' }) }
    })
  },
  processRegister: function() {
    var phone = this.data.loginPhone
    var pwd = this.data.loginPassword
    if (!phone || phone.length !== 11) { wx.showToast({ title: '\u8BF7\u8F93\u5165\u624B\u673A\u53F7', icon: 'none' }); return }
    if (!pwd || pwd.length < 4) { wx.showToast({ title: '\u5BC6\u7801\u81F3\u5C114\u4F4D', icon: 'none' }); return }
    wx.showLoading({ title: '\u6CE8\u518C\u4E2D...' })
    var _this = this
    WXAPI.register(phone, pwd, '\u8336\u53CB').then(function(res) {
      wx.hideLoading()
      if (res.code === 0) {
        _this.setData({ wxlogin: true })
        _this.onShow()
        wx.showToast({ title: '\u6CE8\u518C\u6210\u529F', icon: 'success' })
      } else { wx.showToast({ title: res.message || '\u6CE8\u518C\u5931\u8D25', icon: 'none' }) }
    })
  },
  bindPhone: function() { this.setData({ wxlogin: false }) },
  getUserApiInfo: function() {
    var _this = this
    WXAPI.userDetail(wx.getStorageSync('token')).then(function(res) {
      if (res.code == 0) { _this.setData({ apiUserInfoMap: res.data }) }
    })
  },
  getUserAmount: function() {
    var _this = this
    WXAPI.userAmount(wx.getStorageSync('token')).then(function(res) {
      if (res.code == 0) {
        _this.setData({
          balance: (res.data.balance || 0).toFixed(2),
          freeze: res.data.freeze || 0,
          score: res.data.score || 0,
          growth: res.data.growth || 0
        })
      }
    })
  },
  goAsset: function() { wx.navigateTo({ url: '/pages/asset/index' }) },
  goScore: function() { wx.navigateTo({ url: '/pages/score/index' }) },
  goOrder: function(e) { wx.navigateTo({ url: '/pages/order-list/index?type=' + e.currentTarget.dataset.type }) },
  cancelLogin: function() { this.setData({ wxlogin: true }) },
  goLogin: function() { this.setData({ wxlogin: false }) },
  processLogin: function(e) { this.setData({ wxlogin: false }) },
  clearStorage: function() {
    wx.clearStorageSync()
    wx.showToast({ title: '\u5DF2\u6E05\u9664', icon: 'success' })
  }
})