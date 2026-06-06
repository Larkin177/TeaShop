const fs = require('fs');
const base = 'E:/DevEnv/project/TeaShop/wechat-tea-shop/daoleno-wechat-tea-shop-06cbfeb';

// === category.js === 清理重复字段
{
  const p = base + '/pages/category/category.js';
  let lines = fs.readFileSync(p, 'utf-8').split('\n');
  
  // 移除重复的 loginPhone/loginPassword 行，只保留第一组
  let foundLogin = false;
  const cleaned = [];
  for (const line of lines) {
    if (line.trim().startsWith('loginPhone:') || line.trim().startsWith('loginPassword:')) {
      if (!foundLogin) {
        foundLogin = true;
        cleaned.push(line);
      }
      // 跳过重复的
    } else {
      cleaned.push(line);
    }
  }
  // 修复双逗号
  let content = cleaned.join('\n');
  content = content.replace(/'',,/g, "'',");
  fs.writeFileSync(p, content, 'utf-8');
  console.log('category.js cleaned');
}

// === shop-cart/index.js === 清理重复字段
{
  const p = base + '/pages/shop-cart/index.js';
  let c = fs.readFileSync(p, 'utf-8');
  
  // 修复 delBtnWidth 那行有重复字段的情况
  c = c.replace(
    /delBtnWidth: 120, loginPhone: '', loginPassword: '', loginPhone: '', loginPassword: '',/,
    "delBtnWidth: 120,\n    loginPhone: '',\n    loginPassword: '',"
  );
  fs.writeFileSync(p, c, 'utf-8');
  console.log('shop-cart/index.js cleaned');
}

// === goods-details/index.js === 检查是否正常
{
  const p = base + '/pages/goods-details/index.js';
  let c = fs.readFileSync(p, 'utf-8');
  // 检查是否有重复的login字段
  const loginCount = (c.match(/loginPhone/g) || []).length;
  console.log('goods-details loginPhone count:', loginCount);
  if (loginCount > 2) { // data里1个 + 方法里1个 = 2
    // 有重复，清理
    let lines = c.split('\n');
    let foundLogin = false;
    const cleaned = [];
    for (const line of lines) {
      if (line.trim().startsWith('loginPhone:') || line.trim().startsWith('loginPassword:')) {
        if (!foundLogin) { foundLogin = true; cleaned.push(line); }
      } else {
        cleaned.push(line);
      }
    }
    c = cleaned.join('\n');
    c = c.replace(/'',,/g, "'',");
    fs.writeFileSync(p, c, 'utf-8');
    console.log('goods-details/index.js cleaned');
  } else {
    console.log('goods-details/index.js OK');
  }
}

console.log('Cleanup done');