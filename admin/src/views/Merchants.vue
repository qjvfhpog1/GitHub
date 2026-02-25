<template>
  <div class="merchants">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>商家列表</span>
          <el-button type="primary">新增商家</el-button>
        </div>
      </template>
      
      <el-table :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="username" label="账号" />
        <el-table-column prop="name" label="商家名称" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="balance" label="账户余额">
          <template #default="{ row }">
            ¥{{ row.balance }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" type="primary" link>查看</el-button>
            <el-button size="small" type="success" link>编辑</el-button>
            <el-button size="small" :type="row.status === 'active' ? 'danger' : 'success'" link>
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMerchants } from '../api'
import dayjs from 'dayjs'

const tableData = ref([])

const loadData = async () => {
  try {
    const res = await getMerchants()
    tableData.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const formatTime = (time) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm')
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
