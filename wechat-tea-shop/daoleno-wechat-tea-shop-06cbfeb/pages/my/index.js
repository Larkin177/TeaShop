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
    growth: 0,
    score_sign_continuous: 0,
    rechargeOpen: false
  },
  onLoad() {},
  onShow() {
    const _this = this
    this.setData({ version: CONFIG.version })
    AUTH.checkHasLogined().then(isLogined => {
      this.setData({ wxlogin: isLogined })
      if (isLogined) {
        _this.getUserApiInfo()
        _this.getUserAmount()
      }
    })
    TOOLS.showTabBarBadge()
  },
  aboutUs() {
    wx.showModal({ title: 'About Us', content: 'Tea Shop - Your favorite tea drinks', showCancel: false })
  },
  loginOut() {
    AUTH.loginOut()
    wx.reLaunch({ url: '/pages/my/index' })
  },
  onPhoneInput(e) { this.setData({ loginPhone: e.detail.value }) },
  onPasswordInput(e) { this.setData({ loginPassword: e.detail.value }) },
  async processPhoneLogin() {
    const phone = this.data.loginPhone
    const pwd = this.data.loginPassword
    if (!phone || phone.length !== 11) {
      wx.showToast({ title: 'Enter valid phone', icon: 'none' })
      return
    }
    if (!pwd) {
      wx.showToast({ title: 'Enter password', icon: 'none' })
      return
    }
    wx.showLoading({ title: 'Logging in...' })
    const res = await WXAPI.login(phone, pwd)
    wx.hideLoading()
    if (res.code === 0) {
      this.setData({ wxlogin: true, loginPhone: '', loginPassword: '' })
      this.onShow()
      wx.showToast({ title: 'Login success', icon: 'success' })
    } else {
      wx.showToast({ title: res.message || 'Login failed', icon: 'none' })
    }
  },
  async processRegister() {
    const phone = this.data.loginPhone
    const pwd = this.data.loginPassword
    if (!phone || phone.length !== 11) {
      wx.showToast({ title: 'Enter valid phone', icon: 'none' })
      return
    }
    if (!pwd || pwd.length < 4) {
      wx.showToast({ title: 'Password min 4 chars', icon: 'none' })
      return
    }
    wx.showLoading({ title: 'Registering...' })
    const res = await WXAPI.register(phone, pwd, 'Tea Fan')
    wx.hideLoading()
    if (res.code === 0) {
      this.setData({ wxlogin: true, loginPhone: '', loginPassword: '' })
      this.onShow()
      wx.showToast({ title: 'Register success', icon: 'success' })
    } else {
      wx.showToast({ title: res.message || 'Register failed', icon: 'none' })
    }
  },
  bindPhone() {
    this.setData({ wxlogin: false })
  },
  getUserApiInfo() {
    WXAPI.userDetail(wx.getStorageSync('token')).then(res => {
      if (res.code == 0) {
        this.setData({ apiUserInfoMap: res.data })
      }
    })
  },
  getUserAmount() {
    WXAPI.userAmount(wx.getStorageSync('token')).then(res => {
      if (res.code == 0) {
        this.setData({
          balance: (res.data.balance || 0).toFixed(2),
          freeze: res.data.freeze || 0,
          score: res.data.score || 0,
          growth: res.data.growth || 0
        })
      }
    })
  },
  goAsset() { wx.navigateTo({ url: '/pages/asset/index' }) },
  goScore() { wx.navigateTo({ url: '/pages/score/index' }) },
  goOrder(e) { wx.navigateTo({ url: '/pages/order-list/index?type=' + e.currentTarget.dataset.type }) },
  cancelLogin() { this.setData({ wxlogin: true }) },
  goLogin() { this.setData({ wxlogin: false }) },
  processLogin(e) {
    // Legacy handler - redirect to phone login
    this.setData({ wxlogin: false })
  },
  scanOrderCode() {
    wx.scanCode({
      onlyFromCamera: true,
      success(res) { wx.navigateTo({ url: '/pages/order-details/scan-result?hxNumber=' + res.result }) },
      fail(err) { wx.showToast({ title: err.errMsg, icon: 'none' }) }
    })
  },
  clearStorage() {
    wx.clearStorageSync()
    wx.showToast({ title: 'Cleared', icon: 'success' })
  }
})
