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

    <!-- 注册弹窗 -->
    <van-popup v-model:show="showRegister" position="bottom" round>
      <div class="register-popup">
        <h3>注册账号</h3>
        <van-form @submit="onRegister">
          <van-cell-group inset>
            <van-field
              v-model="registerForm.email"
              name="email"
              placeholder="请输入邮箱地址"
              :rules="[{ required: true, message: '请输入邮箱' }, { validator: checkEmail, message: '请输入正确的邮箱格式' }]"
            >
              <template #left-icon>
                <van-icon name="envelop-o" />
              </template>
            </van-field>
            <van-field
              v-model="registerForm.code"
              name="code"
              placeholder="请输入验证码"
              :rules="[{ required: true, message: '请输入验证码' }]"
            >
              <template #left-icon>
                <van-icon name="warning-o" />
              </template>
              <template #button>
                <van-button size="small" type="primary" @click="sendCode" :disabled="countdown > 0" native-type="button">
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </van-button>
              </template>
            </van-field>
            <van-field
              v-model="registerForm.password"
              type="password"
              name="password"
              placeholder="请设置密码（6-20位）"
              :rules="[{ required: true, message: '请设置密码' }, { validator: checkPassword, message: '密码6-20位' }]"
            >
              <template #left-icon>
                <van-icon name="lock" />
              </template>
            </van-field>
            <van-field
              v-model="registerForm.name"
              name="name"
              placeholder="请输入公司/店铺名称"
            >
              <template #left-icon>
                <van-icon name="shop-o" />
              </template>
            </van-field>
          </van-cell-group>

          <div class="register-btn">
            <van-button round block type="primary" native-type="submit" :loading="registerLoading">
              注册
            </van-button>
          </div>
        </van-form>
        <div class="register-close" @click="showRegister = false">
          <van-icon name="cross" />
        </div>
      </div>
    </van-popup>

    <!-- 忘记密码弹窗 -->
    <van-popup v-model:show="showReset" position="bottom" round>
      <div class="register-popup">
        <h3>忘记密码</h3>
        <van-form @submit="onReset">
          <van-cell-group inset>
            <van-field
              v-model="resetForm.email"
              name="email"
              placeholder="请输入注册邮箱"
              :rules="[{ required: true, message: '请输入邮箱' }]"
            >
              <template #left-icon>
                <van-icon name="envelop-o" />
              </template>
            </van-field>
            <van-field
              v-model="resetForm.code"
              name="code"
              placeholder="请输入验证码"
              :rules="[{ required: true, message: '请输入验证码' }]"
            >
              <template #left-icon>
                <van-icon name="warning-o" />
              </template>
              <template #button>
                <van-button size="small" type="primary" @click="sendResetCode" :disabled="countdown > 0" native-type="button">
                  {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                </van-button>
              </template>
            </van-field>
            <van-field
              v-model="resetForm.password"
              type="password"
              name="password"
              placeholder="请设置新密码"
              :rules="[{ required: true, message: '请设置新密码' }]"
            >
              <template #left-icon>
                <van-icon name="lock" />
              </template>
            </van-field>
          </van-cell-group>

          <div class="register-btn">
            <van-button round block type="primary" native-type="submit">
              重置密码
            </van-button>
          </div>
        </van-form>
        <div class="register-close" @click="showReset = false">
          <van-icon name="cross" />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, sendRegisterCode, register } from '../api'
import { Toast } from 'vant'

const router = useRouter()
const loading = ref(false)
const registerLoading = ref(false)
const countdown = ref(0)

const loginForm = ref({
  username: '13800138000',
  password: '123456'
})

const registerForm = ref({
  email: '',
  code: '',
  password: '',
  name: ''
})

const resetForm = ref({
  email: '',
  code: '',
  password: ''
})

const showRegister = ref(false)
const showReset = ref(false)

const checkEmail = (val) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
}

const checkPassword = (val) => {
  return val.length >= 6 && val.length <= 20
}

const sendCode = async () => {
  if (!registerForm.value.email) {
    Toast('请输入邮箱')
    return
  }
  if (!checkEmail(registerForm.value.email)) {
    Toast('请输入正确的邮箱格式')
    return
  }
  
  try {
    await sendRegisterCode(registerForm.value.email)
    Toast('验证码已发送到您的邮箱')
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (e) {
    console.error(e)
  }
}

const sendResetCode = async () => {
  if (!resetForm.value.email) {
    Toast('请输入邮箱')
    return
  }
  
  try {
    await sendRegisterCode(resetForm.value.email)
    Toast('验证码已发送到您的邮箱')
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (e) {
    console.error(e)
  }
}

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

const onRegister = async () => {
  registerLoading.value = true
  try {
    await register(registerForm.value)
    Toast('注册成功，请登录')
    showRegister.value = false
    loginForm.value.username = registerForm.value.email
    loginForm.value.password = ''
  } catch (e) {
    console.error(e)
  } finally {
    registerLoading.value = false
  }
}

const onReset = () => {
  Toast('密码重置功能开发中')
}
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

/* 注册弹窗 */
.register-popup {
  padding: 24px;
  padding-bottom: 40px;
  position: relative;
}

.register-popup h3 {
  text-align: center;
  font-size: 18px;
  margin-bottom: 24px;
  color: #333;
}

.register-btn {
  margin-top: 24px;
}

.register-close {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 20px;
  color: #999;
}
</style>
