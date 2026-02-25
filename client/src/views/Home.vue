<template>
  <div class="home-container">
    <van-nav-bar :title="pageTitle" left-arrow @click-left="onBack" />

    <div class="home-content">
      <router-view />
    </div>

    <van-tabbar v-model="activeTab" route>
      <van-tabbar-item to="/home/dashboard" icon="chart-trending-o">数据</van-tabbar-item>
      <van-tabbar-item to="/home/forecast" icon="logistics">预报</van-tabbar-item>
      <van-tabbar-item to="/home/inventory" icon="orders-o">库存</van-tabbar-item>
      <van-tabbar-item to="/home/order" icon="bag-o">订单</van-tabbar-item>
      <van-tabbar-item to="/home/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const activeTab = ref(0)

const pageTitle = computed(() => {
  const titles = {
    '/home/dashboard': '数据概览',
    '/home/forecast': '发货预报',
    '/home/inventory': '库存管理',
    '/home/order': '订单管理',
    '/home/profile': '个人中心'
  }
  return titles[route.path] || '南洋仓'
})

const onBack = () => {
  if (route.path !== '/home/dashboard') {
    router.back()
  }
}

watch(() => route.path, (path) => {
  if (path === '/home') {
    router.replace('/home/dashboard')
  }
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.home-content {
  min-height: calc(100vh - 96px);
  padding-bottom: 50px;
}
</style>
