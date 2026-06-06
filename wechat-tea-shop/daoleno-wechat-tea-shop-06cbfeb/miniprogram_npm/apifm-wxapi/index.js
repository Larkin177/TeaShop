/**
 * TeaShop API Adapter - Maps apifm-wxapi to Spring Boot backend
 */
const API_BASE = 'http://localhost:3001/api'

function getToken() { return wx.getStorageSync('token') || '' }

function request(url, method = 'GET', data = {}) {
  return new Promise((resolve) => {
    const header = { 'Content-Type': 'application/json' }
    const token = getToken()
    if (token) header['Authorization'] = 'Bearer ' + token
    wx.request({
      url: API_BASE + url, method, header, data,
      success(res) {
        const r = res.data
        if (r.code === 200) resolve({ code: 0, data: r.data, message: r.message })
        else resolve({ code: 700, message: r.message || 'Request failed' })
      },
      fail(err) { resolve({ code: 700, message: 'Network error: ' + err.errMsg }) }
    })
  })
}

// ============ Auth ============
async function login(phone, password) {
  const res = await request('/auth/login', 'POST', { phone, password })
  if (res.code === 0 && res.data && res.data.token) {
    wx.setStorageSync('token', res.data.token)
    wx.setStorageSync('uid', res.data.user ? res.data.user.id : '')
    wx.setStorageSync('userInfo', res.data.user)
  }
  return res
}

async function register(phone, password, nickname) {
  return request('/auth/register', 'POST', { phone, password, nickname })
}

function checkToken(token) {
  return new Promise(resolve => { token ? resolve({ code: 0 }) : resolve({ code: 700 }) })
}

function bindMobileWxa() { return Promise.resolve({ code: 700 }) }

// ============ User ============
async function userDetail(token) {
  const res = await request('/user/info')
  if (res.code === 0 && res.data) {
    const u = res.data
    res.data = {
      base: {
        id: u.id,
        mobile: u.phone,
        nick: u.nickname,
        nickname: u.nickname,
        avatar: u.avatar || '',
        isSeller: false
      }
    }
  }
  return res
}

async function userAmount(token) {
  const res = await request('/user/info')
  if (res.code === 0) {
    return { code: 0, data: { balance: 0, freeze: 0, score: res.data.points || 0, growth: (res.data.membershipLevel || 1) * 100, scoreToBalance: 0 } }
  }
  return { code: 0, data: { balance: 0, freeze: 0, score: 0, growth: 0, scoreToBalance: 0 } }
}

async function updateUserInfo(data) { return request('/auth/profile', 'PUT', data) }

// ============ Categories ============
async function goodsCategory() {
  const res = await request('/categories')
  if (res.code === 0) {
    res.data = res.data.map(c => ({ ...c, level: 1, pid: 0, icon: c.icon || '' }))
  }
  return res
}

// ============ Products ============
function transformProduct(p) {
  return {
    id: p.id, name: p.name,
    pic: p.image || '',
    minPrice: p.base_price,
    originalPrice: p.base_price,
    numberSells: p.monthly_sales || 0,
    category_id: p.category_id,
    characteristic: p.description || '',
    status: p.status,
    stores: 999
  }
}

function transformProductDetail(p) {
  const basic = transformProduct(p)
  return {
    basicInfo: basic,
    content: p.description || '',
    pics: p.image ? [p.image] : [],
    properties: (p.spec_groups || []).map(g => ({
      id: g.id, name: g.group_name,
      childsCurGoods: (g.options || []).map(o => ({
        id: o.id, name: o.name, propertyId: g.id,
        haveAnomaly: o.extra_price > 0 ? 1 : 0,
        anomalyPrice: o.extra_price
      }))
    })),
    extJson: { postage: 0 }
  }
}

async function goods(params) {
  let url = '/products'
  const query = []
  if (params && params.categoryId) query.push('category_id=' + params.categoryId)
  if (params && params.keyword) query.push('keyword=' + encodeURIComponent(params.keyword))
  if (params && params.name) query.push('keyword=' + encodeURIComponent(params.name))
  if (query.length > 0) url += '?' + query.join('&')

  if (params && params.recommendStatus) {
    const rec = await request('/products/recommended')
    if (rec.code === 0) {
      rec.data = rec.data.map(transformProduct)
      const page = params.page || 1, pageSize = params.pageSize || 20
      return { code: 0, data: rec.data.slice((page-1)*pageSize, page*pageSize) }
    }
    return rec
  }
  const res = await request(url)
  if (res.code === 0) res.data = res.data.map(transformProduct)
  return res
}

async function goodsDetail(id) {
  const res = await request('/products/' + id)
  if (res.code === 0) res.data = transformProductDetail(res.data)
  return res
}

async function goodsPrice(id) {
  const res = await request('/products/' + id)
  if (res.code === 0) return { code: 0, data: { minPrice: res.data.base_price } }
  return res
}

async function goodsReputation() { return { code: 0, data: [] } }
async function goodsDynamic() { return { code: 700 } }
async function goodsFavList() { return { code: 0, data: [] } }
async function goodsFavPut() { return { code: 0 } }
async function goodsFavDelete() { return { code: 0 } }
async function goodsFavCheck() { return { code: 0, data: { status: 0 } } }

// ============ Cart ============
function shippingCarInfo(token) {
  return new Promise((resolve) => {
    request('/cart').then(res => {
      if (res.code === 0) {
        const items = (res.data || []).map(c => ({
          key: '' + c.id,
          goodsId: c.productId,
          name: c.productName || '',
          number: c.quantity,
          price: c.unitPrice,
          pic: '',
          left: 'margin-left:0px'
        }))
        const number = items.reduce((s, i) => s + i.number, 0)
        resolve({ code: 0, data: { items, number } })
      } else {
        resolve(res)
      }
    })
  })
}

function shippingCarInfoAddItem(token, goodsId, number, sku) {
  return request('/cart', 'POST', { product_id: goodsId, quantity: number || 1, specs: {}, toppings: [] })
}

function shippingCarInfoModifyNumber(token, key, number) {
  return request('/cart/' + key, 'PUT', { quantity: number })
}

function shippingCarInfoRemoveItem(token, key) {
  return request('/cart/' + key, 'DELETE')
}

function shippingCarInfoRemoveAll(token) { return request('/cart', 'DELETE') }

// ============ Banners ============
async function banners() {
  const res = await request('/banners')
  if (res.code === 0) {
    res.data = (res.data || []).map(b => ({ id: b.id, picUrl: b.image, linkUrl: b.link || '' }))
  }
  return res
}

// ============ Stores ============
async function fetchShops(params) {
  const res = await request('/stores')
  if (res.code === 0) {
    let shops = res.data || []
    if (params && params.nameLike) shops = shops.filter(s => s.name.indexOf(params.nameLike) >= 0)
    shops = shops.map(s => ({ ...s, distance: Math.floor(Math.random() * 500 + 50) }))
    return { code: 0, data: shops }
  }
  return res
}

async function shopSubdetail(shopId) { return request('/stores/' + shopId) }

// ============ Coupons ============
async function coupons() { return request('/coupons') }
async function fetchCoupons() { return request('/coupons') }
async function myCoupons() { return request('/coupons/my') }

// ============ Orders ============
async function orderCreate(data) { return request('/orders', 'POST', data) }
async function orderList(params) {
  let url = '/orders'
  if (params && params.status !== undefined && params.status !== '') url += '?status=' + params.status
  return request(url)
}
async function orderDetail(id) { return request('/orders/' + id) }
async function orderClose(id) { return request('/orders/' + id + '/cancel', 'PUT') }
async function orderPay(token, orderId) { return request('/orders/' + orderId + '/pay', 'PUT') }
async function orderDelivery() { return { code: 700 } }
async function orderStatistics() { return request('/orders') }
async function orderReputation() { return { code: 0 } }
async function orderHX() { return { code: 700 } }

// ============ Address ============
async function queryAddress() { return request('/user/addresses') }
async function defaultAddress() {
  const res = await request('/user/addresses')
  if (res.code === 0 && res.data && res.data.length > 0) return { code: 0, data: res.data[0] }
  return { code: 700 }
}
async function addAddress(data) { return request('/user/addresses', 'POST', data) }
async function updateAddress(data) { return request('/user/addresses/' + data.id, 'PUT', data) }
async function deleteAddress(id) { return request('/user/addresses/' + id, 'DELETE') }
async function addressDetail() { return request('/user/addresses') }

// ============ Province/Region ============
async function province() {
  return { code: 0, data: [{ id: 1, name: '浙江省' }, { id: 2, name: '江苏省' }, { id: 3, name: '上海市' }] }
}
async function nextRegion(pid) {
  const m = { 1: [{ id: 11, name: '杭州市' }, { id: 12, name: '宁波市' }], 2: [{ id: 21, name: '南京市' }, { id: 22, name: '苏州市' }], 3: [{ id: 31, name: '上海市' }] }
  return { code: 0, data: m[pid] || [] }
}

// ============ Score/Sign ============
async function scoreSign() { return { code: 0, data: { score: 5 } } }
async function scoreSignLogs() { return { code: 0, data: { dataList: [] } } }
async function scoreLogs() { return { code: 0, data: { dataList: [] } } }
async function scoreExchange() { return { code: 700 } }
async function exchangeScoreToGrowth() { return { code: 700 } }
async function scoreDeductionRules() { return { code: 0, data: [] } }
async function growthLogs() { return { code: 0, data: { dataList: [] } } }

// ============ Deposit ============
async function depositList() { return { code: 0, data: [] } }
async function payDeposit() { return { code: 700 } }
async function payBill() { return { code: 700 } }
async function payBillDiscounts() { return { code: 0, data: [] } }
async function rechargeSendRules() { return { code: 700 } }

// ============ Others ============
async function withDrawApply() { return { code: 700 } }
async function withDrawLogs() { return { code: 0, data: { dataList: [] } } }
async function cashLogsV2() { return { code: 0, data: { dataList: [] } } }
async function fxApply() { return { code: 700 } }
async function fxApplyProgress() { return { code: 700 } }
async function fxMembers() { return { code: 0, data: { dataList: [] } } }
async function fxCommisionLog() { return { code: 0, data: { dataList: [] } } }
async function kanjiaSet() { return { code: 700 } }
async function kanjiaDetail() { return { code: 700 } }
async function kanjiaJoin() { return { code: 700 } }
async function kanjiaHelp() { return { code: 700 } }
async function kanjiaHelpDetail() { return { code: 700 } }
async function pingtuanSet() { return { code: 700 } }
async function pingtuanList() { return { code: 0, data: [] } }
async function pingtuanOpen() { return { code: 700 } }
async function noticeList() { return { code: 0, data: { dataList: [] } } }
async function noticeDetail() { return { code: 700 } }
async function refundApply() { return { code: 700 } }
async function refundApplyCancel() { return { code: 700 } }
async function refundApplyDetail() { return { code: 700 } }
async function invoiceList() { return { code: 0, data: { dataList: [] } } }
async function invoiceApply() { return { code: 700 } }
async function wuliuInfo() { return { code: 700 } }
async function wxaQrcode() { return { code: 700 } }
async function videoDetail() { return { code: 700 } }
async function wxaMpLiveRooms() { return { code: 0, data: [] } }
async function uploadFile() { return { code: 700 } }

// ============ WX Login ============
async function login_wx(code) { return request('/auth/wx-mini-login', 'POST', { code }) }
async function login_wx_with_info(code, nickname, avatar) { return request('/auth/wx-mini-login', 'POST', { code, nickname, avatar }) }
async function register_complex(params) { return request('/auth/wx-mini-register', 'POST', params) }

module.exports = {
  login, register, checkToken, bindMobileWxa, login_wx, login_wx_with_info, register_complex,
  userDetail, userAmount, updateUserInfo,
  goodsCategory, goods, goodsDetail, goodsPrice, goodsReputation, goodsDynamic,
  goodsFavList, goodsFavPut, goodsFavDelete, goodsFavCheck,
  shippingCarInfo, shippingCarInfoAddItem, shippingCarInfoModifyNumber,
  shippingCarInfoRemoveAll, shippingCarInfoRemoveItem,
  banners, fetchShops, shopSubdetail,
  coupons, fetchCoupons, myCoupons,
  orderCreate, orderList, orderDetail, orderClose, orderPay,
  orderDelivery, orderStatistics, orderReputation, orderHX,
  queryAddress, defaultAddress, addAddress, updateAddress, deleteAddress, addressDetail,
  province, nextRegion,
  scoreSign, scoreSignLogs, scoreLogs, scoreExchange, exchangeScoreToGrowth,
  scoreDeductionRules, growthLogs,
  depositList, payDeposit, payBill, payBillDiscounts, rechargeSendRules,
  withDrawApply, withDrawLogs, cashLogsV2,
  fxApply, fxApplyProgress, fxMembers, fxCommisionLog,
  kanjiaSet, kanjiaDetail, kanjiaJoin, kanjiaHelp, kanjiaHelpDetail,
  pingtuanSet, pingtuanList, pingtuanOpen,
  noticeList, noticeDetail,
  refundApply, refundApplyCancel, refundApplyDetail,
  invoiceList, invoiceApply, wuliuInfo,
  wxaQrcode, videoDetail, wxaMpLiveRooms, uploadFile,
  init: () => {}
}
