const WXAPI = require('apifm-wxapi')
const app = getApp();
const CONFIG = require('../../config.js')
const AUTH = require('../../utils/auth')
const SelectSizePrefix = "閫夋嫨锛?
import Poster from 'wxa-plugin-canvas/poster/poster'

Page({
  data: {
    wxlogin: true,

    goodsDetail: {},
    hasMoreSelect: false,
    selectSize: SelectSizePrefix,
    selectSizePrice: 0,
    selectSizeOPrice: 0,
    totalScoreToPay: 0,
    shopNum: 0,
    hideShopPopup: true,
    buyNumber: 0,
    buyNumMin: 1,
    buyNumMax: 0,

    propertyChildIds: "",
    propertyChildNames: "",
    canSubmit: false, //  閫変腑瑙勬牸灏哄鏃跺€欐槸鍚﹀厑璁稿姞鍏ヨ喘鐗╄溅
    shopType: "addShopCar", loginPhone: '', loginPassword: '', loginPhone: '', loginPassword: '', //璐墿绫诲瀷锛屽姞鍏ヨ喘鐗╄溅鎴栫珛鍗宠喘涔帮紝榛樿涓哄姞鍏ヨ喘鐗╄溅
  },
  async onLoad(e) {
    // e.id = 235853
    if (e && e.scene) {
      const scene = decodeURIComponent(e.scene) // 澶勭悊鎵爜杩涘晢鍝佽鎯呴〉闈㈢殑閫昏緫
      if (scene && scene.split(',').length >= 2) {
        e.id = scene.split(',')[0]
        wx.setStorageSync('referrer', scene.split(',')[1])
      }
    }
    this.data.goodsId = e.id
    const that = this
    this.data.kjJoinUid = e.kjJoinUid    
    this.setData({
      goodsDetailSkuShowType: CONFIG.goodsDetailSkuShowType,
      curuid: wx.getStorageSync('uid')
    })
    this.reputation(e.id)
    this.shippingCartInfo()
  },  
  async shippingCartInfo(){
    const token = wx.getStorageSync('token')
    if (!token) {
      return
    }
    const res = await WXAPI.shippingCarInfo(token)
    if (res.code == 0) {
      this.setData({
        shopNum: res.data.number
      })
    }
  },
  onShow (){
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.setData({
          wxlogin: isLogined
        })
        this.goodsFavCheck()
      }
    })
    this.getGoodsDetailAndKanjieInfo(this.data.goodsId)
  },
  async goodsFavCheck() {
    WXAPI.goodsFavList({
      token: wx.getStorageSync('token')
    })
    const res = await WXAPI.goodsFavCheck(wx.getStorageSync('token'), this.data.goodsId)
    if (res.code == 0) {
      this.setData({
        faved: true
      })
    } else {
      this.setData({
        faved: false
      })
    }
  },
  async addFav(){
    AUTH.checkHasLogined().then(isLogined => {
      this.setData({
        wxlogin: isLogined
      })
      if (isLogined) {
        if (this.data.faved) {
          // 鍙栨秷鏀惰棌
          WXAPI.goodsFavDelete(wx.getStorageSync('token'), '', this.data.goodsId).then(res => {
            this.goodsFavCheck()
          })
        } else {
          // 鍔犲叆鏀惰棌
          WXAPI.goodsFavPut(wx.getStorageSync('token'), this.data.goodsId).then(res => {
            this.goodsFavCheck()
          })
        }
      }
    })
  },
  async getGoodsDetailAndKanjieInfo(goodsId) {
    const that = this;
    const goodsDetailRes = await WXAPI.goodsDetail(goodsId)
    const goodsKanjiaSetRes = await WXAPI.kanjiaSet(goodsId)
    if (goodsDetailRes.code == 0) {
      var selectSizeTemp = SelectSizePrefix;
      if (goodsDetailRes.data.properties) {
        for (var i = 0; i < goodsDetailRes.data.properties.length; i++) {
          selectSizeTemp = selectSizeTemp + " " + goodsDetailRes.data.properties[i].name;
        }
        that.setData({
          hasMoreSelect: true,
          selectSize: selectSizeTemp,
          selectSizePrice: goodsDetailRes.data.basicInfo.minPrice,
          selectSizeOPrice: goodsDetailRes.data.basicInfo.originalPrice,
          totalScoreToPay: goodsDetailRes.data.basicInfo.minScore
        });
      }
      if (goodsDetailRes.data.basicInfo.shopId) {
        this.shopSubdetail(goodsDetailRes.data.basicInfo.shopId)
      }
      if (goodsDetailRes.data.basicInfo.pingtuan) {
        that.pingtuanList(goodsId)
      }
      that.data.goodsDetail = goodsDetailRes.data;
      if (goodsDetailRes.data.basicInfo.videoId) {
        that.getVideoSrc(goodsDetailRes.data.basicInfo.videoId);
      }
      let _data = {
        goodsDetail: goodsDetailRes.data,
        selectSizePrice: goodsDetailRes.data.basicInfo.minPrice,
        selectSizeOPrice: goodsDetailRes.data.basicInfo.originalPrice,
        totalScoreToPay: goodsDetailRes.data.basicInfo.minScore,
        buyNumMax: goodsDetailRes.data.basicInfo.stores,
        buyNumber: (goodsDetailRes.data.basicInfo.stores > 0) ? 1 : 0
      }
      if (goodsKanjiaSetRes.code == 0) {
        _data.curGoodsKanjia = goodsKanjiaSetRes.data[0]
        that.data.kjId = _data.curGoodsKanjia.id
        // 鑾峰彇褰撳墠鐮嶄环杩涘害
        if (!that.data.kjJoinUid) {
          that.data.kjJoinUid = wx.getStorageSync('uid')
        }
        const curKanjiaprogress = await WXAPI.kanjiaDetail(_data.curGoodsKanjia.id, that.data.kjJoinUid)
        const myHelpDetail = await WXAPI.kanjiaHelpDetail(wx.getStorageSync('token'), _data.curGoodsKanjia.id, that.data.kjJoinUid)
        if (curKanjiaprogress.code == 0) {
          _data.curKanjiaprogress = curKanjiaprogress.data
        }
        if (myHelpDetail.code == 0) {
          _data.myHelpDetail = myHelpDetail.data
        }
      }
      if (goodsDetailRes.data.basicInfo.pingtuan) {
        const pingtuanSetRes = await WXAPI.pingtuanSet(goodsId)
        if (pingtuanSetRes.code == 0) {
          _data.pingtuanSet = pingtuanSetRes.data
          // 濡傛灉鏄嫾鍥㈠晢鍝侊紝 榛樿鏄剧ず鎷煎洟浠锋牸
          _data.selectSizePrice = goodsDetailRes.data.basicInfo.pingtuanPrice
        }        
      }
      that.setData(_data);
    }
  },
  async shopSubdetail(shopId){
    const res = await WXAPI.shopSubdetail(shopId)
    if (res.code == 0) {
      this.setData({
        shopSubdetail: res.data
      })
    }
  },
  goShopCar: function() {
    wx.reLaunch({
      url: "/pages/shop-cart/index"
    });
  },
  toAddShopCar: function() {
    this.setData({
      shopType: "addShopCar"
    })
    this.bindGuiGeTap();
  },
  tobuy: function() {
    this.setData({
      shopType: "tobuy"
    });
    this.bindGuiGeTap();
  },
  toPingtuan: function(e) {
    let pingtuanopenid = 0
    if (e.currentTarget.dataset.pingtuanopenid) {
      pingtuanopenid = e.currentTarget.dataset.pingtuanopenid
    }
    this.setData({
      shopType: "toPingtuan",
      selectSizePrice: this.data.goodsDetail.basicInfo.pingtuanPrice,
      selectSizeOPrice: this.data.goodsDetail.basicInfo.originalPrice,
      pingtuanopenid: pingtuanopenid,
      
      hideShopPopup: false,
      skuGoodsPic: this.data.goodsDetail.basicInfo.pic
    });
    
  },
  /**
   * 瑙勬牸閫夋嫨寮瑰嚭妗?
   */
  bindGuiGeTap: function() {
    this.setData({
      hideShopPopup: false,
      selectSizePrice: this.data.goodsDetail.basicInfo.minPrice,
      selectSizeOPrice: this.data.goodsDetail.basicInfo.originalPrice,
      skuGoodsPic: this.data.goodsDetail.basicInfo.pic
    })
  },
  /**
   * 瑙勬牸閫夋嫨寮瑰嚭妗嗛殣钘?
   */
  closePopupTap: function() {
    this.setData({
      hideShopPopup: true
    })
  },
  numJianTap: function() {
    if (this.data.buyNumber > this.data.buyNumMin) {
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  numJiaTap: function() {
    if (this.data.buyNumber < this.data.buyNumMax) {
      var currentNum = this.data.buyNumber;
      currentNum++;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  /**
   * 閫夋嫨鍟嗗搧瑙勬牸
   * @param {Object} e
   */
  async labelItemTap(e) {
    const propertyindex = e.currentTarget.dataset.propertyindex
    const propertychildindex = e.currentTarget.dataset.propertychildindex

    const property = this.data.goodsDetail.properties[propertyindex]
    const child = property.childsCurGoods[propertychildindex]
    // 鍙栨秷璇ュ垎绫讳笅鐨勫瓙鏍忕洰鎵€鏈夌殑閫変腑鐘舵€?
    property.childsCurGoods.forEach(child => {
      child.active = false
    })
    // 璁剧疆褰撳墠閫変腑鐘舵€?
    property.optionValueId = child.id
    child.active = true
    // 鑾峰彇鎵€鏈夌殑閫変腑瑙勬牸灏哄鏁版嵁
    const needSelectNum = this.data.goodsDetail.properties.length
    let curSelectNum = 0;
    let propertyChildIds = "";
    let propertyChildNames = "";

    this.data.goodsDetail.properties.forEach(p => {
      p.childsCurGoods.forEach(c => {
        if (c.active) {
          curSelectNum++;
          propertyChildIds = propertyChildIds + p.id + ":" + c.id + ",";
          propertyChildNames = propertyChildNames + p.name + ":" + c.name + "  ";
        }
      })
    })
    let canSubmit = false;
    if (needSelectNum == curSelectNum) {
      canSubmit = true;
    }
    // 璁＄畻褰撳墠浠锋牸
    if (canSubmit) {
      const res = await WXAPI.goodsPrice(this.data.goodsDetail.basicInfo.id, propertyChildIds)
      if (res.code == 0) {
        let _price = res.data.price
        if (this.data.shopType == 'toPingtuan') {
          _price = res.data.pingtuanPrice
        }
        this.setData({
          selectSizePrice: _price,
          selectSizeOPrice: res.data.originalPrice,
          totalScoreToPay: res.data.score,
          propertyChildIds: propertyChildIds,
          propertyChildNames: propertyChildNames,
          buyNumMax: res.data.stores,
          buyNumber: (res.data.stores > 0) ? 1 : 0
        });
      }
    }
    let skuGoodsPic = this.data.skuGoodsPic
    if (this.data.goodsDetail.subPics && this.data.goodsDetail.subPics.length > 0) {
      const _subPic = this.data.goodsDetail.subPics.find(ele => {
        return ele.optionValueId == child.id
      })
      if (_subPic) {
        skuGoodsPic = _subPic.pic
      }
    }
    this.setData({
      goodsDetail: this.data.goodsDetail,
      canSubmit: canSubmit,
      skuGoodsPic
    })
  },
  /**
   * 鍔犲叆璐墿杞?
   */
  async addShopCar() {
    if (this.data.goodsDetail.properties && !this.data.canSubmit) {
      if (!this.data.canSubmit) {
        wx.showToast({
          title: '璇烽€夋嫨瑙勬牸',
          icon: 'none'
        })
      }
      this.bindGuiGeTap()
      return
    }
    if (this.data.buyNumber < 1) {
      wx.showToast({
        title: '璇烽€夋嫨璐拱鏁伴噺',
        icon: 'none'
      })
      return
    }
    const isLogined = await AUTH.checkHasLogined()
    if (!isLogined) {
      this.setData({
        wxlogin: false
      })
      return
    }
    const token = wx.getStorageSync('token')
    const goodsId = this.data.goodsDetail.basicInfo.id
    const sku = []
    if (this.data.goodsDetail.properties) {
      this.data.goodsDetail.properties.forEach(p => {
        sku.push({
          optionId: p.id,
          optionValueId: p.optionValueId
        })
      })
    }
    const res = await WXAPI.shippingCarInfoAddItem(token, goodsId, this.data.buyNumber, sku)
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }

    this.closePopupTap();
    wx.showToast({
      title: '鍔犲叆璐墿杞?,
      icon: 'success'
    })
    this.shippingCartInfo()
  },
  /**
   * 绔嬪嵆璐拱
   */
  buyNow: function(e) {
    let that = this
    let shoptype = e.currentTarget.dataset.shoptype
    console.log(shoptype)
    if (this.data.goodsDetail.properties && !this.data.canSubmit) {
      if (!this.data.canSubmit) {
        wx.showModal({
          title: '鎻愮ず',
          content: '璇烽€夋嫨鍟嗗搧瑙勬牸锛?,
          showCancel: false
        })
      }
      this.bindGuiGeTap();
      wx.showModal({
        title: '鎻愮ず',
        content: '璇峰厛閫夋嫨瑙勬牸灏哄鍝',
        showCancel: false
      })
      return;
    }
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '鎻愮ず',
        content: '璐拱鏁伴噺涓嶈兘涓?锛?,
        showCancel: false
      })
      return;
    }
    //缁勫缓绔嬪嵆璐拱淇℃伅
    var buyNowInfo = this.buliduBuyNowInfo(shoptype);
    // 鍐欏叆鏈湴瀛樺偍
    wx.setStorage({
      key: "buyNowInfo",
      data: buyNowInfo
    })
    this.closePopupTap();
    if (shoptype == 'toPingtuan') {
      if (this.data.pingtuanopenid) {
        wx.navigateTo({
          url: "/pages/to-pay-order/index?orderType=buyNow&pingtuanOpenId=" + this.data.pingtuanopenid
        })
      } else {
        WXAPI.pingtuanOpen(wx.getStorageSync('token'), that.data.goodsDetail.basicInfo.id).then(function(res) {
          if (res.code == 2000) {
            that.setData({
              wxlogin: false
            })
            return
          }
          if (res.code != 0) {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
            return
          }
          wx.navigateTo({
            url: "/pages/to-pay-order/index?orderType=buyNow&pingtuanOpenId=" + res.data.id
          })
        })
      }
    } else {
      wx.navigateTo({
        url: "/pages/to-pay-order/index?orderType=buyNow"
      })
    }

  },
  /**
   * 缁勫缓绔嬪嵆璐拱淇℃伅
   */
  buliduBuyNowInfo: function(shoptype) {
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
    shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
    shopCarMap.name = this.data.goodsDetail.basicInfo.name;
    // shopCarMap.label=this.data.goodsDetail.basicInfo.id; 瑙勬牸灏哄 
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.selectSizePrice;
    // if (shoptype == 'toPingtuan') { // 20190714 鎷煎洟浠锋牸娉ㄩ噴鎺?
    //   shopCarMap.price = this.data.goodsDetail.basicInfo.pingtuanPrice;
    // }
    shopCarMap.score = this.data.totalScoreToPay;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
    shopCarMap.logistics = this.data.goodsDetail.logistics;
    shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;

    var buyNowInfo = {};
    buyNowInfo.shopNum = 0;
    buyNowInfo.shopList = [];
    
    /*    var hasSameGoodsIndex = -1;
        for (var i = 0; i < toBuyInfo.shopList.length; i++) {
          var tmpShopCarMap = toBuyInfo.shopList[i];
          if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
            hasSameGoodsIndex = i;
            shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
            break;
          }
        }
        toBuyInfo.shopNum = toBuyInfo.shopNum + this.data.buyNumber;
        if (hasSameGoodsIndex > -1) {
          toBuyInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
        } else {
          toBuyInfo.shopList.push(shopCarMap);
        }*/

    buyNowInfo.shopList.push(shopCarMap);
    buyNowInfo.kjId = this.data.kjId;
    return buyNowInfo;
  },
  onShareAppMessage() {
    let _data = {
      title: this.data.goodsDetail.basicInfo.name,
      path: '/pages/goods-details/index?id=' + this.data.goodsDetail.basicInfo.id + '&inviter_id=' + wx.getStorageSync('uid'),
      success: function(res) {
        // 杞彂鎴愬姛
      },
      fail: function(res) {
        // 杞彂澶辫触
      }
    }
    if (this.data.kjJoinUid) {
      _data.title = this.data.curKanjiaprogress.joiner.nick + '閭€璇锋偍甯甌A鐮嶄环'
      _data.path += '&kjJoinUid=' + this.data.kjJoinUid
    }
    return _data
  },
  reputation: function(goodsId) {
    var that = this;
    WXAPI.goodsReputation({
      goodsId: goodsId
    }).then(function(res) {
      if (res.code == 0) {
        that.setData({
          reputation: res.data
        });
      }
    })
  },
  pingtuanList: function(goodsId) {
    var that = this;
    WXAPI.pingtuanList({
      goodsId: goodsId,
      status: 0
    }).then(function(res) {
      if (res.code == 0) {
        that.setData({
          pingtuanList: res.data.result
        });
      }
    })
  },
  getVideoSrc: function(videoId) {
    var that = this;
    WXAPI.videoDetail(videoId).then(function(res) {
      if (res.code == 0) {
        that.setData({
          videoMp4Src: res.data.fdMp4
        });
      }
    })
  },
  joinKanjia(){
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.doneJoinKanjia();
      } else {
        this.setData({
          wxlogin: false
        })
      }
    })
  },
  doneJoinKanjia: function() { // 鎶ュ悕鍙傚姞鐮嶄环娲诲姩
    const _this = this;
    if (!_this.data.curGoodsKanjia) {
      return;
    }
    wx.showLoading({
      title: '鍔犺浇涓?,
      mask: true
    })
    WXAPI.kanjiaJoin(wx.getStorageSync('token'), _this.data.curGoodsKanjia.id).then(function(res) {
      wx.hideLoading()
      if (res.code == 0) {
        _this.setData({
          kjJoinUid: wx.getStorageSync('uid'),
          myHelpDetail: null
        })
        _this.getGoodsDetailAndKanjieInfo(_this.data.goodsDetail.basicInfo.id)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  joinPingtuan: function(e) {
    let pingtuanopenid = e.currentTarget.dataset.pingtuanopenid
    wx.navigateTo({
      url: "/pages/to-pay-order/index?orderType=buyNow&pingtuanOpenId=" + pingtuanopenid
    })
  },
  goIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    });
  },
  helpKanjia() {
    const _this = this;
    AUTH.checkHasLogined().then(isLogined => {
      _this.setData({
        wxlogin: isLogined
      })
      if (isLogined) {
        _this.helpKanjiaDone()
      }
    })
  },
  helpKanjiaDone(){
    const _this = this;
    WXAPI.kanjiaHelp(wx.getStorageSync('token'), _this.data.kjId, _this.data.kjJoinUid, '').then(function (res) {
      if (res.code != 0) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return;
      }
      _this.setData({
        myHelpDetail: res.data
      });
      wx.showModal({
        title: '鎴愬姛',
        content: '鎴愬姛甯甌A鐮嶆帀 ' + res.data.cutPrice + ' 鍏?,
        showCancel: false
      })
      _this.getGoodsDetailAndKanjieInfo(_this.data.goodsDetail.basicInfo.id)
    })
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
  closePop(){
    this.setData({
      posterShow: false
    })
  },
  previewImage(e){
    const url = e.currentTarget.dataset.url
    wx.previewImage({
      current: url, // 褰撳墠鏄剧ず鍥剧墖鐨刪ttp閾炬帴
      urls: [url] // 闇€瑕侀瑙堢殑鍥剧墖http閾炬帴鍒楄〃
    })
  },
  async drawSharePic() {
    const _this = this
    const qrcodeRes = await WXAPI.wxaQrcode({
      scene: _this.data.goodsDetail.basicInfo.id + ',' + wx.getStorageSync('uid'),
      page: 'pages/goods-details/index',
      is_hyaline: true,
      autoColor: true,
      expireHours: 1
    })
    if (qrcodeRes.code != 0) {
      wx.showToast({
        title: qrcodeRes.msg,
        icon: 'none'
      })
      return
    }
    const qrcode = qrcodeRes.data
    const pic = _this.data.goodsDetail.basicInfo.pic
    wx.getImageInfo({
      src: pic,
      success(res) {
        const height = 490 * res.height / res.width
        _this.drawSharePicDone(height, qrcode)
      },
      fail(e) {
        console.error(e)
      }
    })
  },
  drawSharePicDone(picHeight, qrcode) {
    const _this = this
    const _baseHeight = 74 + (picHeight + 120)
    this.setData({
      posterConfig: {
        width: 750,
        height: picHeight + 660,
        backgroundColor: '#fff',
        debug: false,
        blocks: [
          {
            x: 76,
            y: 74,
            width: 604,
            height: picHeight + 120,
            borderWidth: 2,
            borderColor: '#c2aa85',
            borderRadius: 8
          }
        ],
        images: [
          {
            x: 133,
            y: 133,
            url: _this.data.goodsDetail.basicInfo.pic, // 鍟嗗搧鍥剧墖
            width: 490,
            height: picHeight
          },
          {
            x: 76,
            y: _baseHeight + 199,
            url: qrcode, // 浜岀淮鐮?
            width: 222,
            height: 222
          }
        ],
        texts: [
          {
            x: 375,
            y: _baseHeight + 80,
            width: 650,
            lineNum:2,
            text: _this.data.goodsDetail.basicInfo.name,
            textAlign: 'center',
            fontSize: 40,
            color: '#333'
          },
          {
            x: 375,
            y: _baseHeight + 180,
            text: '锟? + _this.data.goodsDetail.basicInfo.minPrice,
            textAlign: 'center',
            fontSize: 50,
            color: '#e64340'
          },
          {
            x: 352,
            y: _baseHeight + 320,
            text: '闀挎寜璇嗗埆灏忕▼搴忕爜',
            fontSize: 28,
            color: '#999'
          }
        ],
      }
    }, () => {
      Poster.create();
    });
  },
  onPosterSuccess(e) {
    console.log('success:', e)
    this.setData({
      posterImg: e.detail,
      showposterImg: true
    })
  },
  onPosterFail(e) {
    console.error('fail:', e)
  },
  savePosterPic() {
    const _this = this
    wx.saveImageToPhotosAlbum({
      filePath: this.data.posterImg,
      success: (res) => {
        wx.showModal({
          content: '宸蹭繚瀛樺埌鎵嬫満鐩稿唽',
          showCancel: false,
          confirmText: '鐭ラ亾浜?,
          confirmColor: '#333'
        })
      },
      complete: () => {
        _this.setData({
          showposterImg: false
        })
      },
      fail: (res) => {
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
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

  ,
  onPhoneInput(e) { this.setData({ loginPhone: e.detail.value }) },
  onPasswordInput(e) { this.setData({ loginPassword: e.detail.value }) },
  async processPhoneLogin() {
    const phone = this.data.loginPhone, pwd = this.data.loginPassword
    if (!phone || phone.length !== 11) { wx.showToast({ title: '请输入手机号', icon: 'none' }); return }
    if (!pwd) { wx.showToast({ title: '请输入密码', icon: 'none' }); return }
    wx.showLoading({ title: '登录中...' })
    const res = await WXAPI.login(phone, pwd)
    wx.hideLoading()
    if (res.code === 0) {
      this.setData({ wxlogin: true, loginPhone: '', loginPassword: '' })
      this.onShow()
      wx.showToast({ title: '登录成功', icon: 'success' })
    } else { wx.showToast({ title: res.message || '登录失败', icon: 'none' }) }
  },
  async processRegister() {
    const phone = this.data.loginPhone, pwd = this.data.loginPassword
    if (!phone || phone.length !== 11) { wx.showToast({ title: '请输入手机号', icon: 'none' }); return }
    if (!pwd || pwd.length < 4) { wx.showToast({ title: '密码至少4位', icon: 'none' }); return }
    wx.showLoading({ title: '注册中...' })
    const res = await WXAPI.register(phone, pwd, '茶友')
    wx.hideLoading()
    if (res.code === 0) {
      this.setData({ wxlogin: true })
      this.onShow()
      wx.showToast({ title: '注册成功', icon: 'success' })
    } else { wx.showToast({ title: res.message || '注册失败', icon: 'none' }) }
  }
})