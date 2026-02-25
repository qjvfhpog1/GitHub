<template>
  <div class="region-admins">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>区域管理员</span>
          <el-button type="primary" @click="addAdmin">新增管理员</el-button>
        </div>
      </template>
      
      <el-table :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="username" label="账号" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="regions" label="管辖区域">
          <template #default="{ row }">
            <el-tag v-for="r in getRegionsArray(row.regions)" :key="r" style="margin-right: 4px;">
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
        <el-form-item label="管辖区域">
          <el-select v-model="form.regions" multiple placeholder="选择区域" style="width: 100%;">
            <el-option label="区域1 - 泰国" value="1" />
            <el-option label="区域2 - 马来西亚" value="2" />
            <el-option label="区域3 - 越南" value="3" />
            <el-option label="区域4 - 印尼" value="4" />
            <el-option label="区域5 - 新加坡" value="5" />
            <el-option label="区域6 - 菲律宾" value="6" />
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
import { getRegionAdmins, createRegionAdmin, updateRegionAdmin, deleteRegionAdmin } from '../api'

const tableData = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = ref({
  id: null,
  username: '',
  password: '',
  name: '',
  email: '',
  regions: []
})

const getRegionsArray = (regions) => {
  if (!regions) return []
  if (Array.isArray(regions)) return regions
  return String(regions).split(' ')
}

const loadData = async () => {
  try {
    const res = await getRegionAdmins()
    tableData.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const addAdmin = () => {
  isEdit.value = false
  form.value = { id: null, username: '', password: '', name: '', email: '', regions: [] }
  dialogVisible.value = true
}

const editAdmin = (row) => {
  isEdit.value = true
  form.value = { 
    ...row, 
    regions: getRegionsArray(row.regions)
  }
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!form.value.username || !form.value.name) {
    ElMessage.warning('请填写完整信息')
    return
  }
  try {
    if (isEdit.value) {
      await updateRegionAdmin(form.value.id, form.value)
      ElMessage.success('编辑成功')
    } else {
      await createRegionAdmin(form.value)
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
    await deleteRegionAdmin(row.id)
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
