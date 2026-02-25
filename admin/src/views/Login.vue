<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>南洋仓</h1>
        <p>总管理后台</p>
      </div>
      <el-form :model="form" @submit.prevent="onLogin">
        <el-form-item>
          <el-input v-model="form.username" placeholder="请输入管理员账号" prefix-icon="User" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" type="password" placeholder="请输入密码" prefix-icon="Lock" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%;" native-type="submit" :loading="loading">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="demo-hint">
        <p>演示账号：admin / admin123</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const form = ref({
  username: 'admin',
  password: 'admin123'
})

const onLogin = async () => {
  loading.value = true
  try {
    const res = await login(form.value)
    if (res.success) {
      localStorage.setItem('adminToken', 'mock-admin-token')
      localStorage.setItem('adminUser', JSON.stringify(res.data))
      ElMessage.success('登录成功')
      router.replace('/')
    }
  } catch (e) {
    ElMessage.error('登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1989fa 0%, #07c160 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 8px;
}

.login-header p {
  font-size: 14px;
  color: #999;
}

.demo-hint {
  text-align: center;
  margin-top: 16px;
}

.demo-hint p {
  color: #999;
  font-size: 12px;
}
</style>
