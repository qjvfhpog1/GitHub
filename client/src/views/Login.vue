<template>
  <div class="login-container">
    <div class="login-header">
      <div class="logo">📦</div>
      <h1>南洋仓</h1>
      <p>东南亚海外仓仓配系统</p>
    </div>

    <div class="login-form">
      <van-form @submit="onLogin">
        <van-cell-group inset>
          <van-field
            v-model="loginForm.username"
            name="username"
            placeholder="请输入手机号或邮箱"
            :rules="[{ required: true, message: '请输入账号' }]"
          >
            <template #left-icon>
              <van-icon name="user-o" />
            </template>
          </van-field>
          <van-field
            v-model="loginForm.password"
            type="password"
            name="password"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请输入密码' }]"
          >
            <template #left-icon>
              <van-icon name="lock" />
            </template>
          </van-field>
        </van-cell-group>

        <div class="login-btn">
          <van-button round block type="primary" native-type="submit" :loading="loading">
            登录
          </van-button>
        </div>

        <div class="login-links">
          <span @click="showRegister = true">注册账号</span>
          <span @click="showReset = true">忘记密码？</span>
        </div>
      </van-form>
    </div>

    <div class="demo-hint">
      <p>演示账号：13800138000 / 123456</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api'
import { Toast } from 'vant'

const router = useRouter()
const loading = ref(false)
const loginForm = ref({
  username: '13800138000',
  password: '123456'
})

const onLogin = async () => {
  loading.value = true
  try {
    const res = await login({ ...loginForm.value, role: 'merchant' })
    if (res.success) {
      localStorage.setItem('token', 'mock-token')
      localStorage.setItem('user', JSON.stringify(res.data))
      Toast('登录成功')
      router.replace('/home')
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const showRegister = ref(false)
const showReset = ref(false)
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1989fa 0%, #07c160 100%);
  padding: 60px 24px 24px;
}

.login-header {
  text-align: center;
  margin-bottom: 48px;
}

.logo {
  font-size: 64px;
  margin-bottom: 16px;
}

.login-header h1 {
  color: #fff;
  font-size: 28px;
  margin-bottom: 8px;
}

.login-header p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.login-form {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

.login-btn {
  margin-top: 24px;
}

.login-links {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding: 0 8px;
}

.login-links span {
  color: #1989fa;
  font-size: 14px;
}

.demo-hint {
  margin-top: 32px;
  text-align: center;
}

.demo-hint p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  display: inline-block;
}
</style>
