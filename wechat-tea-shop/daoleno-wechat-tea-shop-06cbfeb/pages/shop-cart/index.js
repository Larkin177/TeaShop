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

    delBtnWidth: 120,
    loginPhone: '',
    loginPassword: ''
  },

  //获取元素自适应后的实际宽度
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
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，container位置不变
        left = "margin-left:0px";
      } else if (disX > 0) { //移动距离大于0，container left值等于手指移动距离
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
      //如果距离小于删除按钮的1/2，不显示删除按钮
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
      // 弹出删除确认
      wx.showModal({
        content: '确定要删除该商品吗？',
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
        title: '已取消',
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


  onPhoneInput(e) { this.setData({ loginPhone: e.detail.value }) },
  onPasswordInput(e) { this.setData({ loginPassword: e.detail.value }) },
  async processPhoneLogin() {
    var phone = this.data.loginPhone;
    var pwd = this.data.loginPassword;
    if (!phone || phone.length !== 11) {
      wx.showToast({ title: '\u8BF7\u8F93\u5165\u624B\u673A\u53F7', icon: 'none' });
      return;
    }
    if (!pwd) {
      wx.showToast({ title: '\u8BF7\u8F93\u5165\u5BC6\u7801', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '\u767B\u5F55\u4E2D...' });
    var res = await WXAPI.login(phone, pwd);
    wx.hideLoading();
    if (res.code === 0) {
      this.setData({ wxlogin: true, loginPhone: '', loginPassword: '' });
      this.onShow();
      wx.showToast({ title: '\u767B\u5F55\u6210\u529F', icon: 'success' });
    } else {
      wx.showToast({ title: res.message || '\u767B\u5F55\u5931\u8D25', icon: 'none' });
    }
  },
  async processRegister() {
    var phone = this.data.loginPhone;
    var pwd = this.data.loginPassword;
    if (!phone || phone.length !== 11) {
      wx.showToast({ title: '\u8BF7\u8F93\u5165\u624B\u673A\u53F7', icon: 'none' });
      return;
    }
    if (!pwd || pwd.length < 4) {
      wx.showToast({ title: '\u5BC6\u7801\u81F3\u5C114\u4F4D', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '\u6CE8\u518C\u4E2D...' });
    var res = await WXAPI.register(phone, pwd, '\u8336\u53CB');
    wx.hideLoading();
    if (res.code === 0) {
      this.setData({ wxlogin: true });
      this.onShow();
      wx.showToast({ title: '\u6CE8\u518C\u6210\u529F', icon: 'success' });
    } else {
      wx.showToast({ title: res.message || '\u6CE8\u518C\u5931\u8D25', icon: 'none' });
    }
  }

  ,
  processWxLogin: function() {
    var _this = this;
    wx.login({
      success: function(res) {
        if (res.code) {
          wx.showLoading({ title: '登录中...' });
          WXAPI.login_wx(res.code).then(function(loginRes) {
            wx.hideLoading();
            if (loginRes.code === 0 && loginRes.data && loginRes.data.token) {
              wx.setStorageSync('token', loginRes.data.token);
              wx.setStorageSync('uid', loginRes.data.user ? loginRes.data.user.id : '');
              wx.setStorageSync('userInfo', loginRes.data.user);
              _this.setData({ wxlogin: true });
              if (_this.onShow) _this.onShow();
              wx.showToast({ title: '登录成功', icon: 'success' });
            } else {
              wx.showToast({ title: loginRes.message || '登录失败', icon: 'none' });
            }
          });
        }
      }
    });
  }
})