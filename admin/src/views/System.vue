<template>
  <div class="system">
    <el-card>
      <template #header>
        <span>系统配置</span>
      </template>
      
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基础设置" name="basic">
          <el-form label-width="120px">
            <el-form-item label="系统名称">
              <el-input v-model="config.systemName" />
            </el-form-item>
            <el-form-item label="客服电话">
              <el-input v-model="config.customerPhone" />
            </el-form-item>
            <el-form-item label="客服邮箱">
              <el-input v-model="config.customerEmail" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="权限模板" name="permission">
          <div class="permission-list">
            <el-card v-for="p in permissions" :key="p.id" class="permission-card">
              <template #header>
                <div class="flex-between">
                  <span>{{ p.name }}</span>
                  <el-tag>{{ p.type }}</el-tag>
                </div>
              </template>
              <p>{{ p.description }}</p>
              <div style="margin-top: 12px;">
                <el-button size="small" type="primary" link>编辑</el-button>
                <el-button size="small" type="danger" link>删除</el-button>
              </div>
            </el-card>
          </div>
          <el-button type="primary" style="margin-top: 16px;">新增权限模板</el-button>
        </el-tab-pane>
        
        <el-tab-pane label="物流配置" name="logistics">
          <el-table :data="logisticsList" stripe>
            <el-table-column prop="name" label="物流商" />
            <el-table-column prop="code" label="代码" />
            <el-table-column prop="country" label="国家" />
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-switch v-model="row.status" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default>
                <el-button size="small" type="primary" link>编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="操作日志" name="logs">
          <el-table :data="logs" stripe>
            <el-table-column prop="time" label="时间" width="180" />
            <el-table-column prop="user" label="操作人" />
            <el-table-column prop="action" label="操作" />
            <el-table-column prop="ip" label="IP地址" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('basic')

const config = ref({
  systemName: '南洋仓管理系统',
  customerPhone: '400-888-8888',
  customerEmail: 'support@nanyang.com'
})

const permissions = ref([
  { id: 1, name: '库存查看权限', type: '商家端', description: '仅可查看库存、库存日志，不可进行下单、充值等操作' },
  { id: 2, name: '下单发货权限', type: '商家端', description: '可查看库存、提交预报单、下单发货、查询物流轨迹' },
  { id: 3, name: '全权限', type: '商家端', description: '可操作所有商家端功能，不可创建、修改账号' }
])

const logisticsList = ref([
  { id: 1, name: 'Flash Express', code: 'FLASH', country: '泰国', status: true },
  { id: 2, name: 'J&T Express', code: 'JT', country: '泰国', status: true },
  { id: 3, name: 'GHTK', code: 'GHTK', country: '越南', status: true },
  { id: 4, name: 'Ninja Van', code: 'NINJA', country: '马来西亚', status: true }
])

const logs = ref([
  { time: '2026-02-25 10:30:00', user: 'admin', action: '修改价格配置', ip: '192.168.1.100' },
  { time: '2026-02-25 09:15:00', user: 'admin', action: '新增仓库', ip: '192.168.1.100' },
  { time: '2026-02-24 16:20:00', user: 'admin', action: '禁用商家账号', ip: '192.168.1.100' }
])
</script>

<style scoped>
.permission-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.permission-card {
  width: 300px;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
