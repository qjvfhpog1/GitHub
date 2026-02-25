<template>
  <div class="warehouses">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>管辖仓库列表</span>
        </div>
      </template>
      
      <el-table :data="tableData" stripe>
        <el-table-column prop="code" label="仓库代码" />
        <el-table-column prop="name" label="仓库名称" />
        <el-table-column prop="country" label="国家" />
        <el-table-column prop="address" label="地址" show-overflow-tooltip />
        <el-table-column prop="contact" label="联系人" />
        <el-table-column prop="phone" label="联系电话" />
        <el-table-column label="今日数据" width="200">
          <template #default="{ row }">
            <el-tag type="success">入库 {{ row.todayInbound || 0 }}</el-tag>
            <el-tag type="warning" style="margin-left: 8px;">发货 {{ row.todayOutbound || 0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="viewDetail(row)">查看详情</el-button>
            <el-button size="small" type="success" @click="openCommandDialog(row)">下发指令</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 下发指令弹窗 -->
    <el-dialog v-model="commandDialogVisible" title="下发仓库指令" width="500px">
      <el-form :model="commandForm" label-width="100px">
        <el-form-item label="仓库">
          <span>{{ commandForm.warehouseName }}</span>
        </el-form-item>
        <el-form-item label="指令类型">
          <el-select v-model="commandForm.command" placeholder="选择指令" style="width: 100%;">
            <el-option label="盘点库存" value="inventory_check" />
            <el-option label="调整价格" value="price_adjust" />
            <el-option label="更新配置" value="config_update" />
            <el-option label="紧急通知" value="urgent_notice" />
          </el-select>
        </el-form-item>
        <el-form-item label="指令内容">
          <el-input v-model="commandForm.content" type="textarea" :rows="4" placeholder="请输入指令内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="commandDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCommand">下发</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getWarehouses, sendWarehouseCommand } from '../api'

const tableData = ref([])
const commandDialogVisible = ref(false)
const commandForm = ref({
  warehouseId: null,
  warehouseName: '',
  command: '',
  content: ''
})

const loadData = async () => {
  try {
    const res = await getWarehouses()
    tableData.value = res.data.map(item => ({
      ...item,
      todayInbound: Math.floor(Math.random() * 100) + 50,
      todayOutbound: Math.floor(Math.random() * 80) + 30
    }))
  } catch (e) {
    console.error(e)
  }
}

const viewDetail = (row) => {
  ElMessage.info(`仓库: ${row.name}, 地址: ${row.address}`)
}

const openCommandDialog = (row) => {
  commandForm.value = {
    warehouseId: row.id,
    warehouseName: row.name,
    command: '',
    content: ''
  }
  commandDialogVisible.value = true
}

const submitCommand = async () => {
  if (!commandForm.value.command) {
    ElMessage.warning('请选择指令类型')
    return
  }
  try {
    await sendWarehouseCommand(commandForm.value)
    ElMessage.success('指令已下发')
    commandDialogVisible.value = false
  } catch (e) {
    ElMessage.error('下发失败')
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
