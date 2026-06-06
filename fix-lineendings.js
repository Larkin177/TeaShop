const fs = require('fs');
const base = 'E:/DevEnv/project/TeaShop/wechat-tea-shop/daoleno-wechat-tea-shop-06cbfeb';

['category/category.js', 'shop-cart/index.js', 'goods-details/index.js'].forEach(f => {
  const p = base + '/pages/' + f;
  let c = fs.readFileSync(p, 'utf-8');
  // 统一换行符为 \n，去掉 \r
  c = c.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  // 修复 },\r, 之类的问题 -> },
  c = c.replace(/\},\r,/g, '},');
  c = c.replace(/\},\n\r,/g, '},');
  // 修复连续逗号
  c = c.replace(/,,+/g, ',');
  fs.writeFileSync(p, c, 'utf-8');
  
  try {
    new Function(c);
    console.log(f + ': SYNTAX OK');
  } catch(e) {
    console.log(f + ': ERROR - ' + e.message.substring(0, 120));
  }
});