const fs = require('fs');
const base = 'E:/DevEnv/project/TeaShop/wechat-tea-shop/daoleno-wechat-tea-shop-06cbfeb';

['category/category.js', 'shop-cart/index.js', 'goods-details/index.js'].forEach(f => {
  const p = base + '/pages/' + f;
  let c = fs.readFileSync(p, 'utf-8');
  // 把 "\n\n  ,\n  onPhoneInput" 改成 ",\n  onPhoneInput"
  c = c.replace(/\n\n  ,\n  onPhoneInput/g, ',\n  onPhoneInput');
  fs.writeFileSync(p, c, 'utf-8');
  
  // 语法检查
  try {
    new Function(c);
    console.log(f + ': SYNTAX OK');
  } catch(e) {
    console.log(f + ': ERROR - ' + e.message.substring(0, 120));
  }
});