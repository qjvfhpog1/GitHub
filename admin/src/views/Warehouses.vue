<template>
  <div class="warehouses">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>仓库列表</span>
          <el-button type="primary" @click="addWarehouse">新增仓库</el-button>
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
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="editWarehouse(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteWarehouse(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑仓库' : '新增仓库'" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="仓库代码">
          <el-input v-model="form.code" placeholder="如: TH-BKK" />
        </el-form-item>
        <el-form-item label="仓库名称">
          <el-input v-model="form.name" placeholder="请输入仓库名称" />
        </el-form-item>
        <el-form-item label="国家">
          <el-input v-model="form.country" placeholder="请输入国家" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="form.contact" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone" placeholder="请输入电话" />
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
import { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } from '../api'

const tableData = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = ref({
  id: null,
  code: '',
  name: '',
  country: '',
  address: '',
  contact: '',
  phone: ''
})

const loadData = async () => {
  try {
    const res = await getWarehouses()
    tableData.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const addWarehouse = () => {
  isEdit.value = false
  form.value = { id: null, code: '', name: '', country: '', address: '', contact: '', phone: '' }
  dialogVisible.value = true
}

const editWarehouse = (row) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!form.value.code || !form.value.name) {
    ElMessage.warning('请填写完整信息')
    return
  }
  try {
    if (isEdit.value) {
      await updateWarehouse(form.value.id, form.value)
      ElMessage.success('编辑成功')
    } else {
      await createWarehouse(form.value)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    loadData()
  } catch (e) {
    ElMessage.error('操作失败')
  }
}

const deleteWarehouse = async (row) => {
  try {
    await deleteWarehouse(row.id)
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
