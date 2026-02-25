<template>
  <div class="regions">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>区域管理</span>
          <el-button type="primary">新增区域</el-button>
        </div>
      </template>
      
      <el-table :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="区域名称" />
        <el-table-column prop="merchantId" label="所属商家">
          <template #default="{ row }">
            {{ row.merchantId ? '商家' + row.merchantId : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="warehouseIds" label="包含仓库">
          <template #default="{ row }">
            <el-tag v-for="w in row.warehouseIds" :key="w" style="margin-right: 4px;">
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
        <el-table-column label="操作" width="150">
          <template #default>
            <el-button size="small" type="primary" link>编辑</el-button>
            <el-button size="small" type="danger" link>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getRegions } from '../api'

const tableData = ref([])

const loadData = async () => {
  try {
    const res = await getRegions()
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
