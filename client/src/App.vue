<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 设置页面标题
  document.title = '南洋仓'
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.van-tabbar {
  z-index: 1000;
}

.page-container {
  padding-bottom: 50px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  padding: 16px;
  background: #fff;
}

.card {
  background: #fff;
  border-radius: 8px;
  margin: 12px;
  padding: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-primary {
  color: #1989fa;
}

.text-success {
  color: #07c160;
}

.text-warning {
  color: #ff976a;
}

.text-danger {
  color: #ee0a24;
}

.text-gray {
  color: #969799;
}

.text-price {
  color: #ff6034;
  font-weight: 600;
}
</style>
