<template>
  <div class="fee-config">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>价格体系配置</span>
          <el-button type="primary" @click="addConfig">新增配置</el-button>
        </div>
      </template>
      
      <el-table :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="warehouseId" label="仓库">
          <template #default="{ row }">
            {{ getWarehouseName(row.warehouseId) }}
          </template>
        </el-table-column>
        <el-table-column prop="country" label="国家" />
        <el-table-column prop="firstWeight" label="首重价格" />
        <el-table-column prop="续重" label="续重价格" />
        <el-table-column prop="storage" label="仓储费/天" />
        <el-table-column prop="serviceFee" label="服务费" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="editConfig(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteConfig(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑价格配置' : '新增价格配置'" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="仓库">
          <el-select v-model="form.warehouseId" placeholder="选择仓库" style="width: 100%;">
            <el-option v-for="w in warehouses" :key="w.id" :label="w.name" :value="w.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="国家">
          <el-input v-model="form.country" placeholder="如: 泰国" />
        </el-form-item>
        <el-form-item label="首重价格">
          <el-input v-model="form.firstWeight" placeholder="如: 10" />
        </el-form-item>
        <el-form-item label="续重价格">
          <el-input v-model="form.续重" placeholder="如: 5" />
        </el-form-item>
        <el-form-item label="仓储费/天">
          <el-input v-model="form.storage" placeholder="如: 1" />
        </el-form-item>
        <el-form-item label="服务费">
          <el-input v-model="form.serviceFee" placeholder="如: 2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getFeeConfig, getWarehouses, createFeeConfig, updateFeeConfig, deleteFeeConfig } from '../api'

const tableData = ref([])
const warehouses = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = ref({
  id: null,
  warehouseId: null,
  country: '',
  firstWeight: '',
  续重: '',
  storage: '',
  serviceFee: ''
})

const getWarehouseName = (id) => {
  const w = warehouses.value.find(w => w.id === id)
  return w ? w.name : '未知'
}

const loadData = async () => {
  try {
    const [configRes, warehousesRes] = await Promise.all([getFeeConfig(), getWarehouses()])
    tableData.value = configRes.data || []
    warehouses.value = warehousesRes.data
  } catch (e) {
    console.error(e)
  }
}

const addConfig = () => {
  isEdit.value = false
  form.value = { id: null, warehouseId: null, country: '', firstWeight: '', 续重: '', storage: '', serviceFee: '' }
  dialogVisible.value = true
}

const editConfig = (row) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!form.value.warehouseId || !form.value.country) {
    ElMessage.warning('请填写完整信息')
    return
  }
  try {
    if (isEdit.value) {
      await updateFeeConfig(form.value.id, form.value)
      ElMessage.success('编辑成功')
    } else {
      await createFeeConfig(form.value)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    loadData()
  } catch (e) {
    ElMessage.error('操作失败')
  }
}

const deleteConfig = async (row) => {
  try {
    await deleteFeeConfig(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (e) {
    ElMessage.error('删除失败')
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
