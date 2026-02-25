<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background: #409eff;">
              <el-icon size="24"><User /></el-icon>
            </div>
            <div class="stat-info">
              <p class="stat-label">商家总数</p>
              <p class="stat-value">{{ stats.merchantCount }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background: #67c23a;">
              <el-icon size="24"><OfficeBuilding /></el-icon>
            </div>
            <div class="stat-info">
              <p class="stat-label">仓库总数</p>
              <p class="stat-value">{{ stats.warehouseCount }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background: #e6a23c;">
              <el-icon size="24"><ShoppingCart /></el-icon>
            </div>
            <div class="stat-info">
              <p class="stat-label">今日订单</p>
              <p class="stat-value">{{ stats.todayOrders }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" style="background: #f56c6c;">
              <el-icon size="24"><Money /></el-icon>
            </div>
            <div class="stat-info">
              <p class="stat-label">今日营收</p>
              <p class="stat-value">¥{{ stats.todayRevenue }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>订单趋势</span>
          </template>
          <div class="chart-placeholder">
            <el-icon size="48" color="#ccc"><TrendCharts /></el-icon>
            <p>订单趋势图表</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>营收统计</span>
          </template>
          <div class="chart-placeholder">
            <el-icon size="48" color="#ccc"><PieChart /></el-icon>
            <p>营收统计图表</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>快捷操作</span>
          </template>
          <el-space>
            <el-button type="primary" @click="$router.push('/merchants')">商家管理</el-button>
            <el-button type="success" @click="$router.push('/warehouses')">仓库管理</el-button>
            <el-button type="warning" @click="$router.push('/fee-config')">价格配置</el-button>
            <el-button type="info" @click="$router.push('/statistics')">数据报表</el-button>
          </el-space>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const stats = ref({
  merchantCount: 12,
  warehouseCount: 6,
  todayOrders: 156,
  todayRevenue: 25680
})

onMounted(() => {
  // 加载统计数据
})
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-right: 16px;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #999;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
}
</style>
