<template>
  <div class="regions">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>区域管理</span>
          <el-button type="primary" @click="addRegion">新增区域</el-button>
        </div>
      </template>
      
      <el-table :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="区域名称" />
        <el-table-column prop="code" label="区域代码" />
        <el-table-column prop="merchantId" label="所属商家">
          <template #default="{ row }">
            {{ row.merchantId ? '商家' + row.merchantId : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="warehouses" label="包含仓库">
          <template #default="{ row }">
            <el-tag v-for="w in getWarehousesArray(row.warehouses)" :key="w" style="margin-right: 4px;">
              仓库{{ w }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="editRegion(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteRegion(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑区域' : '新增区域'" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="区域名称">
          <el-input v-model="form.name" placeholder="如: 东南亚区域" />
        </el-form-item>
        <el-form-item label="区域代码">
          <el-input v-model="form.code" placeholder="如: SEA" />
        </el-form-item>
        <el-form-item label="包含仓库">
          <el-select v-model="form.warehouses" multiple placeholder="选择仓库" style="width: 100%;">
            <el-option v-for="w in warehouses" :key="w.id" :label="w.name" :value="w.id" />
          </el-select>
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
import { getRegions, getWarehouses, createRegion, updateRegion, deleteRegion } from '../api'

const tableData = ref([])
const warehouses = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = ref({
  id: null,
  name: '',
  code: '',
  warehouses: []
})

const getWarehousesArray = (wares) => {
  if (!wares) return []
  if (Array.isArray(wares)) return wares
  return String(wares).split(' ')
}

const loadData = async () => {
  try {
    const [regionsRes, warehousesRes] = await Promise.all([getRegions(), getWarehouses()])
    tableData.value = regionsRes.data
    warehouses.value = warehousesRes.data
  } catch (e) {
    console.error(e)
  }
}

const addRegion = () => {
  isEdit.value = false
  form.value = { id: null, name: '', code: '', warehouses: [] }
  dialogVisible.value = true
}

const editRegion = (row) => {
  isEdit.value = true
  form.value = { 
    ...row, 
    warehouses: getWarehousesArray(row.warehouses) 
  }
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!form.value.name || !form.value.code) {
    ElMessage.warning('请填写完整信息')
    return
  }
  try {
    if (isEdit.value) {
      await updateRegion(form.value.id, form.value)
      ElMessage.success('编辑成功')
    } else {
      await createRegion(form.value)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    loadData()
  } catch (e) {
    ElMessage.error('操作失败')
  }
}

const deleteRegion = async (row) => {
  try {
    await deleteRegion(row.id)
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
