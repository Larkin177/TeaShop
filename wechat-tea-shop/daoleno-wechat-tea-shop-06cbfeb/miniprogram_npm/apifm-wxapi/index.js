var API_BASE = 'http://localhost:3001/api';
function getToken() { return wx.getStorageSync('token') || ''; }
function request(url, method, data) {
  if (method === undefined) method = 'GET';
  if (data === undefined) data = {};
  return new Promise(function(resolve) {
    var header = { 'Content-Type': 'application/json' };
    var token = getToken();
    if (token) header['Authorization'] = 'Bearer ' + token;
    wx.request({
      url: API_BASE + url, method: method, header: header, data: data,
      success: function(res) {
        var r = res.data;
        if (r.code === 200) { resolve({ code: 0, data: r.data, message: r.message }); }
        else { resolve({ code: 700, message: r.message || 'Request failed' }); }
      },
      fail: function(err) { resolve({ code: 700, message: 'Network error' }); }
    });
  });
}
function login(phone, password) {
  return request('/auth/login', 'POST', { phone: phone, password: password }).then(function(res) {
    if (res.code === 0 && res.data && res.data.token) {
      wx.setStorageSync('token', res.data.token);
      wx.setStorageSync('uid', res.data.user ? res.data.user.id : '');
      wx.setStorageSync('userInfo', res.data.user);
    }
    return res;
  });
}
function register(phone, password, nickname) {
  return request('/auth/register', 'POST', { phone: phone, password: password, nickname: nickname });
}
function checkToken(token) {
  return new Promise(function(resolve) { token ? resolve({ code: 0 }) : resolve({ code: 700 }); });
}
function bindMobileWxa() { return Promise.resolve({ code: 700 }); }
function userDetail(token) {
  return request('/user/info').then(function(res) {
    if (res.code === 0 && res.data) {
      var u = res.data;
      res.data = { base: { id: u.id, mobile: u.phone, nick: u.nickname, nickname: u.nickname, avatar: u.avatar || '', isSeller: false } };
    }
    return res;
  });
}
function userAmount(token) {
  return request('/user/info').then(function(res) {
    if (res.code === 0) { return { code: 0, data: { balance: 0, freeze: 0, score: res.data.points || 0, growth: (res.data.membershipLevel || 1) * 100 } }; }
    return { code: 0, data: { balance: 0, freeze: 0, score: 0, growth: 0 } };
  });
}
function updateUserInfo(data) { return request('/auth/profile', 'PUT', data); }
function goodsCategory() {
  return request('/categories').then(function(res) {
    if (res.code === 0) { res.data = res.data.map(function(c) { return Object.assign({}, c, { level: 1, pid: 0, icon: c.icon || '' }); }); }
    return res;
  });
}
function transformProduct(p) {
  return { id: p.id, name: p.name, pic: p.image || '', minPrice: p.base_price, originalPrice: p.base_price, numberSells: p.monthly_sales || 0, category_id: p.category_id, characteristic: p.description || '', status: p.status, stores: 999 };
}
function transformProductDetail(p) {
  return { basicInfo: transformProduct(p), content: p.description || '', pics: p.image ? [p.image] : [], properties: (p.spec_groups || []).map(function(g) { return { id: g.id, name: g.group_name, childsCurGoods: (g.options || []).map(function(o) { return { id: o.id, name: o.name, propertyId: g.id, haveAnomaly: o.extra_price > 0 ? 1 : 0, anomalyPrice: o.extra_price }; }) }; }), extJson: { postage: 0 } };
}
function goods(params) {
  var url = '/products';
  var query = [];
  if (params && params.categoryId) query.push('category_id=' + params.categoryId);
  if (params && params.keyword) query.push('keyword=' + encodeURIComponent(params.keyword));
  if (params && params.name) query.push('keyword=' + encodeURIComponent(params.name));
  if (query.length > 0) url += '?' + query.join('&');
  if (params && params.recommendStatus) {
    return request('/products/recommended').then(function(rec) {
      if (rec.code === 0) { rec.data = rec.data.map(transformProduct); var page = params.page || 1, pageSize = params.pageSize || 20; return { code: 0, data: rec.data.slice((page-1)*pageSize, page*pageSize) }; }
      return rec;
    });
  }
  return request(url).then(function(res) { if (res.code === 0) res.data = res.data.map(transformProduct); return res; });
}
function goodsDetail(id) { return request('/products/' + id).then(function(res) { if (res.code === 0) res.data = transformProductDetail(res.data); return res; }); }
function goodsPrice(id) { return request('/products/' + id).then(function(res) { if (res.code === 0) return { code: 0, data: { minPrice: res.data.base_price } }; return res; }); }
function goodsReputation() { return { code: 0, data: [] }; }
function goodsDynamic() { return { code: 700 }; }
function goodsFavList() { return { code: 0, data: [] }; }
function goodsFavPut() { return { code: 0 }; }
function goodsFavDelete() { return { code: 0 }; }
function goodsFavCheck() { return { code: 0, data: { status: 0 } }; }
function shippingCarInfo(token) {
  return request('/cart').then(function(res) {
    if (res.code === 0) {
      var items = (res.data || []).map(function(c) { return { key: '' + c.id, goodsId: c.productId, name: c.productName || '', number: c.quantity, price: c.unitPrice, pic: '', left: 'margin-left:0px' }; });
      var number = items.reduce(function(s, i) { return s + i.number; }, 0);
      return { code: 0, data: { items: items, number: number } };
    }
    return res;
  });
}
function shippingCarInfoAddItem(token, goodsId, number, sku) { return request('/cart', 'POST', { product_id: goodsId, quantity: number || 1, specs: {}, toppings: [] }); }
function shippingCarInfoModifyNumber(token, key, number) { return request('/cart/' + key, 'PUT', { quantity: number }); }
function shippingCarInfoRemoveItem(token, key) { return request('/cart/' + key, 'DELETE'); }
function shippingCarInfoRemoveAll(token) { return request('/cart', 'DELETE'); }
function banners() {
  return request('/banners').then(function(res) {
    if (res.code === 0) { res.data = (res.data || []).map(function(b) { return { id: b.id, picUrl: b.image, linkUrl: b.link || '' }; }); }
    return res;
  });
}
function fetchShops(params) {
  return request('/stores').then(function(res) {
    if (res.code === 0) { var shops = res.data || []; if (params && params.nameLike) shops = shops.filter(function(s) { return s.name.indexOf(params.nameLike) >= 0; }); shops = shops.map(function(s) { return Object.assign({}, s, { distance: Math.floor(Math.random() * 500 + 50) }); }); return { code: 0, data: shops }; }
    return res;
  });
}
function shopSubdetail(shopId) { return request('/stores/' + shopId); }
function coupons() { return request('/coupons'); }
function fetchCoupons() { return request('/coupons'); }
function myCoupons() { return request('/coupons/my'); }
function orderCreate(data) { return request('/orders', 'POST', data); }
function orderList(params) { var url = '/orders'; if (params && params.status !== undefined && params.status !== '') url += '?status=' + params.status; return request(url); }
function orderDetail(id) { return request('/orders/' + id); }
function orderClose(id) { return request('/orders/' + id + '/cancel', 'PUT'); }
function orderPay(token, orderId) { return request('/orders/' + orderId + '/pay', 'PUT'); }
function orderDelivery() { return { code: 700 }; }
function orderStatistics() { return request('/orders'); }
function orderReputation() { return { code: 0 }; }
function orderHX() { return { code: 700 }; }
function queryAddress() { return request('/user/addresses'); }
function defaultAddress() { return request('/user/addresses').then(function(res) { if (res.code === 0 && res.data && res.data.length > 0) return { code: 0, data: res.data[0] }; return { code: 700 }; }); }
function addAddress(data) { return request('/user/addresses', 'POST', data); }
function updateAddress(data) { return request('/user/addresses/' + data.id, 'PUT', data); }
function deleteAddress(id) { return request('/user/addresses/' + id, 'DELETE'); }
function addressDetail() { return request('/user/addresses'); }
function province() { return { code: 0, data: [{ id: 1, name: '\u6D59\u6C5F\u7701' }, { id: 2, name: '\u6C5F\u82CF\u7701' }, { id: 3, name: '\u4E0A\u6D77\u5E02' }] }; }
function nextRegion(pid) { var m = { 1: [{ id: 11, name: '\u676D\u5DDE\u5E02' }, { id: 12, name: '\u5B81\u6CE2\u5E02' }], 2: [{ id: 21, name: '\u5357\u4EAC\u5E02' }, { id: 22, name: '\u82CF\u5DDE\u5E02' }], 3: [{ id: 31, name: '\u4E0A\u6D77\u5E02' }] }; return { code: 0, data: m[pid] || [] }; }
function scoreSign() { return { code: 0, data: { score: 5 } }; }
function scoreSignLogs() { return { code: 0, data: { dataList: [] } }; }
function scoreLogs() { return { code: 0, data: { dataList: [] } }; }
function scoreExchange() { return { code: 700 }; }
function exchangeScoreToGrowth() { return { code: 700 }; }
function scoreDeductionRules() { return { code: 0, data: [] }; }
function growthLogs() { return { code: 0, data: { dataList: [] } }; }
function depositList() { return { code: 0, data: [] }; }
function payDeposit() { return { code: 700 }; }
function payBill() { return { code: 700 }; }
function payBillDiscounts() { return { code: 0, data: [] }; }
function rechargeSendRules() { return { code: 700 }; }
function withDrawApply() { return { code: 700 }; }
function withDrawLogs() { return { code: 0, data: { dataList: [] } }; }
function cashLogsV2() { return { code: 0, data: { dataList: [] } }; }
function fxApply() { return { code: 700 }; }
function fxApplyProgress() { return { code: 700 }; }
function fxMembers() { return { code: 0, data: { dataList: [] } }; }
function fxCommisionLog() { return { code: 0, data: { dataList: [] } }; }
function kanjiaSet() { return { code: 700 }; }
function kanjiaDetail() { return { code: 700 }; }
function kanjiaJoin() { return { code: 700 }; }
function kanjiaHelp() { return { code: 700 }; }
function kanjiaHelpDetail() { return { code: 700 }; }
function pingtuanSet() { return { code: 700 }; }
function pingtuanList() { return { code: 0, data: [] }; }
function pingtuanOpen() { return { code: 700 }; }
function noticeList() { return { code: 0, data: { dataList: [] } }; }
function noticeDetail() { return { code: 700 }; }
function refundApply() { return { code: 700 }; }
function refundApplyCancel() { return { code: 700 }; }
function refundApplyDetail() { return { code: 700 }; }
function invoiceList() { return { code: 0, data: { dataList: [] } }; }
function invoiceApply() { return { code: 700 }; }
function wuliuInfo() { return { code: 700 }; }
function wxaQrcode() { return { code: 700 }; }
function videoDetail() { return { code: 700 }; }
function wxaMpLiveRooms() { return { code: 0, data: [] }; }
function uploadFile() { return { code: 700 }; }
function login_wx(code) { return request('/auth/wx-mini-login', 'POST', { code: code }); }
function login_wx_with_info(code, nickname, avatar) { return request('/auth/wx-mini-login', 'POST', { code: code, nickname: nickname, avatar: avatar }); }
function register_complex(params) { return request('/auth/wx-mini-register', 'POST', params); }
module.exports = {
  login: login, register: register, checkToken: checkToken, bindMobileWxa: bindMobileWxa, login_wx: login_wx, login_wx_with_info: login_wx_with_info, register_complex: register_complex,
  userDetail: userDetail, userAmount: userAmount, updateUserInfo: updateUserInfo,
  goodsCategory: goodsCategory, goods: goods, goodsDetail: goodsDetail, goodsPrice: goodsPrice, goodsReputation: goodsReputation, goodsDynamic: goodsDynamic,
  goodsFavList: goodsFavList, goodsFavPut: goodsFavPut, goodsFavDelete: goodsFavDelete, goodsFavCheck: goodsFavCheck,
  shippingCarInfo: shippingCarInfo, shippingCarInfoAddItem: shippingCarInfoAddItem, shippingCarInfoModifyNumber: shippingCarInfoModifyNumber, shippingCarInfoRemoveAll: shippingCarInfoRemoveAll, shippingCarInfoRemoveItem: shippingCarInfoRemoveItem,
  banners: banners, fetchShops: fetchShops, shopSubdetail: shopSubdetail,
  coupons: coupons, fetchCoupons: fetchCoupons, myCoupons: myCoupons,
  orderCreate: orderCreate, orderList: orderList, orderDetail: orderDetail, orderClose: orderClose, orderPay: orderPay, orderDelivery: orderDelivery, orderStatistics: orderStatistics, orderReputation: orderReputation, orderHX: orderHX,
  queryAddress: queryAddress, defaultAddress: defaultAddress, addAddress: addAddress, updateAddress: updateAddress, deleteAddress: deleteAddress, addressDetail: addressDetail,
  province: province, nextRegion: nextRegion,
  scoreSign: scoreSign, scoreSignLogs: scoreSignLogs, scoreLogs: scoreLogs, scoreExchange: scoreExchange, exchangeScoreToGrowth: exchangeScoreToGrowth, scoreDeductionRules: scoreDeductionRules, growthLogs: growthLogs,
  depositList: depositList, payDeposit: payDeposit, payBill: payBill, payBillDiscounts: payBillDiscounts, rechargeSendRules: rechargeSendRules,
  withDrawApply: withDrawApply, withDrawLogs: withDrawLogs, cashLogsV2: cashLogsV2,
  fxApply: fxApply, fxApplyProgress: fxApplyProgress, fxMembers: fxMembers, fxCommisionLog: fxCommisionLog,
  kanjiaSet: kanjiaSet, kanjiaDetail: kanjiaDetail, kanjiaJoin: kanjiaJoin, kanjiaHelp: kanjiaHelp, kanjiaHelpDetail: kanjiaHelpDetail, pingtuanSet: pingtuanSet, pingtuanList: pingtuanList, pingtuanOpen: pingtuanOpen,
  noticeList: noticeList, noticeDetail: noticeDetail,
  refundApply: refundApply, refundApplyCancel: refundApplyCancel, refundApplyDetail: refundApplyDetail,
  invoiceList: invoiceList, invoiceApply: invoiceApply, wuliuInfo: wuliuInfo,
  wxaQrcode: wxaQrcode, videoDetail: videoDetail, wxaMpLiveRooms: wxaMpLiveRooms, uploadFile: uploadFile,
  init: function() {}
};
