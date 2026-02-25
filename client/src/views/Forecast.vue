<template>
  <div class="forecast page-container">
    <!-- 预报单列表 -->
    <van-tabs v-model:active="activeTab" @change="onTabChange">
      <van-tab title="全部" name="all" />
      <van-tab title="待到仓" name="pending" />
      <van-tab title="已到仓" name="arrived" />
      <van-tab title="已入库" name="stored" />
      <van-tab title="异常" name="exception" />
    </van-tabs>

    <div class="forecast-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="forecast-card" @click="showDetail(item)">
            <div class="forecast-header">
              <span class="forecast-code">{{ item.code }}</span>
              <van-tag :type="getStatusType(item.status)">{{ getStatusText(item.status) }}</van-tag>
            </div>
            <div class="forecast-info">
              <div class="forecast-row">
                <span class="label">目的仓库：</span>
                <span class="value">{{ getWarehouseName(item.warehouseId) }}</span>
              </div>
              <div class="forecast-row">
                <span class="label">预计到仓：</span>
                <span class="value">{{ item.expectedDate }}</span>
              </div>
              <div class="forecast-row">
                <span class="label">商品数量：</span>
                <span class="value">{{ item.items?.length || 0 }} 种</span>
              </div>
            </div>
            <div class="forecast-footer">
              <span class="time">{{ formatTime(item.createdAt) }}</span>
              <van-button size="small" type="primary" v-if="item.status === 'pending'" @click.stop="editForecast(item)">
                编辑
              </van-button>
            </div>
          </div>
          <van-empty v-if="list.length === 0 && !loading" description="暂无预报单" />
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 新增预报单按钮 -->
    <div class="add-btn">
      <van-button round type="primary" icon="plus" @click="showAdd = true">
        新增预报
      </van-button>
    </div>

    <!-- 新增预报弹窗 -->
    <van-popup v-model:show="showAdd" position="bottom" round :style="{ height: '90%' }">
      <div class="add-forecast">
        <div class="popup-header">
          <span class="title">新增预报单</span>
          <van-icon name="cross" @click="showAdd = false" />
        </div>

        <van-form ref="formRef" @submit="onSubmit">
          <van-cell-group inset>
            <van-field v-model="form.warehouseId" is-link readonly label="目的仓库" placeholder="请选择仓库" @click="showWarehousePicker = true" :rules="[{ required: true, message: '请选择仓库' }]" />
            <van-field v-model="form.expectedDate" is-link readonly label="预计到仓" placeholder="请选择日期" @click="showDatePicker = true" :rules="[{ required: true, message: '请选择日期' }]" />
          </van-cell-group>

          <div class="card" style="margin: 12px;">
            <div class="card-title flex-between">
              <span>商品信息</span>
              <van-button size="small" type="primary" plain @click="addItem">+ 添加商品</van-button>
            </div>
            <div v-for="(item, index) in form.items" :key="index" class="item-row">
              <van-grid :column-num="2" :gutter="10">
                <van-grid-item>
                  <van-field v-model="item.sku" label="SKU" placeholder="请输入SKU" />
                </van-grid-item>
                <van-grid-item>
                  <van-field v-model="item.name" label="名称" placeholder="请输入名称" />
                </van-grid-item>
                <van-grid-item>
                  <van-field v-model.number="item.quantity" type="digit" label="数量" placeholder="数量" />
                </van-grid-item>
                <van-grid-item>
                  <van-field v-model.number="item.weight" type="digit" label="重量(kg)" placeholder="重量" />
                </van-grid-item>
              </van-grid>
              <van-icon name="delete" class="delete-icon" @click="removeItem(index)" />
            </div>
          </div>

          <van-cell-group inset>
            <van-field v-model="form.logistics.carrier" is-link readonly label="头程物流" placeholder="请选择物流" @click="showLogisticsPicker = true" />
            <van-field v-model="form.logistics.trackingNo" label="物流单号" placeholder="请输入物流单号" />
            <van-field v-model="form.remark" type="textarea" label="备注" placeholder="请输入备注（可选）" :rows="2" />
          </van-cell-group>

          <div class="submit-btn">
            <van-button round block type="primary" native-type="submit">
              提交预报
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>

    <!-- 仓库选择器 -->
    <van-picker v-model:show="showWarehousePicker" :columns="warehouseColumns" @confirm="onWarehouseConfirm" />

    <!-- 日期选择器 -->
    <van-popup v-model:show="showDatePicker" position="bottom" round>
      <van-date-picker v-model="currentDate" title="选择日期" :min-date="minDate" @confirm="onDateConfirm" @cancel="showDatePicker = false" />
    </van-popup>

    <!-- 物流选择器 -->
    <van-picker v-model:show="showLogisticsPicker" :columns="logisticsColumns" @confirm="onLogisticsConfirm" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getForecasts, createForecast, getWarehouses, getLogistics } from '../api'
import { Toast, Dialog } from 'vant'
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
const logistics = ref([])

const form = ref({
  warehouseId: '',
  expectedDate: '',
  items: [{ sku: '', name: '', quantity: '', weight: '', volume: '', category: '' }],
  logistics: { carrier: '', trackingNo: '' },
  remark: ''
})

const showWarehousePicker = ref(false)
const showDatePicker = ref(false)
const showLogisticsPicker = ref(false)
const minDate = new Date()
const currentDate = ref(['2026', '02', '25'])

onMounted(async () => {
  await loadWarehouses()
  await loadLogistics()
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
    const params = { merchantId: userInfo.id }
    if (activeTab.value !== 'all') {
      params.status = activeTab.value
    }
    const res = await getForecasts(params)
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

const getWarehouseName = (id) => {
  const w = warehouses.value.find(w => w.id === id)
  return w ? w.name : ''
}

const getStatusType = (status) => {
  const types = {
    pending: 'warning',
    arrived: 'primary',
    checked: 'primary',
    stored: 'success',
    exception: 'danger'
  }
  return types[status] || 'default'
}

const getStatusText = (status) => {
  const texts = {
    pending: '待到仓',
    arrived: '已到仓',
    checked: '验收中',
    stored: '已入库',
    exception: '异常'
  }
  return texts[status] || status
}

const formatTime = (time) => {
  return dayjs(time).format('MM-DD HH:mm')
}

const warehouseColumns = computed(() => warehouses.value.map(w => ({ text: w.name, value: w.id })))
const logisticsColumns = computed(() => logistics.value.map(l => ({ text: l.name, value: l.name })))

const onWarehouseConfirm = ({ selectedOptions }) => {
  form.value.warehouseId = selectedOptions[0].value
  showWarehousePicker.value = false
}

const onDateConfirm = ({ selectedValues }) => {
  form.value.expectedDate = selectedValues.join('-')
  showDatePicker.value = false
}

const onLogisticsConfirm = ({ selectedOptions }) => {
  form.value.logistics.carrier = selectedOptions[0].value
  showLogisticsPicker.value = false
}

const addItem = () => {
  form.value.items.push({ sku: '', name: '', quantity: '', weight: '', volume: '', category: '' })
}

const removeItem = (index) => {
  if (form.value.items.length > 1) {
    form.value.items.splice(index, 1)
  }
}

const onSubmit = async () => {
  try {
    const data = {
      merchantId: userInfo.id,
      warehouseId: form.value.warehouseId,
      expectedDate: form.value.expectedDate,
      items: form.value.items.filter(i => i.sku && i.name),
      logistics: form.value.logistics,
      remark: form.value.remark
    }
    const res = await createForecast(data)
    Toast('预报单提交成功')
    showAdd.value = false
    form.value = {
      warehouseId: '',
      expectedDate: '',
      items: [{ sku: '', name: '', quantity: '', weight: '', volume: '', category: '' }],
      logistics: { carrier: '', trackingNo: '' },
      remark: ''
    }
    await loadData()
  } catch (e) {
    console.error(e)
  }
}

const showDetail = (item) => {
  Toast('查看详情: ' + item.code)
}

const editForecast = (item) => {
  Toast('编辑预报单: ' + item.code)
}
</script>

<style scoped>
.forecast-list {
  padding: 12px;
}

.forecast-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.forecast-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.forecast-code {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.forecast-info {
  margin-bottom: 12px;
}

.forecast-row {
  display: flex;
  font-size: 14px;
  margin-bottom: 6px;
}

.forecast-row .label {
  color: #969799;
}

.forecast-row .value {
  color: #333;
}

.forecast-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time {
  font-size: 12px;
  color: #969799;
}

.add-btn {
  position: fixed;
  bottom: 80px;
  right: 16px;
  z-index: 100;
}

.add-forecast {
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
  position: relative;
  margin-bottom: 12px;
}

.delete-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #ee0a24;
}

.submit-btn {
  padding: 16px;
  margin-top: 16px;
}
</style>
