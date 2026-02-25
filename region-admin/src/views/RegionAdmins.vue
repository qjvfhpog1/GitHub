<template>
  <div class="region-admins">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>区域子账号管理</span>
          <el-button type="primary">新增子账号</el-button>
        </div>
      </template>
      
      <el-table :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="username" label="账号" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="regions" label="管辖区域">
          <template #default="{ row }">
            <el-tag v-for="r in row.regions" :key="r" style="margin-right: 4px;">
              区域{{ r }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="permissions" label="权限">
          <template #default="{ row }">
            <el-tag v-for="p in row.permissions" :key="p" type="info" style="margin-right: 4px;">
              {{ getPermissionName(p) }}
            </el-tag>
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
            <el-button size="small" type="primary" link>编辑</el-button>
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
import { getRegionAdmins } from '../api'

const tableData = ref([])

const getPermissionName = (p) => {
  const names = {
    region_view: '区域查看',
    region_control: '区域管控',
    warehouse_view: '仓库查看',
    warehouse_operate: '仓库操作'
  }
  return names[p] || p
}

const loadData = async () => {
  try {
    const res = await getRegionAdmins()
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
