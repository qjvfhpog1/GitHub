const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

// 邮件发送配置 - QQ邮箱
const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 587,
  secure: false,
  auth: {
    user: 'qjvfhpog@vip.qq.com',
    pass: 'nrfrnkptufnabgdh'
  }
});

// 发送邮件函数
const sendEmail = async (to, subject, content) => {
  try {
    await transporter.sendMail({
      from: '"南洋仓系统" <qjvfhpog@vip.qq.com>',
      to: to,
      subject: subject,
      html: content
    });
    console.log(`[邮件发送成功] 发送到: ${to}`);
    return true;
  } catch (error) {
    console.log(`[邮件发送失败] ${error.message}`);
    return false;
  }
};

app.use(cors());
app.use(bodyParser.json());

// Mock数据
const mockData = {
  // 仓库列表
  warehouses: [
    { id: 1, name: '泰国曼谷仓', country: '泰国', code: 'TH-BKK', address: '泰国曼谷市XX区XX路123号', contact: '张三', phone: '+66 123456789' },
    { id: 2, name: '马来西亚吉隆坡仓', country: '马来西亚', code: 'MY-KL', address: '马来西亚吉隆坡市XX区XX街456号', contact: '李四', phone: '+60 123456789' },
    { id: 3, name: '越南胡志明仓', country: '越南', code: 'VN-HCM', address: '越南胡志明市XX区XX路789号', contact: '王五', phone: '+84 123456789' },
    { id: 4, name: '印尼雅加达仓', country: '印度尼西亚', code: 'ID-JKT', address: '印尼雅加达市XX区XX路101号', contact: '赵六', phone: '+62 123456789' },
    { id: 5, name: '新加坡仓', country: '新加坡', code: 'SG-SG', address: '新加坡XX区XX路202号', contact: '钱七', phone: '+65 123456789' },
    { id: 6, name: '菲律宾马尼拉仓', country: '菲律宾', code: 'PH-MNL', address: '菲律宾马尼拉市XX区XX路303号', contact: '孙八', phone: '+63 123456789' }
  ],

  // 商家账户
  merchants: [
    {
      id: 1,
      username: '13800138000',
      password: '123456',
      name: '测试商家',
      email: 'test@merchant.com',
      role: 'merchant',
      parentId: null,
      status: 'active',
      balance: 50000,
      warehouses: [1, 2, 3],
      defaultWarehouse: 1,
      permissions: ['all'],
      createdAt: '2026-01-01T00:00:00Z'
    },
    {
      id: 2,
      username: 'sub01',
      password: '123456',
      name: '子账号01',
      email: 'sub01@merchant.com',
      role: 'sub_account',
      parentId: 1,
      status: 'active',
      permissions: ['view_inventory', 'create_order'],
      createdAt: '2026-01-15T00:00:00Z'
    }
  ],

  // 区域账户
  regionAdmins: [
    {
      id: 101,
      username: 'region01',
      password: '123456',
      name: '区域仓管01',
      email: 'region01@nanyang.com',
      role: 'region_admin',
      merchantId: 1,
      regions: [1, 2],
      permissions: ['region_view', 'region_control', 'warehouse_view', 'warehouse_operate'],
      status: 'active',
      createdAt: '2026-01-10T00:00:00Z'
    }
  ],

  // 仓库管理员
  warehouseAdmins: [
    {
      id: 201,
      username: 'wh_admin_01',
      password: '123456',
      name: '仓库管理员01',
      email: 'admin01@nanyang.com',
      role: 'warehouse_admin',
      warehouseId: 1,
      status: 'active',
      createdAt: '2026-01-05T00:00:00Z'
    }
  ],

  // 总管理员
  admins: [
    {
      id: 301,
      username: 'admin',
      password: 'admin123',
      name: '系统管理员',
      email: 'admin@nanyang.com',
      role: 'admin',
      status: 'active',
      createdAt: '2025-01-01T00:00:00Z'
    }
  ],

  // 预报单
  forecasts: [
    { id: 1, merchantId: 1, warehouseId: 1, code: 'NY20260222123456', status: 'pending', expectedDate: '2026-02-28', remark: '易碎品', items: [{ sku: 'SKU001', name: '商品A', quantity: 100, weight: 0.5, volume: 0.002, category: '电子产品' }], logistics: { carrier: 'DHL', trackingNo: 'DHL123456789' }, createdAt: '2026-02-22T10:00:00Z' },
    { id: 2, merchantId: 1, warehouseId: 1, code: 'NY20260223123457', status: 'arrived', expectedDate: '2026-02-25', remark: '', items: [{ sku: 'SKU002', name: '商品B', quantity: 200, weight: 0.3, volume: 0.001, category: '服装' }], logistics: { carrier: 'FEDEX', trackingNo: 'FEDEX987654321' }, createdAt: '2026-02-23T10:00:00Z' },
    { id: 3, merchantId: 1, warehouseId: 1, code: 'NY20260224123458', status: 'checked', expectedDate: '2026-02-26', remark: '需优先入库', items: [{ sku: 'SKU003', name: '商品C', quantity: 150, weight: 0.8, volume: 0.003, category: '家居' }], logistics: { carrier: 'UPS', trackingNo: 'UPS111222333' }, createdAt: '2026-02-24T10:00:00Z' }
  ],

  // 库存
  inventory: [
    { id: 1, merchantId: 1, warehouseId: 1, sku: 'SKU001', name: '商品A', category: '电子产品', totalStock: 500, availableStock: 450, inTransitStock: 50, lockedStock: 0, location: 'A区-01', warnQuantity: 100 },
    { id: 2, merchantId: 1, warehouseId: 1, sku: 'SKU002', name: '商品B', category: '服装', totalStock: 800, availableStock: 700, inTransitStock: 100, lockedStock: 0, location: 'A区-02', warnQuantity: 150 },
    { id: 3, merchantId: 1, warehouseId: 1, sku: 'SKU003', name: '商品C', category: '家居', totalStock: 300, availableStock: 200, inTransitStock: 50, lockedStock: 50, location: 'B区-01', warnQuantity: 80 },
    { id: 4, merchantId: 1, warehouseId: 2, sku: 'SKU004', name: '商品D', category: '美妆', totalStock: 600, availableStock: 600, inTransitStock: 0, lockedStock: 0, location: 'C区-01', warnQuantity: 100 }
  ],

  // 订单
  orders: [
    { id: 1, merchantId: 1, warehouseId: 1, orderNo: 'ORD202602250001', status: 'pending', recipient: { name: '张三', phone: '+66 987654321', address: '泰国曼谷市XX区XX街123号', country: '泰国' }, items: [{ sku: 'SKU001', name: '商品A', quantity: 10, price: 50 }], totalFee: 150, remark: '加固包装', logistics: { carrier: 'Flash', trackingNo: '' }, createdAt: '2026-02-25T10:00:00Z' },
    { id: 2, merchantId: 1, warehouseId: 1, orderNo: 'ORD202602250002', status: 'picked', recipient: { name: '李四', phone: '+66 987654322', address: '泰国曼谷市XX区XX街456号', country: '泰国' }, items: [{ sku: 'SKU002', name: '商品B', quantity: 20, price: 30 }], totalFee: 200, remark: '', logistics: { carrier: 'Flash', trackingNo: '' }, createdAt: '2026-02-25T11:00:00Z' },
    { id: 3, merchantId: 1, warehouseId: 1, orderNo: 'ORD202602250003', status: 'packed', recipient: { name: '王五', phone: '+66 987654323', address: '泰国曼谷市XX区XX街789号', country: '泰国' }, items: [{ sku: 'SKU003', name: '商品C', quantity: 15, price: 80 }], totalFee: 180, remark: '拍照留存', logistics: { carrier: 'J&T', trackingNo: '' }, createdAt: '2026-02-25T12:00:00Z' },
    { id: 4, merchantId: 1, warehouseId: 1, orderNo: 'ORD202602250004', status: 'shipped', recipient: { name: '赵六', phone: '+66 987654324', address: '泰国曼谷市XX区XX街101号', country: '泰国' }, items: [{ sku: 'SKU001', name: '商品A', quantity: 5, price: 50 }, { sku: 'SKU002', name: '商品B', quantity: 10, price: 30 }], totalFee: 250, remark: '', logistics: { carrier: 'Flash', trackingNo: 'FLASH123456' }, createdAt: '2026-02-25T13:00:00Z' },
    { id: 5, merchantId: 1, warehouseId: 1, orderNo: 'ORD202602250005', status: 'exception', recipient: { name: '钱七', phone: '+66 987654325', address: '泰国曼谷市XX区XX街202号', country: '泰国' }, items: [{ sku: 'SKU003', name: '商品C', quantity: 8, price: 80 }], totalFee: 160, remark: '', logistics: { carrier: 'Flash', trackingNo: '' }, exception: { type: '破损', description: '商品外包装破损' }, createdAt: '2026-02-25T14:00:00Z' }
  ],

  // 充值记录
  recharges: [
    { id: 1, merchantId: 1, amount: 10000, method: '支付宝', status: 'success', remark: '2026年2月充值', createdAt: '2026-02-01T10:00:00Z' },
    { id: 2, merchantId: 1, amount: 20000, method: '微信支付', status: 'success', remark: '2026年2月充值', createdAt: '2026-02-15T10:00:00Z' },
    { id: 3, merchantId: 1, amount: 20000, method: 'PayPal', status: 'success', remark: '2026年2月充值', createdAt: '2026-02-20T10:00:00Z' }
  ],

  // 账单
  bills: [
    { id: 1, merchantId: 1, type: 'daily', date: '2026-02-24', totalFee: 1500, details: [{ type: '出库费', amount: 800 }, { type: '仓储费', amount: 300 }, { type: '派送费', amount: 400 }], createdAt: '2026-02-25T00:00:00Z' },
    { id: 2, merchantId: 1, type: 'daily', date: '2026-02-23', totalFee: 2100, details: [{ type: '出库费', amount: 1200 }, { type: '仓储费', amount: 400 }, { type: '派送费', amount: 500 }], createdAt: '2026-02-24T00:00:00Z' },
    { id: 3, merchantId: 1, type: 'monthly', month: '2026-01', startBalance: 0, endBalance: 45000, totalRecharge: 100000, totalFee: 55000, createdAt: '2026-02-01T00:00:00Z' }
  ],

  // 消息通知
  messages: [
    { id: 1, merchantId: 1, type: 'forecast', title: '预报单已到仓', content: '预报单NY20260222123456已到达仓库', status: 'unread', createdAt: '2026-02-25T10:00:00Z' },
    { id: 2, merchantId: 1, type: 'order', title: '订单已发货', content: '订单ORD202602250004已发货，快递单号：FLASH123456', status: 'unread', createdAt: '2026-02-25T11:00:00Z' },
    { id: 3, merchantId: 1, type: 'inventory', title: '库存预警', content: '商品A库存不足，当前可发货450件', status: 'read', createdAt: '2026-02-24T10:00:00Z' }
  ],

  // 费用配置
  feeConfig: [
    { id: 1, warehouseId: 1, country: '泰国', firstWeight: 10, 续重: 5, storage: 1, serviceFee: 2, status: 'active' },
    { id: 2, warehouseId: 2, country: '马来西亚', firstWeight: 12, 续重: 6, storage: 1.5, serviceFee: 2.5, status: 'active' }
  ],

  // 物流商
  logistics: [
    { id: 1, name: 'Flash Express', code: 'FLASH', country: '泰国', status: 'active' },
    { id: 2, name: 'J&T Express', code: 'JT', country: '泰国', status: 'active' },
    { id: 3, name: 'GHTK', code: 'GHTK', country: '越南', status: 'active' },
    { id: 4, name: 'Ninja Van', code: 'NINJA', country: '马来西亚', status: 'active' }
  ],

  // 区域
  regions: [
    { id: 1, name: '泰国区域', merchantId: 1, warehouseIds: [1], status: 'active' },
    { id: 2, name: '马来区域', merchantId: 1, warehouseIds: [2], status: 'active' },
    { id: 3, name: '越南区域', merchantId: 1, warehouseIds: [3], status: 'active' }
  ]
};

// 工具函数
const generateCode = (prefix) => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 900000) + 100000;
  return `${prefix}${date}${random}`;
};

// API路由

// 1. 登录
app.post('/api/login', (req, res) => {
  const { username, password, role } = req.body;
  
  let user = null;
  if (role === 'merchant' || !role) {
    user = mockData.merchants.find(m => m.username === username && m.password === password);
  } else if (role === 'region_admin') {
    user = mockData.regionAdmins.find(r => r.username === username && r.password === password);
  } else if (role === 'warehouse_admin') {
    user = mockData.warehouseAdmins.find(w => w.username === username && w.password === password);
  } else if (role === 'admin') {
    user = mockData.admins.find(a => a.username === username && a.password === password);
  }

  if (user) {
    const { password: _, ...userInfo } = user;
    res.json({ success: true, data: userInfo });
  } else {
    res.json({ success: false, message: '用户名或密码错误' });
  }
});

// 查看验证码页面（开发测试用）
app.get('/codes', (req, res) => {
  let html = '<html><head><meta charset="utf-8"><title>验证码查看</title></head><body>';
  html += '<h1>南洋仓 - 验证码查看</h1>';
  html += '<h2>最近的验证码：</h2><ul>';
  for (const [email, data] of Object.entries(emailCodes)) {
    if (Date.now() < data.expire) {
      html += `<li><strong>${email}</strong> - 验证码: <span style="font-size:24px;color:red;">${data.code}</span> (有效期至 ${new Date(data.expire).toLocaleString()})</li>`;
    }
  }
  html += '</ul></body></html>';
  res.send(html);
});

// 注册 - 发送邮箱验证码
const emailCodes = {}; // 存储验证码 { email: { code: '123456', expire: timestamp } }

app.post('/api/register/send-code', async (req, res) => {
  const { email } = req.body;
  
  // 生成6位验证码
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expire = Date.now() + 5 * 60 * 1000; // 5分钟有效
  
  emailCodes[email] = { code, expire };
  
  // 发送验证码到邮箱
  const emailContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1989fa;">南洋仓注册验证码</h2>
      <p>您好，您正在注册南洋仓账号，您的验证码是：</p>
      <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
        ${code}
      </div>
      <p style="color: #999; font-size: 12px;">验证码有效期为5分钟，请尽快完成注册。</p>
      <p style="color: #999; font-size: 12px;">如果不是您本人操作，请忽略此邮件。</p>
    </div>
  `;
  
  const sent = await sendEmail(email, '南洋仓注册验证码', emailContent);
  
  if (sent) {
    res.json({ success: true, message: '验证码已发送到您的邮箱' });
  } else {
    // 如果发送失败，仍然返回成功（避免泄露邮箱是否存在）
    console.log(`[注册验证码] 邮箱: ${email}, 验证码: ${code}`);
    res.json({ success: true, message: '验证码已发送到您的邮箱' });
  }
});

// 注册 - 验证并创建账号
app.post('/api/register', (req, res) => {
  const { email, password, code, name } = req.body;
  
  // 验证验证码
  const stored = emailCodes[email];
  if (!stored) {
    return res.json({ success: false, message: '请先获取验证码' });
  }
  if (Date.now() > stored.expire) {
    delete emailCodes[email];
    return res.json({ success: false, message: '验证码已过期，请重新获取' });
  }
  if (stored.code !== code) {
    return res.json({ success: false, message: '验证码错误' });
  }
  
  // 检查邮箱是否已注册
  const existing = mockData.merchants.find(m => m.email === email || m.username === email);
  if (existing) {
    return res.json({ success: false, message: '该邮箱已被注册' });
  }
  
  // 创建新商家
  const newMerchant = {
    id: mockData.merchants.length + 1,
    username: email,
    password: password,
    name: name || email.split('@')[0],
    email: email,
    role: 'merchant',
    parentId: null,
    status: 'active',
    balance: 0,
    warehouses: [1, 2, 3],
    defaultWarehouse: 1,
    permissions: ['all'],
    createdAt: new Date().toISOString()
  };
  mockData.merchants.push(newMerchant);
  
  // 清除验证码
  delete emailCodes[email];
  
  res.json({ success: true, message: '注册成功', data: { id: newMerchant.id, email: newMerchant.email } });
});

// 2. 获取仓库列表
app.get('/api/warehouses', (req, res) => {
  res.json({ success: true, data: mockData.warehouses });
});

// 3. 获取预报单
app.get('/api/forecasts', (req, res) => {
  const { merchantId, warehouseId, status } = req.query;
  let forecasts = [...mockData.forecasts];
  
  if (merchantId) forecasts = forecasts.filter(f => f.merchantId === parseInt(merchantId));
  if (warehouseId) forecasts = forecasts.filter(f => f.warehouseId === parseInt(warehouseId));
  if (status) forecasts = forecasts.filter(f => f.status === status);
  
  res.json({ success: true, data: forecasts });
});

// 4. 创建预报单
app.post('/api/forecasts', (req, res) => {
  const { merchantId, warehouseId, items, logistics, expectedDate, remark } = req.body;
  const forecast = {
    id: mockData.forecasts.length + 1,
    merchantId,
    warehouseId,
    code: generateCode('NY'),
    status: 'pending',
    expectedDate,
    remark,
    items,
    logistics,
    createdAt: new Date().toISOString()
  };
  mockData.forecasts.push(forecast);
  res.json({ success: true, data: forecast });
});

// 5. 获取库存
app.get('/api/inventory', (req, res) => {
  const { merchantId, warehouseId, sku, name } = req.query;
  let inventory = [...mockData.inventory];
  
  if (merchantId) inventory = inventory.filter(i => i.merchantId === parseInt(merchantId));
  if (warehouseId) inventory = inventory.filter(i => i.warehouseId === parseInt(warehouseId));
  if (sku) inventory = inventory.filter(i => i.sku.toLowerCase().includes(sku.toLowerCase()));
  if (name) inventory = inventory.filter(i => i.name.toLowerCase().includes(name.toLowerCase()));
  
  res.json({ success: true, data: inventory });
});

// 6. 获取订单
app.get('/api/orders', (req, res) => {
  const { merchantId, warehouseId, status, orderNo } = req.query;
  let orders = [...mockData.orders];
  
  if (merchantId) orders = orders.filter(o => o.merchantId === parseInt(merchantId));
  if (warehouseId) orders = orders.filter(o => o.warehouseId === parseInt(warehouseId));
  if (status) orders = orders.filter(o => o.status === status);
  if (orderNo) orders = orders.filter(o => o.orderNo.toLowerCase().includes(orderNo.toLowerCase()));
  
  res.json({ success: true, data: orders });
});

// 7. 创建订单
app.post('/api/orders', (req, res) => {
  const { merchantId, warehouseId, recipient, items, remark } = req.body;
  
  // 计算费用
  const totalFee = items.reduce((sum, item) => sum + item.price * item.quantity, 0) + 50;
  
  const order = {
    id: mockData.orders.length + 1,
    merchantId,
    warehouseId,
    orderNo: generateCode('ORD'),
    status: 'pending',
    recipient,
    items,
    totalFee,
    remark,
    logistics: { carrier: '', trackingNo: '' },
    createdAt: new Date().toISOString()
  };
  mockData.orders.push(order);
  res.json({ success: true, data: order });
});

// 8. 获取充值记录
app.get('/api/recharges', (req, res) => {
  const { merchantId } = req.query;
  let recharges = [...mockData.recharges];
  
  if (merchantId) recharges = recharges.filter(r => r.merchantId === parseInt(merchantId));
  
  res.json({ success: true, data: recharges });
});

// 9. 充值
app.post('/api/recharges', (req, res) => {
  const { merchantId, amount, method, remark } = req.body;
  const recharge = {
    id: mockData.recharges.length + 1,
    merchantId,
    amount,
    method,
    remark,
    status: 'success',
    createdAt: new Date().toISOString()
  };
  mockData.recharges.push(recharge);
  
  // 更新商家余额
  const merchant = mockData.merchants.find(m => m.id === merchantId);
  if (merchant) merchant.balance += amount;
  
  res.json({ success: true, data: recharge });
});

// 10. 获取账单
app.get('/api/bills', (req, res) => {
  const { merchantId, type } = req.query;
  let bills = [...mockData.bills];
  
  if (merchantId) bills = bills.filter(b => b.merchantId === parseInt(merchantId));
  if (type) bills = bills.filter(b => b.type === type);
  
  res.json({ success: true, data: bills });
});

// 11. 获取消息
app.get('/api/messages', (req, res) => {
  const { merchantId, status } = req.query;
  let messages = [...mockData.messages];
  
  if (merchantId) messages = messages.filter(m => m.merchantId === parseInt(merchantId));
  if (status) messages = messages.filter(m => m.status === status);
  
  res.json({ success: true, data: messages });
});

// 12. 获取费用配置
app.get('/api/fee-config', (req, res) => {
  res.json({ success: true, data: mockData.feeConfig });
});

// 13. 获取物流商
app.get('/api/logistics', (req, res) => {
  const { country } = req.query;
  let logistics = [...mockData.logistics];
  
  if (country) logistics = logistics.filter(l => l.country === country);
  
  res.json({ success: true, data: logistics });
});

// 14. 获取区域
app.get('/api/regions', (req, res) => {
  const { merchantId } = req.query;
  let regions = [...mockData.regions];
  
  if (merchantId) regions = regions.filter(r => r.merchantId === parseInt(merchantId));
  
  res.json({ success: true, data: regions });
});

// 15. 获取统计数据
app.get('/api/statistics', (req, res) => {
  const { merchantId, warehouseId } = req.query;
  
  const stats = {
    todayOrders: 5,
    yesterdayOrders: 8,
    monthOrders: 120,
    lastMonthOrders: 95,
    totalInventory: 2200,
    inTransit: 200,
    locked: 50,
    todayFee: 940,
    yesterdayFee: 1500,
    monthFee: 25000,
    lastMonthFee: 18000,
    todayReceived: 0,
    monthReceived: 30000
  };
  
  res.json({ success: true, data: stats });
});

// 16. 获取商家列表（总管理后台）
app.get('/api/merchants', (req, res) => {
  const merchants = mockData.merchants.map(({ password, ...m }) => m);
  res.json({ success: true, data: merchants });
});

// 17. 获取仓库管理员列表
app.get('/api/warehouse-admins', (req, res) => {
  const admins = mockData.warehouseAdmins.map(({ password, ...a }) => a);
  res.json({ success: true, data: admins });
});

// 18. 获取区域管理员列表
app.get('/api/region-admins', (req, res) => {
  const admins = mockData.regionAdmins.map(({ password, ...a }) => a);
  res.json({ success: true, data: admins });
});

// 19. 获取异常件列表
app.get('/api/exceptions', (req, res) => {
  // 从订单中提取异常件
  const exceptions = mockData.orders
    .filter(o => o.status === 'exception')
    .map(o => ({
      id: o.id,
      orderNo: o.orderNo,
      type: o.exception?.type || 'unknown',
      description: o.exception?.description || '',
      warehouse: mockData.warehouses.find(w => w.id === o.warehouseId)?.name || '',
      merchant: mockData.merchants.find(m => m.id === o.merchantId)?.name || '',
      status: o.exceptionStatus || 'pending',
      createTime: o.createdAt,
      handleType: o.handleType || '',
      remark: o.remark || ''
    }));
  res.json({ success: true, data: exceptions });
});

// 20. 处理异常件
app.post('/api/exceptions/handle', (req, res) => {
  const { id, handleType, remark } = req.body;
  
  const order = mockData.orders.find(o => o.id === id);
  if (order) {
    order.exceptionStatus = 'resolved';
    order.handleType = handleType;
    order.remark = remark;
    order.status = 'resolved';
  }
  
  res.json({ success: true, message: '处理成功' });
});

// 21. 仓库管理员禁用/启用
app.post('/api/warehouse-admins/toggle', (req, res) => {
  const { id, status } = req.body;
  const admin = mockData.warehouseAdmins.find(a => a.id === id);
  if (admin) {
    admin.status = status;
    res.json({ success: true, message: status === 'active' ? '已启用' : '已禁用' });
  } else {
    res.json({ success: false, message: '管理员不存在' });
  }
});

// 22. 创建区域子账号
app.post('/api/region-admins', (req, res) => {
  const { username, name, email, password, regions, permissions } = req.body;
  const newAdmin = {
    id: mockData.regionAdmins.length + 1,
    username,
    password: password || '123456',
    name,
    email,
    role: 'region_admin',
    merchantId: 1,
    regions: Array.isArray(regions) ? regions.join(' ') : regions,
    permissions: Array.isArray(permissions) ? permissions.join(' ') : permissions || 'region_view',
    status: 'active',
    createdAt: new Date().toISOString()
  };
  mockData.regionAdmins.push(newAdmin);
  res.json({ success: true, data: newAdmin, message: '创建成功' });
});

// 23. 更新区域子账号
app.put('/api/region-admins/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { username, name, email, regions, permissions, status } = req.body;
  const admin = mockData.regionAdmins.find(a => a.id === id);
  if (admin) {
    if (username) admin.username = username;
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (regions) admin.regions = Array.isArray(regions) ? regions.join(' ') : regions;
    if (permissions) admin.permissions = Array.isArray(permissions) ? permissions.join(' ') : permissions;
    if (status) admin.status = status;
    res.json({ success: true, message: '更新成功' });
  } else {
    res.json({ success: false, message: '账号不存在' });
  }
});

// 24. 禁用/启用区域子账号
app.post('/api/region-admins/toggle', (req, res) => {
  const { id, status } = req.body;
  const admin = mockData.regionAdmins.find(a => a.id === id);
  if (admin) {
    admin.status = status;
    res.json({ success: true, message: status === 'active' ? '已启用' : '已禁用' });
  } else {
    res.json({ success: false, message: '账号不存在' });
  }
});

// 25. 下发仓库指令
app.post('/api/warehouses/command', (req, res) => {
  const { warehouseId, command, content } = req.body;
  res.json({ success: true, message: '指令已下发到仓库' });
});

// 26. 创建商家
app.post('/api/merchants', (req, res) => {
  const { username, password, name, email, warehouses } = req.body;
  const newMerchant = {
    id: mockData.merchants.length + 1,
    username,
    password: password || '123456',
    name,
    email,
    role: 'merchant',
    parentId: null,
    status: 'active',
    balance: 0,
    warehouses: warehouses || [1, 2, 3],
    defaultWarehouse: 1,
    permissions: ['all'],
    createdAt: new Date().toISOString()
  };
  mockData.merchants.push(newMerchant);
  res.json({ success: true, data: newMerchant, message: '创建成功' });
});

// 27. 更新商家
app.put('/api/merchants/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, warehouses, status, balance } = req.body;
  const merchant = mockData.merchants.find(m => m.id === id);
  if (merchant) {
    if (name) merchant.name = name;
    if (email) merchant.email = email;
    if (warehouses) merchant.warehouses = warehouses;
    if (status) merchant.status = status;
    if (balance) merchant.balance = balance;
    res.json({ success: true, message: '更新成功' });
  } else {
    res.json({ success: false, message: '商家不存在' });
  }
});

// 28. 创建仓库
app.post('/api/warehouses', (req, res) => {
  const { name, country, code, address, contact, phone } = req.body;
  const newWarehouse = {
    id: mockData.warehouses.length + 1,
    name,
    country,
    code,
    address,
    contact,
    phone
  };
  mockData.warehouses.push(newWarehouse);
  res.json({ success: true, data: newWarehouse, message: '创建成功' });
});

// 29. 更新仓库
app.put('/api/warehouses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, country, code, address, contact, phone } = req.body;
  const warehouse = mockData.warehouses.find(w => w.id === id);
  if (warehouse) {
    if (name) warehouse.name = name;
    if (country) warehouse.country = country;
    if (code) warehouse.code = code;
    if (address) warehouse.address = address;
    if (contact) warehouse.contact = contact;
    if (phone) warehouse.phone = phone;
    res.json({ success: true, message: '更新成功' });
  } else {
    res.json({ success: false, message: '仓库不存在' });
  }
});

// 30. 创建区域
app.post('/api/regions', (req, res) => {
  const { name, code, merchantId, warehouses } = req.body;
  const newRegion = {
    id: mockData.regions.length + 1,
    name,
    code,
    merchantId: merchantId || 1,
    warehouses: warehouses || [],
    status: 'active',
    createdAt: new Date().toISOString()
  };
  mockData.regions.push(newRegion);
  res.json({ success: true, data: newRegion, message: '创建成功' });
});

// 31. 更新区域
app.put('/api/regions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, code, warehouses, status } = req.body;
  const region = mockData.regions.find(r => r.id === id);
  if (region) {
    if (name) region.name = name;
    if (code) region.code = code;
    if (warehouses) region.warehouses = warehouses;
    if (status) region.status = status;
    res.json({ success: true, message: '更新成功' });
  } else {
    res.json({ success: false, message: '区域不存在' });
  }
});

// 32. 创建仓库管理员
app.post('/api/warehouse-admins', (req, res) => {
  const { username, password, name, email, warehouseId } = req.body;
  const newAdmin = {
    id: mockData.warehouseAdmins.length + 1,
    username,
    password: password || '123456',
    name,
    email,
    role: 'warehouse_admin',
    warehouseId,
    status: 'active',
    permissions: 'all',
    createdAt: new Date().toISOString()
  };
  mockData.warehouseAdmins.push(newAdmin);
  res.json({ success: true, data: newAdmin, message: '创建成功' });
});

// 33. 更新仓库管理员
app.put('/api/warehouse-admins/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, warehouseId, status, permissions } = req.body;
  const admin = mockData.warehouseAdmins.find(a => a.id === id);
  if (admin) {
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (warehouseId) admin.warehouseId = warehouseId;
    if (status) admin.status = status;
    if (permissions) admin.permissions = permissions;
    res.json({ success: true, message: '更新成功' });
  } else {
    res.json({ success: false, message: '管理员不存在' });
  }
});

// 34. 创建价格配置
app.post('/api/fee-config', (req, res) => {
  const { warehouseId, country, firstWeight, 续重, storage, serviceFee } = req.body;
  const newConfig = {
    id: mockData.feeConfig.length + 1,
    warehouseId,
    country,
    firstWeight,
    续重,
    storage,
    serviceFee,
    status: 'active',
    createdAt: new Date().toISOString()
  };
  mockData.feeConfig.push(newConfig);
  res.json({ success: true, data: newConfig, message: '创建成功' });
});

// 35. 更新价格配置
app.put('/api/fee-config/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { firstWeight, 续重, storage, serviceFee, status } = req.body;
  const config = mockData.feeConfig.find(f => f.id === id);
  if (config) {
    if (firstWeight) config.firstWeight = firstWeight;
    if (续重) config.续重 = 续重;
    if (storage) config.storage = storage;
    if (serviceFee) config.serviceFee = serviceFee;
    if (status) config.status = status;
    res.json({ success: true, message: '更新成功' });
  } else {
    res.json({ success: false, message: '配置不存在' });
  }
});

// 36. 删除商家
app.delete('/api/merchants/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockData.merchants.findIndex(m => m.id === id);
  if (index > -1) {
    mockData.merchants.splice(index, 1);
    res.json({ success: true, message: '删除成功' });
  } else {
    res.json({ success: false, message: '商家不存在' });
  }
});

// 37. 删除仓库
app.delete('/api/warehouses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockData.warehouses.findIndex(w => w.id === id);
  if (index > -1) {
    mockData.warehouses.splice(index, 1);
    res.json({ success: true, message: '删除成功' });
  } else {
    res.json({ success: false, message: '仓库不存在' });
  }
});

// 38. 删除区域
app.delete('/api/regions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockData.regions.findIndex(r => r.id === id);
  if (index > -1) {
    mockData.regions.splice(index, 1);
    res.json({ success: true, message: '删除成功' });
  } else {
    res.json({ success: false, message: '区域不存在' });
  }
});

// 39. 删除仓库管理员
app.delete('/api/warehouse-admins/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockData.warehouseAdmins.findIndex(a => a.id === id);
  if (index > -1) {
    mockData.warehouseAdmins.splice(index, 1);
    res.json({ success: true, message: '删除成功' });
  } else {
    res.json({ success: false, message: '管理员不存在' });
  }
});

// 40. 删除区域管理员
app.delete('/api/region-admins/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockData.regionAdmins.findIndex(a => a.id === id);
  if (index > -1) {
    mockData.regionAdmins.splice(index, 1);
    res.json({ success: true, message: '删除成功' });
  } else {
    res.json({ success: false, message: '管理员不存在' });
  }
});

// 41. 删除价格配置
app.delete('/api/fee-config/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockData.feeConfig.findIndex(f => f.id === id);
  if (index > -1) {
    mockData.feeConfig.splice(index, 1);
    res.json({ success: true, message: '删除成功' });
  } else {
    res.json({ success: false, message: '配置不存在' });
  }
});

app.listen(PORT, () => {
  console.log(`南洋仓后端服务已启动: http://localhost:${PORT}`);
});
