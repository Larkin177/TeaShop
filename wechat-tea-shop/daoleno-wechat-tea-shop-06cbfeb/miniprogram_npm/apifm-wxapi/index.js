/**
 * TeaShop API Adapter
 * 替换 apifm-wxapi，将所有接口映射到 Spring Boot 后端
 */
const API_BASE = 'http://localhost:3001/api'

// ============ 工具函数 ============
function getToken() {
  return wx.getStorageSync('token') || ''
}

function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    const header = { 'Content-Type': 'application/json' }
    const token = getToken()
    if (token) header['Authorization'] = 'Bearer ' + token

    wx.request({
      url: API_BASE + url,
      method,
      header,
      data,
      success(res) {
        const apiRes = res.data
        // 转换状态码: 我们的200 → apifm的0
        if (apiRes.code === 200) {
          resolve({ code: 0, data: apiRes.data })
        } else {
          resolve({ code: 700, message: apiRes.message || '请求失败' })
        }
      },
      fail(err) {
        resolve({ code: 700, message: '网络异常: ' + err.errMsg })
      }
    })
  })
}

// ============ 认证相关 ============
async function login(phone, password) {
  return request('/auth/login', 'POST', { phone, password })
}

async function register(phone, password, nickname) {
  return request('/auth/register', 'POST', { phone, password, nickname })
}

function checkToken(token) {
  return new Promise(resolve => {
    if (token) resolve({ code: 0 })
    else resolve({ code: 700 })
  })
}

function bindMobileWxa(token) {
  return Promise.resolve({ code: 700, message: '请使用手机号登录' })
}

// ============ 用户相关 ============
async function userDetail(token) {
  return request('/user/info')
}

async function userAmount(token) {
  const res = await request('/user/info')
  if (res.code === 0) {
    return { code: 0, data: { balance: 0, freeze: 0, score: res.data.points || 0, scoreToBalance: 0 } }
  }
  return { code: 0, data: { balance: 0, freeze: 0, score: 0, scoreToBalance: 0 } }
}

async function updateUserInfo(data) {
  return request('/auth/profile', 'PUT', data)
}

// ============ 分类/商品 ============
async function goodsCategory() {
  return request('/categories')
}

async function goods(params) {
  let url = '/products'
  const query = []
  if (params && params.categoryId) query.push('category_id=' + params.categoryId)
  if (params && params.recommendStatus) {
    const rec = await request('/products/recommended')
    if (rec.code === 0) {
      // 分页模拟
      const page = params.page || 1
      const pageSize = params.pageSize || 20
      const start = (page - 1) * pageSize
      return { code: 0, data: rec.data.slice(start, start + pageSize) }
    }
    return rec
  }
  if (params && params.keyword) query.push('keyword=' + encodeURIComponent(params.keyword))
  if (query.length > 0) url += '?' + query.join('&')
  return request(url)
}

async function goodsDetail(id) {
  return request('/products/' + id)
}

async function goodsPrice(id, propertyChildIds) {
  const res = await request('/products/' + id)
  if (res.code === 0) {
    return { code: 0, data: { minPrice: res.data.base_price } }
  }
  return res
}

async function goodsReputation(params) {
  return { code: 0, data: [] }
}

async function goodsDynamic(count) {
  return { code: 700, message: '' }
}

// ============ 收藏 ============
async function goodsFavList(params) {
  return { code: 0, data: [] }
}
async function goodsFavPut(params) {
  return { code: 0 }
}
async function goodsFavDelete(params) {
  return { code: 0 }
}
async function goodsFavCheck(params) {
  return { code: 0, data: { status: 0 } }
}

// ============ 购物车 ============
function shippingCarInfo(token) {
  return request('/cart')
}

function shippingCarInfoAddItem(token, goodsId, number, sku) {
  return request('/cart', 'POST', { product_id: goodsId, quantity: number, specs: {}, toppings: [] })
}

function shippingCarInfoModifyNumber(token, key, number) {
  return request('/cart/' + key, 'PUT', { quantity: number })
}

function shippingCarInfoRemoveItem(token, key) {
  return request('/cart/' + key, 'DELETE')
}

function shippingCarInfoRemoveAll(token) {
  return request('/cart', 'DELETE')
}

// ============ Banner ============
async function banners(params) {
  return request('/banners')
}

// ============ 门店 ============
async function fetchShops(params) {
  const res = await request('/stores')
  if (res.code === 0) {
    let shops = res.data || []
    if (params && params.nameLike) {
      shops = shops.filter(s => s.name.indexOf(params.nameLike) >= 0)
    }
    // 模拟距离
    shops = shops.map(s => ({ ...s, distance: Math.floor(Math.random() * 500 + 50) }))
    return { code: 0, data: shops }
  }
  return res
}

async function shopSubdetail(shopId) {
  return request('/stores/' + shopId)
}

// ============ 优惠券 ============
async function coupons() {
  return request('/coupons/available')
}

async function fetchCoupons(params) {
  return request('/coupons/' + params.id + '/claim', 'POST')
}

async function myCoupons(params) {
  const res = await request('/coupons/my')
  if (res.code === 0) {
    const list = (res.data || []).map(c => ({
      id: c.coupon_id,
      coupon: {
        id: c.coupon_id,
        name: c.name,
        type: c.type,
        value: c.value,
        minAmount: c.min_amount,
        amount: c.value,
        needAmount: c.min_amount,
        endTime: c.end_time
      },
      status: c.is_used === 0 ? 0 : 1
    }))
    return { code: 0, data: list }
  }
  return res
}

// ============ 订单 ============
async function orderCreate(params) {
  const data = {
    store_id: 1,
    remark: params.remark || '',
    items: (params.goods || []).map(g => ({
      product_id: g.goodsId,
      quantity: g.number,
      specs: g.sku || {},
      toppings: g.toppings || [],
      unit_price: g.price
    }))
  }
  if (params.couponId) data.coupon_id = params.couponId
  const res = await request('/orders', 'POST', data)
  if (res.code === 0) {
    return { code: 0, data: { id: res.data.order.id, orderInfo: res.data.order } }
  }
  return res
}

async function orderList(params) {
  let url = '/orders'
  if (params && params.status !== undefined) url += '?status=' + params.status
  const res = await request(url)
  if (res.code === 0) {
    const orders = (res.data || []).map(o => ({
      id: o.id,
      orderNo: o.order_no,
      amountReal: o.pay_amount,
      amountTotal: o.total_price,
      status: o.status,
      createdDate: o.created_at,
      storeName: o.store_name,
      remark: o.remark,
      orderDetail: (o.items || []).map(item => ({
        goodsId: item.product_id,
        goodsName: item.product_name,
        number: item.quantity,
        price: item.unit_price,
        pic: '',
        sku: item.specs
      }))
    }))
    return { code: 0, data: orders }
  }
  return res
}

async function orderDetail(params) {
  const id = params && params.id ? params.id : params
  const res = await request('/orders/' + id)
  if (res.code === 0) {
    const o = res.data
    return {
      code: 0,
      data: {
        id: o.id,
        orderNo: o.order_no,
        amountReal: o.pay_amount,
        amountTotal: o.total_price,
        status: o.status,
        createdDate: o.created_at,
        paidAt: o.paid_at,
        storeName: o.store_name,
        remark: o.remark,
        logisticsType: '',
        orderDetail: (o.items || []).map(item => ({
          goodsId: item.product_id,
          goodsName: item.product_name,
          number: item.quantity,
          price: item.unit_price,
          pic: item.product_image || '',
          sku: typeof item.specs === 'string' ? JSON.parse(item.specs || '{}') : (item.specs || {})
        }))
      }
    }
  }
  return res
}

async function orderClose(params) {
  const id = params && params.id ? params.id : params
  return request('/orders/' + id + '/cancel', 'PUT')
}

async function orderPay(params) {
  const id = params && params.id ? params.id : params
  return request('/orders/' + id + '/pay', 'PUT')
}

async function orderDelivery(params) {
  return { code: 0 }
}

async function orderStatistics(token) {
  return { code: 0, data: { count_id_no_pay: 0, count_id_no_transfer: 0, count_id_no_confirm: 0, count_id_no_reputation: 0, count_id_no_refund: 0 } }
}

async function orderReputation(params) {
  return { code: 0 }
}

async function orderHX(hxNumber) {
  return { code: 700, message: '暂不支持核销' }
}

// ============ 地址 ============
async function queryAddress(token) {
  return request('/user/addresses')
}

async function defaultAddress(token) {
  const res = await request('/user/addresses')
  if (res.code === 0) {
    const list = res.data || []
    const def = list.find(a => a.isDefault === 1) || list[0]
    return { code: def ? 0 : 700, data: def }
  }
  return res
}

async function addAddress(data) {
  return request('/user/addresses', 'POST', data)
}

async function updateAddress(data) {
  const id = data.id
  delete data.id
  return request('/user/addresses/' + id, 'PUT', data)
}

async function deleteAddress(data) {
  const id = data && data.id ? data.id : data
  return request('/user/addresses/' + id, 'DELETE')
}

async function addressDetail(data) {
  return { code: 700 }
}

// ============ 省份/地区 ============
async function province() {
  return { code: 0, data: [{ id: 330000, name: '浙江省' }] }
}

async function nextRegion(pid) {
  const regions = {
    330000: [{ id: 330100, name: '杭州市' }],
    330100: [{ id: 330102, name: '上城区' }, { id: 330103, name: '下城区' }, { id: 330106, name: '西湖区' }, { id: 330108, name: '滨江区' }, { id: 330109, name: '萧山区' }]
  }
  return { code: 0, data: regions[pid] || [] }
}

// ============ 积分/签到 ============
async function scoreSign(token) {
  return { code: 0, data: { score: 1 } }
}

async function scoreSignLogs(params) {
  return { code: 0, data: { dataList: [] } }
}

async function scoreLogs(params) {
  return { code: 0, data: { dataList: [] } }
}

async function scoreExchange(params) {
  return { code: 700, message: '暂不支持' }
}

async function exchangeScoreToGrowth(params) {
  return { code: 700, message: '暂不支持' }
}

async function scoreDeductionRules(amount) {
  return { code: 0, data: [] }
}

async function growthLogs(params) {
  return { code: 0, data: { dataList: [] } }
}

// ============ 资产/充值 ============
async function depositList(params) {
  return { code: 0, data: { dataList: [] } }
}

async function payDeposit(params) {
  return { code: 700, message: '暂不支持' }
}

async function payBill(token) {
  return { code: 700, message: '暂不支持' }
}

async function payBillDiscounts() {
  return { code: 0, data: [] }
}

async function rechargeSendRules() {
  return { code: 700 }
}

// ============ 提现 ============
async function withDrawApply(params) {
  return { code: 700, message: '暂不支持' }
}

async function withDrawLogs(params) {
  return { code: 0, data: { dataList: [] } }
}

async function cashLogsV2(params) {
  return { code: 0, data: { dataList: [] } }
}

// ============ 分销 ============
async function fxApply(token) {
  return { code: 700 }
}
async function fxApplyProgress(token) {
  return { code: 700 }
}
async function fxMembers(params) {
  return { code: 0, data: { dataList: [] } }
}
async function fxCommisionLog(params) {
  return { code: 0, data: { dataList: [] } }
}

// ============ 砍价/拼团/秒杀 ============
async function kanjiaSet(goodsId) {
  return { code: 700 }
}
async function kanjiaDetail(id, joinUid) {
  return { code: 700 }
}
async function kanjiaJoin(token) {
  return { code: 700 }
}
async function kanjiaHelp(token) {
  return { code: 700 }
}
async function kanjiaHelpDetail(token) {
  return { code: 700 }
}
async function pingtuanSet(goodsId) {
  return { code: 700 }
}
async function pingtuanList(params) {
  return { code: 0, data: [] }
}
async function pingtuanOpen(token) {
  return { code: 700 }
}

// ============ 公告 ============
async function noticeList(params) {
  return { code: 700, data: { dataList: [] } }
}
async function noticeDetail(id) {
  return { code: 700 }
}

// ============ 退款 ============
async function refundApply(params) {
  return { code: 700, message: '暂不支持' }
}
async function refundApplyCancel(params) {
  return { code: 700 }
}
async function refundApplyDetail(params) {
  return { code: 700 }
}

// ============ 发票 ============
async function invoiceList(params) {
  return { code: 0, data: { dataList: [] } }
}
async function invoiceApply(params) {
  return { code: 700, message: '暂不支持' }
}

// ============ 物流 ============
async function wuliuInfo(params) {
  return { code: 700 }
}

// ============ 小程序码/视频/直播 ============
async function wxaQrcode(params) {
  return { code: 700 }
}
async function videoDetail(videoId) {
  return { code: 700 }
}
async function wxaMpLiveRooms() {
  return { code: 0, data: [] }
}

// ============ 文件上传 ============
async function uploadFile(token) {
  return { code: 700, message: '暂不支持' }
}


// ============ 微信小程序登录 ============
async function login_wx(code) {
  return request('/auth/wx-mini-login', 'POST', { code: code })
}

async function login_wx_with_info(code, nickname, avatar) {
  return request('/auth/wx-mini-login', 'POST', { code, nickname, avatar })
}

async function register_complex(params) {
  return request('/auth/wx-mini-register', 'POST', params)
}

// ============ 导出 ============
module.exports = {
  // 认证
  login, register, checkToken, bindMobileWxa, login_wx, login_wx_with_info, register_complex,
  // 用户
  userDetail, userAmount, updateUserInfo,
  // 分类/商品
  goodsCategory, goods, goodsDetail, goodsPrice, goodsReputation, goodsDynamic,
  // 收藏
  goodsFavList, goodsFavPut, goodsFavDelete, goodsFavCheck,
  // 购物车
  shippingCarInfo, shippingCarInfoAddItem, shippingCarInfoModifyNumber,
  shippingCarInfoRemoveAll, shippingCarInfoRemoveItem,
  // Banner
  banners,
  // 门店
  fetchShops, shopSubdetail,
  // 优惠券
  coupons, fetchCoupons, myCoupons,
  // 订单
  orderCreate, orderList, orderDetail, orderClose, orderPay,
  orderDelivery, orderStatistics, orderReputation, orderHX,
  // 地址
  queryAddress, defaultAddress, addAddress, updateAddress, deleteAddress, addressDetail,
  // 省份/地区
  province, nextRegion,
  // 积分/签到
  scoreSign, scoreSignLogs, scoreLogs, scoreExchange, exchangeScoreToGrowth,
  scoreDeductionRules, growthLogs,
  // 资产/充值
  depositList, payDeposit, payBill, payBillDiscounts, rechargeSendRules,
  // 提现
  withDrawApply, withDrawLogs, cashLogsV2,
  // 分销
  fxApply, fxApplyProgress, fxMembers, fxCommisionLog,
  // 砍价/拼团/秒杀
  kanjiaSet, kanjiaDetail, kanjiaJoin, kanjiaHelp, kanjiaHelpDetail,
  pingtuanSet, pingtuanList, pingtuanOpen,
  // 公告
  noticeList, noticeDetail,
  // 退款
  refundApply, refundApplyCancel, refundApplyDetail,
  // 发票
  invoiceList, invoiceApply,
  // 物流
  wuliuInfo,
  // 二维码/视频/直播
  wxaQrcode, videoDetail, wxaMpLiveRooms,
  // 上传
  uploadFile,
  // 保留原始init方法
  init: () => {}
}