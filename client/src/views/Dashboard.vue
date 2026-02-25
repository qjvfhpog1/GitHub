<template>
  <div class="dashboard page-container">
    <!-- 仓库选择 -->
    <div class="warehouse-select">
      <van-dropdown-menu>
        <van-dropdown-item v-model="currentWarehouse" :options="warehouses" @change="onWarehouseChange" />
      </van-dropdown-menu>
    </div>

    <!-- 数据概览卡片 -->
    <div class="stats-grid">
      <div class="stats-card" @click="goTo('/home/order')">
        <div class="stats-icon" style="background: #1989fa;">
          <van-icon name="bag-o" size="24" color="#fff" />
        </div>
        <div class="stats-info">
          <p class="stats-label">今日发货</p>
          <p class="stats-value">{{ stats.todayOrders }}</p>
        </div>
      </div>

      <div class="stats-card" @click="goTo('/home/inventory')">
        <div class="stats-icon" style="background: #07c160;">
          <van-icon name="shop-o" size="24" color="#fff" />
        </div>
        <div class="stats-info">
          <p class="stats-label">当前库存</p>
          <p class="stats-value">{{ stats.totalInventory }}</p>
        </div>
      </div>

      <div class="stats-card">
        <div class="stats-icon" style="background: #ff976a;">
          <van-icon name="gold-coin-o" size="24" color="#fff" />
        </div>
        <div class="stats-info">
          <p class="stats-label">今日消费</p>
          <p class="stats-value">¥{{ stats.todayFee }}</p>
        </div>
      </div>

      <div class="stats-card">
        <div class="stats-icon" style="background: #ee0a24;">
          <van-icon name="sign" size="24" color="#fff" />
        </div>
        <div class="stats-info">
          <p class="stats-label">在途库存</p>
          <p class="stats-value">{{ stats.inTransit }}</p>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="card">
      <div class="card-title">快捷操作</div>
      <van-grid :column-num="4" :gutter="10">
        <van-grid-item icon="logistics" text="预报入库" @click="goTo('/home/forecast')" />
        <van-grid-item icon="bag-o" text="下单发货" @click="goTo('/home/order')" />
        <van-grid-item icon="orders-o" text="库存查询" @click="goTo('/home/inventory')" />
        <van-grid-item icon="balance-o" text="账户充值" @click="showRecharge = true" />
      </van-grid>
    </div>

    <!-- 消息通知 -->
    <div class="card">
      <div class="flex-between" style="margin-bottom: 12px;">
        <div class="card-title" style="margin: 0;">最新消息</div>
        <van-tag type="danger" v-if="unreadCount > 0">{{ unreadCount }} 未读</van-tag>
      </div>
      <div class="message-list">
        <div v-for="msg in messages" :key="msg.id" class="message-item" @click="showMessage(msg)">
          <van-icon :name="getMsgIcon(msg.type)" size="20" :color="msg.status === 'unread' ? '#1989fa' : '#969799'" />
          <div class="message-content">
            <p class="message-title">{{ msg.title }}</p>
            <p class="message-desc">{{ msg.content }}</p>
          </div>
          <span class="message-time">{{ formatTime(msg.createdAt) }}</span>
        </div>
        <van-empty v-if="messages.length === 0" description="暂无消息" />
      </div>
    </div>

    <!-- 充值弹窗 -->
    <van-popup v-model:show="showRecharge" position="bottom" round>
      <div class="recharge-popup">
        <div class="recharge-title">账户充值</div>
        <van-form @submit="onRecharge">
          <van-cell-group inset>
            <van-field v-model="rechargeForm.amount" type="digit" label="充值金额" placeholder="请输入充值金额" :rules="[{ required: true, message: '请输入充值金额' }]" />
            <van-field v-model="rechargeForm.remark" label="备注" placeholder="选填" />
          </van-cell-group>
          <div class="recharge-methods">
            <div class="method-title">支付方式</div>
            <van-radio-group v-model="rechargeForm.method">
              <van-cell-group>
                <van-cell clickable @click="rechargeForm.method = '支付宝'">
                  <template #title>
                    <span>支付宝</span>
                  </template>
                  <template #right-icon>
                    <van-radio name="支付宝" />
                  </template>
                </van-cell>
                <van-cell clickable @click="rechargeForm.method = '微信支付'">
                  <template #title>
                    <span>微信支付</span>
                  </template>
                  <template #right-icon>
                    <van-radio name="微信支付" />
                  </template>
                </van-cell>
                <van-cell clickable @click="rechargeForm.method = 'PayPal'">
                  <template #title>
                    <span>PayPal</span>
                  </template>
                  <template #right-icon>
                    <van-radio name="PayPal" />
                  </template>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </div>
          <div class="recharge-btn">
            <van-button round block type="primary" native-type="submit">
              确认充值
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getWarehouses, getStatistics, getMessages, createRecharge } from '../api'
import { Toast } from 'vant'
import dayjs from 'dayjs'

const router = useRouter()

const currentWarehouse = ref(1)
const warehouses = ref([])
const stats = ref({})
const messages = ref([])
const showRecharge = ref(false)
const rechargeForm = ref({
  amount: '',
  remark: '',
  method: '支付宝'
})

const userInfo = JSON.parse(localStorage.getItem('user') || '{}')

onMounted(async () => {
  await loadWarehouses()
  await loadStatistics()
  await loadMessages()
})

const loadWarehouses = async () => {
  try {
    const res = await getWarehouses()
    warehouses.value = res.data.map(w => ({ text: w.name, value: w.id }))
  } catch (e) {
    console.error(e)
  }
}

const loadStatistics = async () => {
  try {
    const res = await getStatistics({ merchantId: userInfo.id, warehouseId: currentWarehouse.value })
    stats.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const loadMessages = async () => {
  try {
    const res = await getMessages({ merchantId: userInfo.id })
    messages.value = res.data.slice(0, 5)
  } catch (e) {
    console.error(e)
  }
}

const unreadCount = computed(() => messages.value.filter(m => m.status === 'unread').length)

const onWarehouseChange = async () => {
  await loadStatistics()
}

const goTo = (path) => {
  router.push(path)
}

const getMsgIcon = (type) => {
  const icons = {
    forecast: 'logistics',
    order: 'bag-o',
    inventory: 'shop-o',
    system: 'setting-o'
  }
  return icons[type] || 'bell'
}

const formatTime = (time) => {
  return dayjs(time).format('MM-DD HH:mm')
}

const showMessage = (msg) => {
  Toast(msg.content)
}

const onRecharge = async () => {
  try {
    await createRecharge({
      merchantId: userInfo.id,
      amount: parseFloat(rechargeForm.value.amount),
      method: rechargeForm.value.method,
      remark: rechargeForm.value.remark
    })
    Toast('充值成功')
    showRecharge.value = false
    rechargeForm.value.amount = ''
    rechargeForm.value.remark = ''
  } catch (e) {
    console.error(e)
  }
}
</script>

<style scoped>
.warehouse-select {
  background: #fff;
  padding: 8px 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 12px;
}

.stats-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
}

.stats-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.stats-info {
  flex: 1;
}

.stats-label {
  font-size: 12px;
  color: #969799;
  margin-bottom: 4px;
}

.stats-value {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.message-list {
  max-height: 300px;
  overflow-y: auto;
}

.message-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.message-item:last-child {
  border-bottom: none;
}

.message-content {
  flex: 1;
  margin-left: 12px;
}

.message-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.message-desc {
  font-size: 12px;
  color: #969799;
}

.message-time {
  font-size: 12px;
  color: #969799;
}

.recharge-popup {
  padding: 16px;
}

.recharge-title {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
}

.recharge-methods {
  margin: 16px 0;
}

.method-title {
  font-size: 14px;
  color: #969799;
  margin-bottom: 8px;
}

.recharge-btn {
  margin-top: 16px;
}
</style>
