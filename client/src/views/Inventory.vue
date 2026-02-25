<template>
  <div class="inventory page-container">
    <!-- 搜索筛选 -->
    <div class="search-bar">
      <van-search v-model="searchText" placeholder="搜索SKU/商品名称" @search="onSearch" />
    </div>

    <!-- 库存列表 -->
    <div class="inventory-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id" class="inventory-card">
            <div class="inventory-header">
              <span class="sku">{{ item.sku }}</span>
              <van-tag type="primary">{{ item.category }}</van-tag>
            </div>
            <div class="inventory-name">{{ item.name }}</div>
            
            <van-grid :column-num="4" class="stock-grid">
              <van-grid-item>
                <div class="stock-item">
                  <p class="stock-value">{{ item.totalStock }}</p>
                  <p class="stock-label">总库存</p>
                </div>
              </van-grid-item>
              <van-grid-item>
                <div class="stock-item">
                  <p class="stock-value text-success">{{ item.availableStock }}</p>
                  <p class="stock-label">可发货</p>
                </div>
              </van-grid-item>
              <van-grid-item>
                <div class="stock-item">
                  <p class="stock-value text-warning">{{ item.inTransitStock }}</p>
                  <p class="stock-label">在途</p>
                </div>
              </van-grid-item>
              <van-grid-item>
                <div class="stock-item">
                  <p class="stock-value text-danger">{{ item.lockedStock }}</p>
                  <p class="stock-label">已锁定</p>
                </div>
              </van-grid-item>
            </van-grid>

            <div class="inventory-footer">
              <span class="location">库位: {{ item.location }}</span>
              <van-button size="small" type="primary" plain @click="showDetail(item)">
                详情
              </van-button>
            </div>

            <!-- 库存预警提示 -->
            <div v-if="item.availableStock < item.warnQuantity" class="warning-tip">
              <van-icon name="warning" color="#ee0a24" />
              <span>库存不足预警：当前可发货 {{ item.availableStock }} 件，预警值 {{ item.warnQuantity }} 件</span>
            </div>
          </div>
          <van-empty v-if="list.length === 0 && !loading" description="暂无库存数据" />
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 详情弹窗 -->
    <van-popup v-model:show="showDetailPopup" position="bottom" round :style="{ height: '70%' }">
      <div class="detail-popup">
        <div class="popup-header">
          <span class="title">库存详情</span>
          <van-icon name="cross" @click="showDetailPopup = false" />
        </div>

        <div v-if="currentItem" class="detail-content">
          <van-cell-group inset>
            <van-cell title="SKU" :value="currentItem.sku" />
            <van-cell title="商品名称" :value="currentItem.name" />
            <van-cell title="商品类别" :value="currentItem.category" />
            <van-cell title="库位" :value="currentItem.location" />
          </van-cell-group>

          <div class="card">
            <div class="card-title">库存数量</div>
            <van-grid :column-num="2" :gutter="10">
              <van-grid-item>
                <div class="detail-stock">
                  <p class="value">{{ currentItem.totalStock }}</p>
                  <p class="label">总库存</p>
                </div>
              </van-grid-item>
              <van-grid-item>
                <div class="detail-stock">
                  <p class="value text-success">{{ currentItem.availableStock }}</p>
                  <p class="label">可发货</p>
                </div>
              </van-grid-item>
              <van-grid-item>
                <div class="detail-stock">
                  <p class="value text-warning">{{ currentItem.inTransitStock }}</p>
                  <p class="label">在途</p>
                </div>
              </van-grid-item>
              <van-grid-item>
                <div class="detail-stock">
                  <p class="value text-danger">{{ currentItem.lockedStock }}</p>
                  <p class="label">已锁定</p>
                </div>
              </van-grid-item>
            </van-grid>
          </div>

          <van-cell-group inset>
            <van-cell title="预警值" :value="currentItem.warnQuantity + ' 件'" />
          </van-cell-group>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getInventory } from '../api'
import { Toast } from 'vant'

const userInfo = JSON.parse(localStorage.getItem('user') || '{}')

const searchText = ref('')
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const showDetailPopup = ref(false)
const currentItem = ref(null)
const currentWarehouse = ref(1)

onMounted(async () => {
  await loadData()
})

const loadData = async () => {
  try {
    const params = {
      merchantId: userInfo.id,
      warehouseId: currentWarehouse.value
    }
    if (searchText.value) {
      params.sku = searchText.value
      params.name = searchText.value
    }
    const res = await getInventory(params)
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

const onSearch = async () => {
  list.value = []
  loading.value = true
  await loadData()
}

const showDetail = (item) => {
  currentItem.value = item
  showDetailPopup.value = true
}
</script>

<style scoped>
.search-bar {
  background: #fff;
  padding: 8px 0;
}

.inventory-list {
  padding: 12px;
}

.inventory-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.sku {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.inventory-name {
  font-size: 14px;
  color: #646566;
  margin-bottom: 12px;
}

.stock-grid {
  margin-bottom: 12px;
}

.stock-item {
  text-align: center;
}

.stock-value {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.stock-label {
  font-size: 12px;
  color: #969799;
  margin-top: 4px;
}

.inventory-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.location {
  font-size: 12px;
  color: #969799;
}

.warning-tip {
  display: flex;
  align-items: center;
  margin-top: 12px;
  padding: 8px 12px;
  background: #fff7f5;
  border-radius: 8px;
  font-size: 12px;
  color: #ee0a24;
}

.warning-tip span {
  margin-left: 6px;
}

.detail-popup {
  height: 100%;
  overflow-y: auto;
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

.detail-content {
  padding: 16px 0;
}

.detail-stock {
  text-align: center;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.detail-stock .value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.detail-stock .label {
  font-size: 12px;
  color: #969799;
  margin-top: 4px;
}
</style>
