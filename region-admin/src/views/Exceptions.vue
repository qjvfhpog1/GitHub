<template>
  <div class="exceptions">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>异常件处理</span>
          <el-space>
            <el-select v-model="filterType" placeholder="异常类型" style="width: 120px;">
              <el-option label="全部" value="" />
              <el-option label="破损" value="damage" />
              <el-option label="少货" value="missing" />
              <el-option label="错发" value="wrong" />
              <el-option label="丢失" value="lost" />
            </el-select>
            <el-button type="primary">筛选</el-button>
          </el-space>
        </div>
      </template>
      
      <el-table :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="orderNo" label="订单号" />
        <el-table-column prop="type" label="异常类型">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)">{{ getTypeName(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="warehouse" label="仓库" />
        <el-table-column prop="merchant" label="商家" />
        <el-table-column prop="description" label="异常描述" show-overflow-tooltip />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'pending' ? 'warning' : 'success'">
              {{ row.status === 'pending' ? '待处理' : '已处理' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleExceptionAction(row)">处理</el-button>
            <el-button size="small" type="success" link @click="viewDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 处理弹窗 -->
    <el-dialog v-model="dialogVisible" title="处理异常件" width="500px">
      <el-form :model="currentItem" label-width="100px">
        <el-form-item label="处理方式">
          <el-radio-group v-model="currentItem.handleType">
            <el-radio label="resend">补发商品</el-radio>
            <el-radio label="refund">退款</el-radio>
            <el-radio label="destroy">销毁</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理备注">
          <el-input v-model="currentItem.remark" type="textarea" :rows="3" placeholder="请输入处理备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitHandle">确认处理</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getExceptions, handleException } from '../api'

const filterType = ref('')
const dialogVisible = ref(false)
const currentItem = ref({})
const tableData = ref([])

const getTypeName = (type) => {
  const names = { damage: '破损', missing: '少货', wrong: '错发', lost: '丢失' }
  return names[type] || type
}

const getTypeColor = (type) => {
  const colors = { damage: 'danger', missing: 'warning', wrong: 'info', lost: 'error' }
  return colors[type] || 'info'
}

const loadData = async () => {
  try {
    const res = await getExceptions()
    tableData.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const handleExceptionAction = (row) => {
  currentItem.value = { ...row, handleType: 'resend', remark: '' }
  dialogVisible.value = true
}

const viewDetail = (row) => {
  ElMessage.info('查看异常件详情: ' + row.orderNo)
}

const submitHandle = async () => {
  try {
    await handleException({
      id: currentItem.value.id,
      handleType: currentItem.value.handleType,
      remark: currentItem.value.remark
    })
    ElMessage.success('处理成功')
    dialogVisible.value = false
    loadData() // 刷新列表
  } catch (e) {
    ElMessage.error('处理失败')
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
