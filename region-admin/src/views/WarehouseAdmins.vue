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
          <template #default>
            管辖区域内仓库
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default>
            <el-button size="small" type="primary" link>查看</el-button>
            <el-button size="small" type="warning" link>分配权限</el-button>
            <el-button size="small" type="danger" link>禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getWarehouseAdmins } from '../api'

const tableData = ref([])

const loadData = async () => {
  try {
    const res = await getWarehouseAdmins()
    tableData.value = res.data
  } catch (e) {
    console.error(e)
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
