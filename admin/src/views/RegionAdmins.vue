<template>
  <div class="region-admins">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>区域管理员</span>
          <el-button type="primary">新增区域管理员</el-button>
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
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default>
            <el-button size="small" type="primary" link>编辑</el-button>
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
