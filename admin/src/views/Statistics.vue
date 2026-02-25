<template>
  <div class="statistics">
    <el-card>
      <template #header>
        <span>数据报表</span>
      </template>
      
      <el-form :inline="true">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="仓库">
          <el-select v-model="warehouse" placeholder="请选择" style="width: 150px;">
            <el-option label="全部" value="" />
            <el-option label="泰国仓" value="1" />
            <el-option label="马来仓" value="2" />
            <el-option label="越南仓" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button>导出</el-button>
        </el-form-item>
      </el-form>
      
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <div class="chart-box">
            <h4>订单量统计</h4>
            <div class="chart-placeholder">
              <el-icon size="48" color="#409eff"><Histogram /></el-icon>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-box">
            <h4>营收统计</h4>
            <div class="chart-placeholder">
              <el-icon size="48" color="#67c23a"><TrendCharts /></el-icon>
            </div>
          </div>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <div class="chart-box">
            <h4>仓库使用率</h4>
            <div class="chart-placeholder">
              <el-icon size="48" color="#e6a23c"><PieChart /></el-icon>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-box">
            <h4>国家分布</h4>
            <div class="chart-placeholder">
              <el-icon size="48" color="#f56c6c"><DataAnalysis /></el-icon>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dateRange = ref([])
const warehouse = ref('')
</script>

<style scoped>
.chart-box {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}

.chart-box h4 {
  margin-bottom: 16px;
  color: #333;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  border-radius: 8px;
}
</style>
