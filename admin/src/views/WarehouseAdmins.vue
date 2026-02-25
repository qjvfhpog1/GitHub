<template>
  <div class="warehouse-admins">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>仓库管理员</span>
          <el-button type="primary" @click="addAdmin">新增管理员</el-button>
        </div>
      </template>
      
      <el-table :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="username" label="账号" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="warehouseId" label="所属仓库">
          <template #default="{ row }">
            {{ getWarehouseName(row.warehouseId) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="editAdmin(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteAdmin(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑管理员' : '新增管理员'" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="账号">
          <el-input v-model="form.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码" v-if="!isEdit">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="所属仓库">
          <el-select v-model="form.warehouseId" placeholder="选择仓库" style="width: 100%;">
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
import { getWarehouseAdmins, getWarehouses, createWarehouseAdmin, updateWarehouseAdmin, deleteWarehouseAdmin } from '../api'

const tableData = ref([])
const warehouses = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = ref({
  id: null,
  username: '',
  password: '',
  name: '',
  email: '',
  warehouseId: null
})

const getWarehouseName = (id) => {
  const w = warehouses.value.find(w => w.id === id)
  return w ? w.name : '未知'
}

const loadData = async () => {
  try {
    const [adminsRes, warehousesRes] = await Promise.all([getWarehouseAdmins(), getWarehouses()])
    tableData.value = adminsRes.data
    warehouses.value = warehousesRes.data
  } catch (e) {
    console.error(e)
  }
}

const addAdmin = () => {
  isEdit.value = false
  form.value = { id: null, username: '', password: '', name: '', email: '', warehouseId: null }
  dialogVisible.value = true
}

const editAdmin = (row) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!form.value.username || !form.value.name || !form.value.warehouseId) {
    ElMessage.warning('请填写完整信息')
    return
  }
  try {
    if (isEdit.value) {
      await updateWarehouseAdmin(form.value.id, form.value)
      ElMessage.success('编辑成功')
    } else {
      await createWarehouseAdmin(form.value)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    loadData()
  } catch (e) {
    ElMessage.error('操作失败')
  }
}

const deleteAdmin = async (row) => {
  try {
    await deleteWarehouseAdmin(row.id)
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
