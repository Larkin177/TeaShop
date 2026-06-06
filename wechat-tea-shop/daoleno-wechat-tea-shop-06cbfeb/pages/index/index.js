const WXAPI = require('apifm-wxapi')
const TOOLS = require('../../utils/tools.js')

const APP = getApp()
// fixed棣栨鎵撳紑涓嶆樉绀烘爣棰樼殑bug
APP.configLoadOK = () => {
  wx.setNavigationBarTitle({
    title: wx.getStorageSync('mallName')
  })
}

Page({
  data: {
    inputVal: "", // 鎼滅储妗嗗唴瀹?    goodsRecommend: [], // 鎺ㄨ崘鍟嗗搧
    kanjiaList: [], //鐮嶄环鍟嗗搧鍒楄〃
    pingtuanList: [], //鎷煎洟鍟嗗搧鍒楄〃

    loadingHidden: false, // loading
    selectCurrent: 0,
    categories: [],
    activeCategoryId: 0,
    goods: [],
    
    scrollTop: 0,
    loadingMoreHidden: true,

    coupons: [],

    curPage: 1,
    pageSize: 20,
    cateScrollTop: 0,
    wxlogin: true
  },

  tabClick: function(e) {
    wx.setStorageSync("_categoryId", e.currentTarget.id)
    wx.switchTab({
      url: '/pages/category/category',
    })
    // wx.navigateTo({
    //   url: '/pages/goods/list?categoryId=' + e.currentTarget.id,
    // })
  },
  toDetailsTap: function(e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  tapBanner: function(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.navigateTo({
        url
      })
    }
  },
  adClick: function(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.navigateTo({
        url
      })
    }
  },
  bindTypeTap: function(e) {
    this.setData({
      selectCurrent: e.index
    })
  },
  onLoad: function(e) {
    wx.showShareMenu({
      withShareTicket: true
    })    
    const that = this
    if (e && e.scene) {
      const scene = decodeURIComponent(e.scene)
      if (scene) {        
        wx.setStorageSync('referrer', scene.substring(11))
      }
    }
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
    this.initBanners()
    var _token = wx.getStorageSync('token');
    if (!_token) {
      that.setData({ wxlogin: false });
    }
    this.categories()
    WXAPI.goods({
      recommendStatus: 1
    }).then(res => {
      if (res.code === 0){
        that.setData({
          goodsRecommend: res.data
        })
      }      
    })
    that.getCoupons()
    that.getNotice()
    that.kanjiaGoods()
    that.pingtuanGoods()
    this.wxaMpLiveRooms()    
  },
  async miaoshaGoods(){
    const res = await WXAPI.goods({
      miaosha: true
    })
    if (res.code == 0) {
      res.data.forEach(ele => {
        const _now = new Date().getTime()
        if (ele.dateStart) {
          ele.dateStartInt = new Date(ele.dateStart).getTime() - _now
        }
        if (ele.dateEnd) {
          ele.dateEndInt = new Date(ele.dateEnd).getTime() -_now
        }
      })
      this.setData({
        miaoshaGoods: res.data
      })
    }
  },
  async wxaMpLiveRooms(){
    const res = await WXAPI.wxaMpLiveRooms()
    if (res.code == 0 && res.data.length > 0) {
      this.setData({
        aliveRooms: res.data
      })
    }
  },
  async initBanners(){
    const _data = {}
    // [comment]
    const res1 = await WXAPI.banners({
      type: 'index'
    })
    if (res1.code == 700) {
      wx.showModal({
        title: '鎻愮ず',
        content: '请在后台添加 banner 轮播图片，自定义类型填写 index',
        showCancel: false
      })
    } else {
      _data.banners = res1.data
    }
    this.setData(_data)
  },
  onShow: function(e){
    this.setData({
      shopInfo: wx.getStorageSync('shopInfo')
    })
    // 鑾峰彇璐墿杞︽暟鎹紝鏄剧ずTabBarBadge
    TOOLS.showTabBarBadge()
    this.goodsDynamic()
    this.miaoshaGoods()
  },
  async goodsDynamic(){
    const res = await WXAPI.goodsDynamic(0)
    if (res.code == 0) {
      this.setData({
        goodsDynamic: res.data
      })
    }
  },
  async categories(){
    const res = await WXAPI.goodsCategory()
    let categories = [];
    if (res.code == 0) {
      const _categories = res.data.filter(ele => {
        return ele.level == 1
      })
      categories = categories.concat(_categories)
    }
    this.setData({
      categories: categories,
      activeCategoryId: 0,
      curPage: 1
    });
    this.getGoodsList(0);
  },
  onPageScroll(e) {
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  async getGoodsList(categoryId, append) {
    if (categoryId == 0) {
      categoryId = "";
    }
    wx.showLoading({
      "mask": true
    })
    const res = await WXAPI.goods({
      categoryId: categoryId,
      page: this.data.curPage,
      pageSize: this.data.pageSize
    })
    wx.hideLoading()
    if (res.code == 404 || res.code == 700) {
      let newData = {
        loadingMoreHidden: false
      }
      if (!append) {
        newData.goods = []
      }
      this.setData(newData);
      return
    }
    let goods = [];
    if (append) {
      goods = this.data.goods
    }
    for (var i = 0; i < res.data.length; i++) {
      goods.push(res.data[i]);
    }
    this.setData({
      loadingMoreHidden: true,
      goods: goods,
    });
  },
  getCoupons: function() {
    var that = this;
    WXAPI.coupons().then(function (res) {
      if (res.code == 0) {
        that.setData({
          coupons: res.data
        });
      }
    })
  },
  onShareAppMessage: function() {    
    return {
      title: '"' + wx.getStorageSync('mallName') + '" ' + wx.getStorageSync('share_profile'),
      path: '/pages/index/index?inviter_id=' + wx.getStorageSync('uid')
    }
  },
  getNotice: function() {
    var that = this;
    WXAPI.noticeList({pageSize: 5}).then(function (res) {
      if (res.code == 0) {
        that.setData({
          noticeList: res.data
        });
      }
    })
  },
  onReachBottom: function() {
    this.setData({
      curPage: this.data.curPage + 1
    });
    this.getGoodsList(this.data.activeCategoryId, true)
  },
  onPullDownRefresh: function() {
    this.setData({
      curPage: 1
    });
    this.getGoodsList(this.data.activeCategoryId)
    wx.stopPullDownRefresh()
  },
  // 鑾峰彇鐮嶄环鍟嗗搧
  async kanjiaGoods(){
    const res = await WXAPI.goods({
      kanjia: true
    });
    if (res.code == 0) {
      const kanjiaGoodsIds = []
      res.data.forEach(ele => {
        kanjiaGoodsIds.push(ele.id)
      })
      const goodsKanjiaSetRes = await WXAPI.kanjiaSet(kanjiaGoodsIds.join())
      if (goodsKanjiaSetRes.code == 0) {
        res.data.forEach(ele => {
          const _process = goodsKanjiaSetRes.data.find(_set => {
            console.log(_set)
            return _set.goodsId == ele.id
          })
          console.log(ele)
          console.log(_process)
          if (_process) {
            ele.process = 100 * _process.numberBuy / _process.number
          }
        })
        this.setData({
          kanjiaList: res.data
        })
      }
    }
  },
  goCoupons: function (e) {
    wx.navigateTo({
      url: "/pages/coupons/index"
    })
  },
  pingtuanGoods(){ // 获取团购商品列表
    const _this = this
    WXAPI.goods({
      pingtuan: true
    }).then(res => {
      if (res.code === 0) {
        _this.setData({
          pingtuanList: res.data
        })
      }
    })
  },
  bindinput(e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  bindconfirm(e) {
    this.setData({
      inputVal: e.detail.value
    })
    wx.navigateTo({
      url: '/pages/goods/list?name=' + this.data.inputVal,
    })
  },
  goSearch(){
    wx.navigateTo({
      url: '/pages/goods/list?name=' + this.data.inputVal,
    })
  }

  ,
  processWxLogin: function() {
    var _this = this;
    wx.login({
      success: function(res) {
        if (res.code) {
          wx.showLoading({ title: '\u767B\u5F55\u4E2D...' });
          WXAPI.login_wx(res.code).then(function(loginRes) {
            wx.hideLoading();
            if (loginRes.code === 0 && loginRes.data && loginRes.data.token) {
              wx.setStorageSync('token', loginRes.data.token);
              wx.setStorageSync('uid', loginRes.data.user ? loginRes.data.user.id : '');
              wx.setStorageSync('userInfo', loginRes.data.user);
              _this.setData({ wxlogin: true });
              wx.showToast({ title: '\u767B\u5F55\u6210\u529F', icon: 'success' });
            } else {
              wx.showToast({ title: loginRes.message || '\u767B\u5F55\u5931\u8D25', icon: 'none' });
            }
          });
        }
      }
    });
  },
  onPhoneInput: function(e) { this.setData({ loginPhone: e.detail.value }) },
  onPasswordInput: function(e) { this.setData({ loginPassword: e.detail.value }) },
  processPhoneLogin: function() {
    var phone = this.data.loginPhone, pwd = this.data.loginPassword;
    if (!phone || phone.length !== 11) { wx.showToast({ title: '\u8BF7\u8F93\u5165\u624B\u673A\u53F7', icon: 'none' }); return; }
    if (!pwd) { wx.showToast({ title: '\u8BF7\u8F93\u5165\u5BC6\u7801', icon: 'none' }); return; }
    var _this = this;
    wx.showLoading({ title: '\u767B\u5F55\u4E2D...' });
    WXAPI.login(phone, pwd).then(function(res) {
      wx.hideLoading();
      if (res.code === 0) {
        _this.setData({ wxlogin: true, loginPhone: '', loginPassword: '' });
        wx.showToast({ title: '\u767B\u5F55\u6210\u529F', icon: 'success' });
      } else { wx.showToast({ title: res.message || '\u767B\u5F55\u5931\u8D25', icon: 'none' }); }
    });
  },
  processRegister: function() {
    var phone = this.data.loginPhone, pwd = this.data.loginPassword;
    if (!phone || phone.length !== 11) { wx.showToast({ title: '\u8BF7\u8F93\u5165\u624B\u673A\u53F7', icon: 'none' }); return; }
    if (!pwd || pwd.length < 4) { wx.showToast({ title: '\u5BC6\u7801\u81F3\u5C114\u4F4D', icon: 'none' }); return; }
    var _this = this;
    wx.showLoading({ title: '\u6CE8\u518C\u4E2D...' });
    WXAPI.register(phone, pwd, '\u8336\u53CB').then(function(res) {
      wx.hideLoading();
      if (res.code === 0) {
        _this.setData({ wxlogin: true });
        wx.showToast({ title: '\u6CE8\u518C\u6210\u529F', icon: 'success' });
      } else { wx.showToast({ title: res.message || '\u6CE8\u518C\u5931\u8D25', icon: 'none' }); }
    });
  },
  cancelLogin: function() { this.setData({ wxlogin: true }) },
  goLogin: function() { this.setData({ wxlogin: false }) }
})