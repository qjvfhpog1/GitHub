<template>
  <div class="warehouse-admins">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>仓库管理员</span>
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
        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="viewAdmin(row)">查看</el-button>
            <el-button size="small" type="warning" @click="setPermissions(row)">分配权限</el-button>
            <el-button size="small" type="danger" @click="disableAdmin(row)">禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 查看详情弹窗 -->
    <el-dialog v-model="viewDialogVisible" title="管理员详情" width="500px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="账号">{{ currentAdmin.username }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ currentAdmin.name }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ currentAdmin.email }}</el-descriptions-item>
        <el-descriptions-item label="所属仓库">{{ getWarehouseName(currentAdmin.warehouseId) }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentAdmin.status === 'active' ? 'success' : 'danger'">
            {{ currentAdmin.status === 'active' ? '正常' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
    
    <!-- 分配权限弹窗 -->
    <el-dialog v-model="permDialogVisible" title="分配权限" width="500px">
      <el-form :model="currentAdmin" label-width="100px">
        <el-form-item label="管理员">
          <span>{{ currentAdmin.name }}</span>
        </el-form-item>
        <el-form-item label="权限配置">
          <el-checkbox-group v-model="currentAdmin.permissions">
            <el-checkbox label="inbound">入库管理</el-checkbox>
            <el-checkbox label="outbound">出库管理</el-checkbox>
            <el-checkbox label="inventory">库存管理</el-checkbox>
            <el-checkbox label="exception">异常处理</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="permDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermissions">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getWarehouseAdmins, getWarehouses, toggleWarehouseAdmin } from '../api'

const tableData = ref([])
const warehouses = ref([])
const viewDialogVisible = ref(false)
const permDialogVisible = ref(false)
const currentAdmin = ref({})

const getWarehouseName = (id) => {
  const w = warehouses.value.find(w => w.id === id)
  return w ? w.name : '未知'
}

const loadData = async () => {
  try {
    const [adminsRes, warehousesRes] = await Promise.all([
      getWarehouseAdmins(),
      getWarehouses()
    ])
    tableData.value = adminsRes.data
    warehouses.value = warehousesRes.data
  } catch (e) {
    console.error(e)
  }
}

const viewAdmin = (row) => {
  currentAdmin.value = { ...row, permissions: row.permissions || [] }
  viewDialogVisible.value = true
}

const setPermissions = (row) => {
  currentAdmin.value = { ...row, permissions: row.permissions ? row.permissions.split(' ') : [] }
  permDialogVisible.value = true
}

const savePermissions = () => {
  ElMessage.success('权限保存成功')
  permDialogVisible.value = false
  loadData()
}

const disableAdmin = async (row) => {
  const newStatus = row.status === 'active' ? 'disabled' : 'active'
  try {
    await toggleWarehouseAdmin({ id: row.id, status: newStatus })
    ElMessage.success(newStatus === 'active' ? '已启用' : '已禁用')
    loadData()
  } catch (e) {
    ElMessage.error('操作失败')
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
