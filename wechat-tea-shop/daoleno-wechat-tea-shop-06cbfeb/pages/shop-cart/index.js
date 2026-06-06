const WXAPI = require('apifm-wxapi')
const TOOLS = require('../../utils/tools.js')
const AUTH = require('../../utils/auth')

const app = getApp()

Page({
  data: {
    wxlogin: true,

    saveHidden: true,
    allSelect: true,
    noSelect: false,

    delBtnWidth: 120, loginPhone: '', loginPassword: '', //鍒犻櫎鎸夐挳瀹藉害鍗曚綅锛坮px锛?
  },

  //鑾峰彇鍏冪礌鑷€傚簲鍚庣殑瀹為檯瀹藉害
  getEleWidth: function(w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth
      var scale = (750 / 2) / (w / 2)
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function() {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  onLoad: function() {
    this.initEleWidth();
    this.onShow();
  },
  onShow: function() {
    AUTH.checkHasLogined().then(isLogined => {
      this.setData({
        wxlogin: isLogined
      })
      if (isLogined) {
        this.shippingCarInfo()
      }
    })    
  },
  async shippingCarInfo(){
    const token = wx.getStorageSync('token')
    if (!token) {
      return
    }
    const res = await WXAPI.shippingCarInfo(token)
    if (res.code == 0) {
      this.setData({
        shippingCarInfo: res.data
      })
    } else {
      this.setData({
        shippingCarInfo: null
      })
    }
  },
  toIndexPage: function() {
    wx.switchTab({
      url: "/pages/index/index"
    });
  },

  touchS: function(e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function(e) {
    const index = e.currentTarget.dataset.index;
    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var left = "";
      if (disX == 0 || disX < 0) { //濡傛灉绉诲姩璺濈灏忎簬绛変簬0锛宑ontainer浣嶇疆涓嶅彉
        left = "margin-left:0px";
      } else if (disX > 0) { //绉诲姩璺濈澶т簬0锛宑ontainer left鍊肩瓑浜庢墜鎸囩Щ鍔ㄨ窛绂?
        left = "margin-left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          left = "left:-" + delBtnWidth + "px";
        }
      }
      this.data.shippingCarInfo.items[index].left = left
      this.setData({
        shippingCarInfo: this.data.shippingCarInfo
      })
    }
  },

  touchE: function(e) {
    var index = e.currentTarget.dataset.index;
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //濡傛灉璺濈灏忎簬鍒犻櫎鎸夐挳鐨?/2锛屼笉鏄剧ず鍒犻櫎鎸夐挳
      var left = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "px" : "margin-left:0px";
      this.data.shippingCarInfo.items[index].left = left
      this.setData({
        shippingCarInfo: this.data.shippingCarInfo
      })
    }
  },
  async delItem(e) {
    const key = e.currentTarget.dataset.key
    this.delItemDone(key)
  },
  async delItemDone(key){
    const token = wx.getStorageSync('token')
    const res = await WXAPI.shippingCarInfoRemoveItem(token, key)
    if (res.code != 0 && res.code != 700) {
      wx.showToast({
        title: res.msg,
        icon:'none'
      })
    } else {
      this.shippingCarInfo()
      TOOLS.showTabBarBadge()
    }
  },
  async jiaBtnTap(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.shippingCarInfo.items[index]
    const number = item.number + 1
    const token = wx.getStorageSync('token')
    const res = await WXAPI.shippingCarInfoModifyNumber(token, item.key, number)
    this.shippingCarInfo()
  },
  async jianBtnTap(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.shippingCarInfo.items[index]
    const number = item.number-1
    if (number <= 0) {
      // 寮瑰嚭鍒犻櫎纭
      wx.showModal({
        content: '纭畾瑕佸垹闄よ鍟嗗搧鍚楋紵',
        success: (res) => {
          if (res.confirm) {
            this.delItemDone(item.key)
          }
        }
      })
      return
    }
    const token = wx.getStorageSync('token')
    const res = await WXAPI.shippingCarInfoModifyNumber(token, item.key, number)
    this.shippingCarInfo()
  },
  cancelLogin() {
    this.setData({
      wxlogin: true
    })
  },
  processLogin(e) {
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '宸插彇娑?,
        icon: 'none',
      })
      return;
    }
    AUTH.register(this);
  },
  changeCarNumber(e){
    const key = e.currentTarget.dataset.key
    const num = e.detail.value
    const token = wx.getStorageSync('token')
    WXAPI.shippingCarInfoModifyNumber(token, key, num).then(res => {
      this.shippingCarInfo()
    })    
  },



  ,
  onPhoneInput(e) { this.setData({ loginPhone: e.detail.value }) },
  onPasswordInput(e) { this.setData({ loginPassword: e.detail.value }) },
  async processPhoneLogin() {
    const phone = this.data.loginPhone, pwd = this.data.loginPassword
    if (!phone || phone.length !== 11) { wx.showToast({ title: 'Enter phone', icon: 'none' }); return }
    if (!pwd) { wx.showToast({ title: 'Enter password', icon: 'none' }); return }
    wx.showLoading({ title: 'Login...' })
    const res = await WXAPI.login(phone, pwd)
    wx.hideLoading()
    if (res.code === 0) {
      this.setData({ wxlogin: true, loginPhone: '', loginPassword: '' })
      this.onShow()
      wx.showToast({ title: 'OK', icon: 'success' })
    } else { wx.showToast({ title: res.message || 'Failed', icon: 'none' }) }
  },
  async processRegister() {
    const phone = this.data.loginPhone, pwd = this.data.loginPassword
    if (!phone || phone.length !== 11) { wx.showToast({ title: 'Enter phone', icon: 'none' }); return }
    if (!pwd || pwd.length < 4) { wx.showToast({ title: 'Min 4 chars', icon: 'none' }); return }
    wx.showLoading({ title: 'Register...' })
    const res = await WXAPI.register(phone, pwd, 'Tea Fan')
    wx.hideLoading()
    if (res.code === 0) {
      this.setData({ wxlogin: true })
      this.onShow()
      wx.showToast({ title: 'OK', icon: 'success' })
    } else { wx.showToast({ title: res.message || 'Failed', icon: 'none' }) }
  }
})
