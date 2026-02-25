<template>
  <div class="forecast page-container">
    <van-tabs v-model:active="activeTab">
      <van-tab title="全部" name="all" />
      <van-tab title="待到仓" name="pending" />
    </van-tabs>

    <div class="list-box">
      <div v-for="item in list" :key="item.id" class="card">
        <div>{{ item.code }}</div>
        <div>状态: {{ item.status }}</div>
      </div>
      <van-empty v-if="list.length === 0" description="暂无预报单" />
    </div>

    <van-button class="add-btn" round type="primary" icon="plus" @click="showAdd = true">新增预报</van-button>

    <van-popup v-model:show="showAdd" position="bottom">
      <div style="padding: 20px;">
        <h3>新增预报</h3>
        
        <van-cell title="目的仓库">
          <template #value>
            <select v-model="form.warehouseId" style="width: 100%; padding: 8px;">
              <option value="">请选择仓库</option>
              <option v-for="w in warehouses" :key="w.id" :value="w.id">{{ w.name }}</option>
            </select>
          </template>
        </van-cell>
        
        <van-cell title="预计到仓">
          <template #value>
            <input type="date" v-model="form.expectedDate" style="width: 100%; padding: 8px;">
          </template>
        </van-cell>
        
        <van-cell title="头程物流">
          <template #value>
            <select v-model="form.logisticsCarrier" style="width: 100%; padding: 8px;">
              <option value="">请选择物流</option>
              <option v-for="l in logistics" :key="l.id" :value="l.name">{{ l.name }}</option>
            </select>
          </template>
        </van-cell>
        
        <van-field v-model="form.trackingNo" label="物流单号" placeholder="请输入" />
        <van-field v-model="form.remark" label="备注" placeholder="请输入" />
        
        <van-button type="primary" block @click="submitForm" style="margin-top: 20px;">提交</van-button>
        <van-button block @click="showAdd = false" style="margin-top: 10px;">取消</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getForecasts, createForecast, getWarehouses, getLogistics } from '../api'
import { Toast } from 'vant'

const userInfo = JSON.parse(localStorage.getItem('user') || '{}')

const activeTab = ref('all')
const list = ref([])
const showAdd = ref(false)

const warehouses = ref([])
const logistics = ref([])

const form = ref({
  warehouseId: '',
  expectedDate: '',
  logisticsCarrier: '',
  trackingNo: '',
  remark: ''
})

onMounted(() => {
  loadWarehouses()
  loadLogistics()
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

const loadLogistics = async () => {
  try {
    const res = await getLogistics()
    logistics.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const loadData = async () => {
  try {
    const res = await getForecasts({ merchantId: userInfo.id })
    list.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const submitForm = async () => {
  if (!form.value.warehouseId || !form.value.expectedDate) {
    Toast('请选择仓库和日期')
    return
  }
  try {
    await createForecast({
      merchantId: userInfo.id,
      warehouseId: form.value.warehouseId,
      expectedDate: form.value.expectedDate,
      items: [{ sku: 'SKU001', name: '测试商品', quantity: 100, weight: 0.5, volume: 0.001, category: '电子产品' }],
      logistics: { carrier: form.value.logisticsCarrier, trackingNo: form.value.trackingNo },
      remark: form.value.remark
    })
    Toast('提交成功')
    showAdd.value = false
    form.value = { warehouseId: '', expectedDate: '', logisticsCarrier: '', trackingNo: '', remark: '' }
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
