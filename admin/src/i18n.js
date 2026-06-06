import { ref, computed } from 'vue'

const lang = ref(localStorage.getItem('admin_lang') || 'zh')

const messages = {
  zh: {
    // Layout
    dashboard: '数据概览', products: '商品管理', categories: '分类管理',
    orders: '订单管理', users: '用户管理', banners: '轮播图管理',
    coupons: '优惠券管理', stores: '门店管理', logout: '退出登录',
    admin: '管理员',
    // Login
    loginTitle: '茶铺管理系统', loginSub: '后台管理控制台',
    username: '请输入用户名', password: '请输入密码', loginBtn: '登 录',
    loginSuccess: '登录成功', loginFail: '用户名或密码错误',
    // Dashboard
    totalProducts: '商品总数', totalOrders: '订单总数', totalUsers: '用户总数', revenue: '总营收',
    recentOrders: '最近订单', topProducts: '热销商品',
    // Common
    add: '新增', edit: '编辑', delete: '删除', save: '保存', cancel: '取消',
    confirm: '确认', actions: '操作', status: '状态', active: '上架', inactive: '下架',
    name: '名称', image: '图片', price: '价格', sales: '销量', recommend: '推荐',
    description: '描述', category: '分类', sort: '排序',
    search: '搜索', noData: '暂无数据', loading: '加载中...',
    success: '操作成功', error: '操作失败', confirmDelete: '确定要删除吗？',
    // Products
    productsTitle: '商品管理', addProduct: '新增商品', editProduct: '编辑商品',
    // Categories
    categoriesTitle: '分类管理', addCategory: '新增分类', editCategory: '编辑分类', icon: '图标',
    // Orders
    ordersTitle: '订单管理', all: '全部', pending: '待付款', paid: '已付款',
    preparing: '制作中', delivering: '配送中', completed: '已完成', cancelled: '已取消',
    orderNo: '订单号', customer: '客户', phone: '手机号', store: '门店',
    amount: '金额', remark: '备注', created: '创建时间', updateStatus: '更新状态',
    markPaid: '标记已付款', markComplete: '标记完成', markCancel: '取消订单',
    // Users
    usersTitle: '用户管理', nickname: '昵称', points: '积分', level: '等级', registered: '注册时间',
    // Banners
    bannersTitle: '轮播图管理', addBanner: '新增轮播图', editBanner: '编辑轮播图', link: '链接',
    // Coupons
    couponsTitle: '优惠券管理', addCoupon: '新增优惠券', type: '类型', value: '面值',
    minAmount: '最低消费', total: '总量', used: '已用', couponDesc: '说明',
    fullReduction: '满减券', discount: '折扣券', freeItem: '免单券',
    // Stores
    storesTitle: '门店管理', addStore: '新增门店', editStore: '编辑门店',
    address: '地址', hours: '营业时间', open: '营业', closed: '关闭',
  },
  en: {
    dashboard: 'Dashboard', products: 'Products', categories: 'Categories',
    orders: 'Orders', users: 'Users', banners: 'Banners',
    coupons: 'Coupons', stores: 'Stores', logout: 'Logout', admin: 'Admin',
    loginTitle: 'TeaShop Admin', loginSub: 'Management Console',
    username: 'Username', password: 'Password', loginBtn: 'Login',
    loginSuccess: 'Login success', loginFail: 'Invalid credentials',
    totalProducts: 'Products', totalOrders: 'Orders', totalUsers: 'Users', revenue: 'Revenue',
    recentOrders: 'Recent Orders', topProducts: 'Top Products',
    add: 'Add', edit: 'Edit', delete: 'Delete', save: 'Save', cancel: 'Cancel',
    confirm: 'Confirm', actions: 'Actions', status: 'Status', active: 'Active', inactive: 'Inactive',
    name: 'Name', image: 'Image', price: 'Price', sales: 'Sales', recommend: 'Recommend',
    description: 'Description', category: 'Category', sort: 'Sort',
    search: 'Search', noData: 'No Data', loading: 'Loading...',
    success: 'Success', error: 'Error', confirmDelete: 'Delete this item?',
    productsTitle: 'Products', addProduct: 'Add Product', editProduct: 'Edit Product',
    categoriesTitle: 'Categories', addCategory: 'Add Category', editCategory: 'Edit Category', icon: 'Icon',
    ordersTitle: 'Orders', all: 'All', pending: 'Pending', paid: 'Paid',
    preparing: 'Preparing', delivering: 'Delivering', completed: 'Completed', cancelled: 'Cancelled',
    orderNo: 'Order No', customer: 'Customer', phone: 'Phone', store: 'Store',
    amount: 'Amount', remark: 'Remark', created: 'Created', updateStatus: 'Update Status',
    markPaid: 'Mark Paid', markComplete: 'Complete', markCancel: 'Cancel Order',
    usersTitle: 'Users', nickname: 'Nickname', points: 'Points', level: 'Level', registered: 'Registered',
    bannersTitle: 'Banners', addBanner: 'Add Banner', editBanner: 'Edit Banner', link: 'Link',
    couponsTitle: 'Coupons', addCoupon: 'Add Coupon', type: 'Type', value: 'Value',
    minAmount: 'Min Amount', total: 'Total', used: 'Used', couponDesc: 'Description',
    fullReduction: 'Full Reduction', discount: 'Discount', freeItem: 'Free Item',
    storesTitle: 'Stores', addStore: 'Add Store', editStore: 'Edit Store',
    address: 'Address', hours: 'Hours', open: 'Open', closed: 'Closed',
  }
}

export function useLang() {
  function t(key) { return messages[lang.value]?.[key] || key }
  function toggleLang() {
    lang.value = lang.value === 'zh' ? 'en' : 'zh'
    localStorage.setItem('admin_lang', lang.value)
  }
  return { lang, t, toggleLang }
}