<template>
  <div class="profile page-container">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="avatar">
        <van-icon name="user-o" size="40" color="#fff" />
      </div>
      <div class="user-info">
        <h3>{{ userInfo.name }}</h3>
        <p>{{ userInfo.username }}</p>
      </div>
      <van-tag type="success">商家主账号</van-tag>
    </div>

    <!-- 账户余额 -->
    <div class="card" @click="showRecharge = true">
      <div class="balance-card">
        <div class="balance-info">
          <p class="balance-label">账户余额</p>
          <p class="balance-value">¥{{ userInfo.balance || 50000 }}</p>
        </div>
        <van-button type="primary" size="small">充值</van-button>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="card">
      <van-cell-group>
        <van-cell title="子账号管理" is-link @click="goTo('/home/sub-account')">
          <template #icon>
            <van-icon name="friends-o" size="20" style="margin-right: 12px;" />
          </template>
        </van-cell>
        <van-cell title="区域账户管理" is-link @click="goTo('/home/region-account')">
          <template #icon>
            <van-icon name="cluster-o" size="20" style="margin-right: 12px;" />
          </template>
        </van-cell>
        <van-cell title="消息中心" is-link :badge="unreadCount || ''" @click="goTo('/home/messages')">
          <template #icon>
            <van-icon name="bell-o" size="20" style="margin-right: 12px;" />
          </template>
        </van-cell>
        <van-cell title="账单管理" is-link @click="goTo('/home/bills')">
          <template #icon>
            <van-icon name="balance-o" size="20" style="margin-right: 12px;" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <div class="card">
      <van-cell-group>
        <van-cell title="充值记录" is-link @click="goTo('/home/recharge-records')">
          <template #icon>
            <van-icon name="paid" size="20" style="margin-right: 12px;" />
          </template>
        </van-cell>
        <van-cell title="费用明细" is-link @click="goTo('/home/fee-details')">
          <template #icon>
            <van-icon name="gold-coin-o" size="20" style="margin-right: 12px;" />
          </template>
        </van-cell>
        <van-cell title="物流轨迹查询" is-link @click="goTo('/home/track')">
          <template #icon>
            <van-icon name="logistics" size="20" style="margin-right: 12px;" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <div class="card">
      <van-cell-group>
        <van-cell title="仓库地址管理" is-link @click="goTo('/home/addresses')">
          <template #icon>
            <van-icon name="location-o" size="20" style="margin-right: 12px;" />
          </template>
        </van-cell>
        <van-cell title="我的仓库" is-link @click="goTo('/home/my-warehouses')">
          <template #icon>
            <van-icon name="shop-o" size="20" style="margin-right: 12px;" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <div class="card">
      <van-cell-group>
        <van-cell title="联系客服" is-link @click="contactService">
          <template #icon>
            <van-icon name="service-o" size="20" style="margin-right: 12px;" />
          </template>
        </van-cell>
        <van-cell title="系统设置" is-link @click="goTo('/home/settings')">
          <template #icon>
            <van-icon name="setting-o" size="20" style="margin-right: 12px;" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 退出登录 -->
    <div class="logout-btn">
      <van-button round block type="default" @click="logout">
        退出登录
      </van-button>
    </div>

    <!-- 充值弹窗 -->
    <van-popup v-model:show="showRecharge" position="bottom" round>
      <div class="recharge-popup">
        <div class="recharge-title">账户充值</div>
        <van-form @submit="onRecharge">
          <van-cell-group inset>
            <van-field v-model="rechargeForm.amount" type="digit" label="充值金额" placeholder="请输入充值金额" :rules="[{ required: true, message: '请输入充值金额' }]" />
            <van-field v-model="rechargeForm.remark" label="备注" placeholder="选填" />
          </van-cell-group>
          <div class="recharge-methods">
            <div class="method-title">支付方式</div>
            <van-radio-group v-model="rechargeForm.method">
              <van-cell-group>
                <van-cell clickable @click="rechargeForm.method = '支付宝'">
                  <template #title><span>支付宝</span></template>
                  <template #right-icon><van-radio name="支付宝" /></template>
                </van-cell>
                <van-cell clickable @click="rechargeForm.method = '微信支付'">
                  <template #title><span>微信支付</span></template>
                  <template #right-icon><van-radio name="微信支付" /></template>
                </van-cell>
                <van-cell clickable @click="rechargeForm.method = 'PayPal'">
                  <template #title><span>PayPal</span></template>
                  <template #right-icon><van-radio name="PayPal" /></template>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </div>
          <div class="recharge-btn">
            <van-button round block type="primary" native-type="submit">
              确认充值
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getMessages, createRecharge } from '../api'
import { Dialog, Toast } from 'vant'

const router = useRouter()

const userInfo = JSON.parse(localStorage.getItem('user') || '{}')
const showRecharge = ref(false)
const rechargeForm = ref({
  amount: '',
  remark: '',
  method: '支付宝'
})
const messages = ref([])
const unreadCount = ref(0)

onMounted(async () => {
  await loadMessages()
})

const loadMessages = async () => {
  try {
    const res = await getMessages({ merchantId: userInfo.id })
    messages.value = res.data
    unreadCount.value = messages.value.filter(m => m.status === 'unread').length
  } catch (e) {
    console.error(e)
  }
}

const goTo = (path) => {
  Toast('功能开发中')
}

const contactService = () => {
  Toast('联系客服: 400-888-8888')
}

const logout = () => {
  Dialog.confirm({
    title: '提示',
    message: '确定要退出登录吗？'
  }).then(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.replace('/login')
  }).catch(() => {})
}

const onRecharge = async () => {
  try {
    await createRecharge({
      merchantId: userInfo.id,
      amount: parseFloat(rechargeForm.value.amount),
      method: rechargeForm.value.method,
      remark: rechargeForm.value.remark
    })
    Toast('充值成功')
    showRecharge.value = false
    rechargeForm.value.amount = ''
    rechargeForm.value.remark = ''
  } catch (e) {
    console.error(e)
  }
}
</script>

<style scoped>
.user-card {
  background: linear-gradient(135deg, #1989fa 0%, #07c160 100%);
  padding: 24px;
  display: flex;
  align-items: center;
  color: #fff;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.user-info {
  flex: 1;
}

.user-info h3 {
  font-size: 18px;
  margin-bottom: 4px;
}

.user-info p {
  font-size: 14px;
  opacity: 0.8;
}

.balance-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.balance-label {
  font-size: 14px;
  color: #969799;
  margin-bottom: 8px;
}

.balance-value {
  font-size: 28px;
  font-weight: 600;
  color: #ff6034;
}

.logout-btn {
  padding: 24px;
  margin-bottom: 40px;
}

.recharge-popup {
  padding: 16px;
}

.recharge-title {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
}

.recharge-methods {
  margin: 16px 0;
}

.method-title {
  font-size: 14px;
  color: #969799;
  margin-bottom: 8px;
}

.recharge-btn {
  margin-top: 16px;
}
</style>
