<template>
  <el-container class="layout-container">
    <el-aside width="220px">
      <div class="logo">
        <span>南洋仓</span>
        <span class="sub">区域管理</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#e6a23c"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据概览</span>
        </el-menu-item>
        
        <el-sub-menu index="1">
          <template #title>
            <el-icon><OfficeBuilding /></el-icon>
            <span>仓库管理</span>
          </template>
          <el-menu-item index="/warehouses">仓库列表</el-menu-item>
          <el-menu-item index="/warehouse-admins">仓库管理员</el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu index="2">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>人员管理</span>
          </template>
          <el-menu-item index="/region-admins">区域子账号</el-menu-item>
        </el-sub-menu>
        
        <el-menu-item index="/exceptions">
          <el-icon><Warning /></el-icon>
          <span>异常处理</span>
        </el-menu-item>
        
        <el-menu-item index="/statistics">
          <el-icon><PieChart /></el-icon>
          <span>数据统计</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header>
        <div class="header-left">
          <span class="page-title">{{ pageTitle }}</span>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-icon><User /></el-icon>
              <span>{{ userInfo.name }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const userInfo = JSON.parse(localStorage.getItem('regionUser') || '{}')

const activeMenu = computed(() => route.path)

const pageTitle = computed(() => {
  const titles = {
    '/dashboard': '数据概览',
    '/warehouses': '仓库列表',
    '/warehouse-admins': '仓库管理员',
    '/region-admins': '区域子账号',
    '/exceptions': '异常处理',
    '/statistics': '数据统计'
  }
  return titles[route.path] || '南洋仓'
})

const handleCommand = (command) => {
  if (command === 'logout') {
    localStorage.removeItem('regionToken')
    localStorage.removeItem('regionUser')
    router.push('/login')
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.el-aside {
  background-color: #304156;
}

.logo {
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #2b3a4a;
  color: #fff;
}

.logo span:first-child {
  font-size: 18px;
  font-weight: 600;
}

.logo .sub {
  font-size: 12px;
  color: #e6a23c;
}

.el-header {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #333;
}

.user-info span {
  margin-left: 8px;
}

.el-main {
  background: #f0f2f5;
  padding: 20px;
}
</style>
