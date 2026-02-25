const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

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
  feeConfig: {
    inboundFee: { type: 'per_item', price: 2 },
    outboundFee: { type: 'per_item', price: 3 },
    storageFee: { type: 'per_day_per_item', price: 0.5 },
    deliveryFee: { type: 'weight', basePrice: 10, perKg: 5 },
    extraService: { packaging: 5, photo: 2 }
  },

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

app.listen(PORT, () => {
  console.log(`南洋仓后端服务已启动: http://localhost:${PORT}`);
});
