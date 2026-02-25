<template>
  <div class="statistics">
    <el-card>
      <template #header>
        <span>区域数据统计</span>
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
        <el-col :span="6">
          <div class="stat-box">
            <p class="stat-label">总入库量</p>
            <p class="stat-value">12,680</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-box">
            <p class="stat-label">总发货量</p>
            <p class="stat-value">8,456</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-box">
            <p class="stat-label">总异常件</p>
            <p class="stat-value text-danger">156</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-box">
            <p class="stat-label">处理完成</p>
            <p class="stat-value text-success">142</p>
          </div>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <div class="chart-box">
            <h4>入库/发货趋势</h4>
            <div class="chart-placeholder">
              <el-icon size="48" color="#409eff"><Histogram /></el-icon>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-box">
            <h4>各仓库占比</h4>
            <div class="chart-placeholder">
              <el-icon size="48" color="#67c23a"><PieChart /></el-icon>
            </div>
          </div>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="24">
          <el-card>
            <template #header>
              <span>订单资料导出</span>
            </template>
            <el-form :inline="true">
              <el-form-item label="仓库">
                <el-select v-model="exportForm.warehouse" style="width: 150px;">
                  <el-option label="全部" value="" />
                  <el-option label="泰国仓" value="1" />
                  <el-option label="马来仓" value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="类型">
                <el-select v-model="exportForm.type" style="width: 120px;">
                  <el-option label="入库" value="inbound" />
                  <el-option label="发货" value="outbound" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="exportData">导出Excel</el-button>
                <el-button @click="printData">批量打印</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const dateRange = ref([])
const warehouse = ref('')
const exportForm = ref({
  warehouse: '',
  type: 'inbound'
})

const exportData = () => {
  ElMessage.success('导出成功')
}

const printData = () => {
  ElMessage.info('批量打印功能开发中')
}
</script>

<style scoped>
.stat-box {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #999;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

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
