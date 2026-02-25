<template>
  <div class="order page-container">
    <!-- 订单筛选 -->
    <van-tabs v-model:active="activeTab" @change="onTabChange">
      <van-tab title="全部" name="all" />
      <van-tab title="待处理" name="pending" />
      <van-tab title="已拣货" name="picked" />
      <van-tab title="已打包" name="packed" />
      <van-tab title="已出库" name="shipped" />
      <van-tab title="异常" name="exception" />
    </van-tabs>

    <!-- 订单列表 -->
    <div class="order-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="order-card" @click="showDetail(item)">
            <div class="order-header">
              <span class="order-no">{{ item.orderNo }}</span>
              <van-tag :type="getStatusType(item.status)">{{ getStatusText(item.status) }}</van-tag>
            </div>

            <div class="order-info">
              <div class="recipient">
                <van-icon name="user-o" />
                <span>{{ item.recipient.name }}</span>
                <span class="phone">{{ item.recipient.phone }}</span>
              </div>
              <div class="address">
                <van-icon name="location-o" />
                <span>{{ item.recipient.address }}</span>
              </div>
            </div>

            <div class="order-items">
              <div v-for="(goods, idx) in item.items" :key="idx" class="goods-row">
                <span>{{ goods.name }}</span>
                <span>x{{ goods.quantity }}</span>
              </div>
            </div>

            <div class="order-footer">
              <span class="total-fee">合计: <span class="price">¥{{ item.totalFee }}</span></span>
              <van-button size="small" type="primary" v-if="item.status === 'pending'" @click.stop="cancelOrder(item)">
                取消订单
              </van-button>
            </div>

            <!-- 物流信息 -->
            <div v-if="item.logistics.trackingNo" class="logistics-info">
              <van-icon name="logistics" />
              <span>{{ item.logistics.carrier }}: {{ item.logistics.trackingNo }}</span>
              <van-button size="small" type="primary" plain @click.stop="viewLogistics(item)">
                查看物流
              </van-button>
            </div>

            <!-- 异常信息 -->
            <div v-if="item.status === 'exception'" class="exception-info">
              <van-icon name="warning" color="#ee0a24" />
              <span>{{ item.exception?.type }}: {{ item.exception?.description }}</span>
            </div>
          </div>
          <van-empty v-if="list.length === 0 && !loading" description="暂无订单" />
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 新增订单按钮 -->
    <div class="add-btn">
      <van-button round type="primary" icon="plus" @click="showAdd = true">
        下单发货
      </van-button>
    </div>

    <!-- 新增订单弹窗 -->
    <van-popup v-model:show="showAdd" position="bottom" round :style="{ height: '90%' }">
      <div class="add-order">
        <div class="popup-header">
          <span class="title">下单发货</span>
          <van-icon name="cross" @click="showAdd = false" />
        </div>

        <van-form ref="formRef" @submit="onSubmit">
          <van-cell-group inset>
            <van-field v-model="form.warehouseId" is-link readonly label="目的仓库" placeholder="请选择仓库" @click="showWarehousePicker = true" :rules="[{ required: true, message: '请选择仓库' }]" />
          </van-cell-group>

          <div class="card" style="margin: 12px;">
            <div class="card-title">收件人信息</div>
            <van-cell-group>
              <van-field v-model="form.recipient.name" label="姓名" placeholder="请输入收件人姓名" :rules="[{ required: true, message: '请输入姓名' }]" />
              <van-field v-model="form.recipient.phone" label="电话" placeholder="请输入收件人电话" :rules="[{ required: true, message: '请输入电话' }]" />
              <van-field v-model="form.recipient.address" type="textarea" label="地址" placeholder="请输入详细地址" :rules="[{ required: true, message: '请输入地址' }]" />
            </van-cell-group>
          </div>

          <div class="card" style="margin: 12px;">
            <div class="card-title flex-between">
              <span>商品信息</span>
              <van-button size="small" type="primary" plain @click="addItem">+ 添加商品</van-button>
            </div>
            <div v-for="(item, index) in form.items" :key="index" class="item-row">
              <van-field v-model="item.sku" label="SKU" placeholder="SKU" />
              <van-field v-model.number="item.quantity" type="digit" label="数量" placeholder="数量" />
              <van-icon name="delete" class="delete-icon" @click="removeItem(index)" />
            </div>
          </div>

          <van-cell-group inset>
            <van-field v-model="form.remark" type="textarea" label="备注" placeholder="请输入备注（可选）" :rows="2" />
          </van-cell-group>

          <div class="fee-info">
            <div class="fee-row">
              <span>预估费用：</span>
              <span class="price">¥{{ estimatedFee }}</span>
            </div>
          </div>

          <div class="submit-btn">
            <van-button round block type="primary" native-type="submit">
              提交订单
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>

    <!-- 仓库选择器 -->
    <van-picker v-model:show="showWarehousePicker" :columns="warehouseColumns" @confirm="onWarehouseConfirm" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getOrders, createOrder, getWarehouses, getInventory } from '../api'
import { Toast } from 'vant'
import dayjs from 'dayjs'

const userInfo = JSON.parse(localStorage.getItem('user') || '{}')

const activeTab = ref('all')
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const showAdd = ref(false)
const formRef = ref(null)
const warehouses = ref([])
const inventory = ref([])

const currentWarehouse = ref(1)

const form = ref({
  warehouseId: '',
  recipient: { name: '', phone: '', address: '' },
  items: [{ sku: '', quantity: 1 }],
  remark: ''
})

const showWarehousePicker = ref(false)
const estimatedFee = ref(0)

onMounted(async () => {
  await loadWarehouses()
  await loadData()
})

const loadWarehouses = async () => {
  try {
    const res = await getWarehouses()
    warehouses.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const loadData = async () => {
  try {
    const params = { merchantId: userInfo.id, warehouseId: currentWarehouse.value }
    if (activeTab.value !== 'all') {
      params.status = activeTab.value
    }
    const res = await getOrders(params)
    list.value = res.data
    finished.value = true
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

const onLoad = async () => {
  await loadData()
}

const onRefresh = async () => {
  list.value = []
  finished.value = false
  loading.value = true
  await loadData()
}

const onTabChange = async () => {
  list.value = []
  loading.value = true
  await loadData()
}

const getStatusType = (status) => {
  const types = {
    pending: 'warning',
    picked: 'primary',
    packed: 'primary',
    shipped: 'success',
    exception: 'danger'
  }
  return types[status] || 'default'
}

const getStatusText = (status) => {
  const texts = {
    pending: '待处理',
    picked: '已拣货',
    packed: '已打包',
    shipped: '已出库',
    exception: '异常'
  }
  return texts[status] || status
}

const warehouseColumns = computed(() => warehouses.value.map(w => ({ text: w.name, value: w.id })))

const onWarehouseConfirm = ({ selectedOptions }) => {
  form.value.warehouseId = selectedOptions[0].value
  showWarehousePicker.value = false
}

const addItem = () => {
  form.value.items.push({ sku: '', quantity: 1 })
}

const removeItem = (index) => {
  if (form.value.items.length > 1) {
    form.value.items.splice(index, 1)
  }
}

const onSubmit = async () => {
  try {
    // 获取商品信息
    const items = form.value.items.map(item => {
      const inv = inventory.value.find(i => i.sku === item.sku)
      return {
        sku: item.sku,
        name: inv?.name || '商品',
        quantity: item.quantity,
        price: inv?.price || 50
      }
    })

    const data = {
      merchantId: userInfo.id,
      warehouseId: form.value.warehouseId,
      recipient: form.value.recipient,
      items,
      remark: form.value.remark
    }
    
    const res = await createOrder(data)
    Toast('订单提交成功')
    showAdd.value = false
    form.value = {
      warehouseId: '',
      recipient: { name: '', phone: '', address: '' },
      items: [{ sku: '', quantity: 1 }],
      remark: ''
    }
    await loadData()
  } catch (e) {
    console.error(e)
  }
}

const showDetail = (item) => {
  Toast('查看订单: ' + item.orderNo)
}

const cancelOrder = (item) => {
  Toast('取消订单: ' + item.orderNo)
}

const viewLogistics = (item) => {
  Toast('查看物流: ' + item.logistics.trackingNo)
}
</script>

<style scoped>
.order-list {
  padding: 12px;
}

.order-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.order-no {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.order-info {
  margin-bottom: 12px;
}

.recipient, .address {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #646566;
  margin-bottom: 6px;
}

.recipient span {
  margin-left: 8px;
}

.recipient .phone {
  color: #969799;
  margin-left: 12px;
}

.address span {
  margin-left: 8px;
}

.order-items {
  border-top: 1px solid #f5f5f5;
  border-bottom: 1px solid #f5f5f5;
  padding: 12px 0;
  margin-bottom: 12px;
}

.goods-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #646566;
  margin-bottom: 4px;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-fee {
  font-size: 14px;
  color: #646566;
}

.total-fee .price {
  font-size: 18px;
  font-weight: 600;
  color: #ff6034;
}

.logistics-info {
  display: flex;
  align-items: center;
  margin-top: 12px;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 14px;
  color: #646566;
}

.logistics-info span {
  margin-left: 8px;
  flex: 1;
}

.exception-info {
  display: flex;
  align-items: center;
  margin-top: 12px;
  padding: 8px 12px;
  background: #fff7f5;
  border-radius: 8px;
  font-size: 14px;
  color: #ee0a24;
}

.exception-info span {
  margin-left: 6px;
}

.add-btn {
  position: fixed;
  bottom: 80px;
  right: 16px;
  z-index: 100;
}

.add-order {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 20px;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
  position: sticky;
  top: 0;
  background: #fff;
}

.popup-header .title {
  font-size: 18px;
  font-weight: 600;
}

.item-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.delete-icon {
  color: #ee0a24;
  margin-left: 12px;
}

.fee-info {
  padding: 16px;
  text-align: right;
}

.fee-row {
  font-size: 16px;
}

.fee-row .price {
  font-size: 24px;
  font-weight: 600;
  color: #ff6034;
}

.submit-btn {
  padding: 16px;
}
</style>
