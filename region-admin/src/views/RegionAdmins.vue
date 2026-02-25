<template>
  <div class="region-admins">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>区域子账号管理</span>
          <el-button type="primary" @click="addAccount">新增子账号</el-button>
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
              {{ getRegionName(r) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="permissions" label="权限">
          <template #default="{ row }">
            <el-tag v-for="p in getPermsArray(row.permissions)" :key="p" type="info" style="margin-right: 4px;">
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
        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="editAccount(row)">编辑</el-button>
            <el-button size="small" type="warning" @click="setPerms(row)">分配权限</el-button>
            <el-button size="small" type="danger" @click="disableAccount(row)">禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑子账号' : '新增子账号'" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="账号">
          <el-input v-model="form.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="密码" v-if="!isEdit">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
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
    
    <!-- 分配权限弹窗 -->
    <el-dialog v-model="permDialogVisible" title="分配权限" width="500px">
      <el-form :model="currentRow" label-width="100px">
        <el-form-item label="账号">
          <span>{{ currentRow.name }}</span>
        </el-form-item>
        <el-form-item label="权限配置">
          <el-checkbox-group v-model="currentRow.permissionsList">
            <el-checkbox label="region_view">区域查看</el-checkbox>
            <el-checkbox label="region_control">区域管控</el-checkbox>
            <el-checkbox label="warehouse_view">仓库查看</el-checkbox>
            <el-checkbox label="warehouse_operate">仓库操作</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="permDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePerms">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getRegionAdmins, createRegionAdmin, updateRegionAdmin, toggleRegionAdmin } from '../api'

const tableData = ref([])
const dialogVisible = ref(false)
const permDialogVisible = ref(false)
const isEdit = ref(false)
const form = ref({
  id: null,
  username: '',
  name: '',
  email: '',
  password: '',
  regions: []
})
const currentRow = ref({})

const regionNames = {
  1: '区域1-泰国',
  2: '区域2-马来西亚',
  3: '区域3-越南',
  4: '区域4-印尼',
  5: '区域5-新加坡',
  6: '区域6-菲律宾'
}

const getRegionName = (r) => regionNames[r] || `区域${r}`

const getRegionsArray = (regions) => {
  if (!regions) return []
  if (Array.isArray(regions)) return regions
  return String(regions).split(' ')
}

const getPermsArray = (perms) => {
  if (!perms) return []
  if (Array.isArray(perms)) return perms
  return String(perms).split(' ')
}

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
    ElMessage.error('加载失败')
  }
}

const addAccount = () => {
  console.log('新增子账号')
  isEdit.value = false
  form.value = { id: null, username: '', name: '', email: '', password: '', regions: [] }
  dialogVisible.value = true
}

const editAccount = (row) => {
  console.log('编辑', row)
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

const setPerms = (row) => {
  console.log('分配权限', row)
  currentRow.value = { 
    ...row, 
    permissionsList: getPermsArray(row.permissions)
  }
  permDialogVisible.value = true
}

const savePerms = () => {
  console.log('保存权限', currentRow.value)
  ElMessage.success('权限保存成功')
  permDialogVisible.value = false
  loadData()
}

const disableAccount = async (row) => {
  const newStatus = row.status === 'active' ? 'disabled' : 'active'
  try {
    await toggleRegionAdmin({ id: row.id, status: newStatus })
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
