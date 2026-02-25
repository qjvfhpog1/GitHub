<template>
  <div class="finance">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <p class="stat-label">今日营收</p>
            <p class="stat-value text-primary">¥12,680</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <p class="stat-label">本月营收</p>
            <p class="stat-value text-success">¥386,500</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <p class="stat-label">今日订单</p>
            <p class="stat-value">156</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <p class="stat-label">本月订单</p>
            <p class="stat-value">4,680</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-card style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>营收记录</span>
          <el-button type="primary">导出报表</el-button>
        </div>
      </template>
      
      <el-table :data="tableData" stripe>
        <el-table-column prop="date" label="日期" />
        <el-table-column prop="orderCount" label="订单数" />
        <el-table-column prop="inboundFee" label="入库费" />
        <el-table-column prop="outboundFee" label="出库费" />
        <el-table-column prop="storageFee" label="仓储费" />
        <el-table-column prop="deliveryFee" label="派送费" />
        <el-table-column prop="totalFee" label="合计">
          <template #default="{ row }">
            <span class="text-price">¥{{ row.totalFee }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tableData = ref([
  { date: '2026-02-25', orderCount: 156, inboundFee: 1200, outboundFee: 1800, storageFee: 680, deliveryFee: 8000, totalFee: 12680 },
  { date: '2026-02-24', orderCount: 142, inboundFee: 1100, outboundFee: 1650, storageFee: 620, deliveryFee: 7200, totalFee: 11570 },
  { date: '2026-02-23', orderCount: 168, inboundFee: 1350, outboundFee: 1920, storageFee: 750, deliveryFee: 8500, totalFee: 12520 }
])
</script>

<style scoped>
.stat-card {
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #999;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-price {
  color: #f56c6c;
  font-weight: 600;
}
</style>
