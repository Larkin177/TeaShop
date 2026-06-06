const fs = require('fs');
const base = 'E:/DevEnv/project/TeaShop/wechat-tea-shop/daoleno-wechat-tea-shop-06cbfeb';

// === category.js ===
// 只在 data 对象末尾加字段，在文件末尾加方法，不碰原有中文
{
  const p = base + '/pages/category/category.js';
  let c = fs.readFileSync(p, 'utf-8');
  
  // 在 skuCurGoods: undefined 后面加登录字段（只加一次）
  if (!c.includes('loginPhone')) {
    c = c.replace(
      'skuCurGoods: undefined',
      "skuCurGoods: undefined,\n    loginPhone: '',\n    loginPassword: ''"
    );
  }
  
  // 在文件最后的 }) 前加登录方法（只加一次）
  if (!c.includes('processPhoneLogin')) {
    const methods = `
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
  }`;
    // 在最后一个 }) 前插入
    const lastIdx = c.lastIndexOf('})');
    c = c.substring(0, lastIdx) + methods + '\n' + c.substring(lastIdx);
  }
  
  fs.writeFileSync(p, c, 'utf-8');
  console.log('category.js OK');
}

// === goods-details/index.js ===
{
  const p = base + '/pages/goods-details/index.js';
  let c = fs.readFileSync(p, 'utf-8');
  
  // 在 shopType 后加登录字段
  if (!c.includes('loginPhone')) {
    c = c.replace(
      'shopType: "addShopCar",',
      "shopType: \"addShopCar\",\n    loginPhone: '',\n    loginPassword: '',"
    );
  }
  
  // 在文件最后的 }) 前加登录方法
  if (!c.includes('processPhoneLogin')) {
    const methods = `
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
  }`;
    const lastIdx = c.lastIndexOf('})');
    c = c.substring(0, lastIdx) + methods + '\n' + c.substring(lastIdx);
  }
  
  fs.writeFileSync(p, c, 'utf-8');
  console.log('goods-details/index.js OK');
}

// === shop-cart/index.js ===
{
  const p = base + '/pages/shop-cart/index.js';
  let c = fs.readFileSync(p, 'utf-8');
  
  // 在 delBtnWidth 后加登录字段
  if (!c.includes('loginPhone')) {
    c = c.replace(
      'delBtnWidth: 120,',
      "delBtnWidth: 120,\n    loginPhone: '',\n    loginPassword: '',"
    );
  }
  
  // 在文件最后的 }) 前加登录方法
  if (!c.includes('processPhoneLogin')) {
    const methods = `
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
  }`;
    const lastIdx = c.lastIndexOf('})');
    c = c.substring(0, lastIdx) + methods + '\n' + c.substring(lastIdx);
  }
  
  fs.writeFileSync(p, c, 'utf-8');
  console.log('shop-cart/index.js OK');
}

console.log('All 3 files injected successfully');