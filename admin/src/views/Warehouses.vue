<template>
  <div class="warehouses">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>仓库列表</span>
          <el-button type="primary">新增仓库</el-button>
        </div>
      </template>
      
      <el-table :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="code" label="仓库代码" />
        <el-table-column prop="name" label="仓库名称" />
        <el-table-column prop="country" label="国家" />
        <el-table-column prop="address" label="地址" show-overflow-tooltip />
        <el-table-column prop="contact" label="联系人" />
        <el-table-column prop="phone" label="联系电话" />
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
import { getWarehouses } from '../api'

const tableData = ref([])

const loadData = async () => {
  try {
    const res = await getWarehouses()
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
