<template>
  <div class="order page-container">
    <van-tabs v-model:active="activeTab">
      <van-tab title="全部" name="all" />
      <van-tab title="待处理" name="pending" />
    </van-tabs>

    <div class="list-box">
      <div v-for="item in list" :key="item.id" class="card">
        <div>{{ item.orderNo }}</div>
        <div>状态: {{ item.status }}</div>
      </div>
      <van-empty v-if="list.length === 0" description="暂无订单" />
    </div>

    <van-button class="add-btn" round type="primary" icon="plus" @click="showAdd = true">下单发货</van-button>

    <van-popup v-model:show="showAdd" position="bottom">
      <div style="padding: 20px;">
        <h3>下单发货</h3>
        
        <van-cell title="目的仓库">
          <template #value>
            <select v-model="form.warehouseId" style="width: 100%; padding: 8px;">
              <option value="">请选择仓库</option>
              <option v-for="w in warehouses" :key="w.id" :value="w.id">{{ w.name }}</option>
            </select>
          </template>
        </van-cell>
        
        <van-field v-model="form.recipient.name" label="收件人" placeholder="请输入" />
        <van-field v-model="form.recipient.phone" label="电话" placeholder="请输入" />
        <van-field v-model="form.recipient.address" label="地址" placeholder="请输入" />
        <van-field v-model="form.remark" label="备注" placeholder="请输入" />
        
        <van-button type="primary" block @click="submitForm" style="margin-top: 20px;">提交</van-button>
        <van-button block @click="showAdd = false" style="margin-top: 10px;">取消</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getOrders, createOrder, getWarehouses } from '../api'
import { Toast } from 'vant'

const userInfo = JSON.parse(localStorage.getItem('user') || '{}')

const activeTab = ref('all')
const list = ref([])
const showAdd = ref(false)

const warehouses = ref([])

const form = ref({
  warehouseId: '',
  recipient: { name: '', phone: '', address: '' },
  remark: ''
})

onMounted(() => {
  loadWarehouses()
  loadData()
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
    const res = await getOrders({ merchantId: userInfo.id })
    list.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const submitForm = async () => {
  if (!form.value.warehouseId || !form.value.recipient.name) {
    Toast('请填写完整信息')
    return
  }
  try {
    await createOrder({
      merchantId: userInfo.id,
      warehouseId: form.value.warehouseId,
      recipient: form.value.recipient,
      items: [{ sku: 'SKU001', name: '商品', quantity: 1, price: 100 }],
      remark: form.value.remark
    })
    Toast('订单提交成功')
    showAdd.value = false
    form.value = { warehouseId: '', recipient: { name: '', phone: '', address: '' }, remark: '' }
    loadData()
  } catch (e) {
    console.error(e)
  }
}
</script>

<style scoped>
.list-box { padding: 12px; }
.card { background: #fff; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
.add-btn { position: fixed; bottom: 80px; right: 16px; }
</style>
