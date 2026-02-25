<template>
  <div class="fee-config">
    <el-card>
      <template #header>
        <span>价格体系配置</span>
      </template>
      
      <el-form :model="form" label-width="120px">
        <el-divider content-position="left">入库费用</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="计费方式">
              <el-select v-model="form.inboundFee.type" style="width: 100%;">
                <el-option label="按件计费" value="per_item" />
                <el-option label="按重量计费" value="per_weight" />
                <el-option label="按体积计费" value="per_volume" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单价">
              <el-input-number v-model="form.inboundFee.price" :min="0" :precision="2" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-divider content-position="left">出库费用</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="计费方式">
              <el-select v-model="form.outboundFee.type" style="width: 100%;">
                <el-option label="按件计费" value="per_item" />
                <el-option label="按重量计费" value="per_weight" />
                <el-option label="按体积计费" value="per_volume" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单价">
              <el-input-number v-model="form.outboundFee.price" :min="0" :precision="2" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-divider content-position="left">仓储费用</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="计费方式">
              <el-select v-model="form.storageFee.type" style="width: 100%;">
                <el-option label="按件/天" value="per_day_per_item" />
                <el-option label="按重量/天" value="per_day_per_weight" />
                <el-option label="按体积/天" value="per_day_per_volume" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单价/天">
              <el-input-number v-model="form.storageFee.price" :min="0" :precision="2" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-divider content-position="left">本地派送费用</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="起步价">
              <el-input-number v-model="form.deliveryFee.basePrice" :min="0" :precision="2" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="续重单价">
              <el-input-number v-model="form.deliveryFee.perKg" :min="0" :precision="2" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位">
              <el-input v-model="form.deliveryFee.unit" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-divider content-position="left">增值服务费用</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="加固包装">
              <el-input-number v-model="form.extraService.packaging" :min="0" :precision="2" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="拍照服务">
              <el-input-number v-model="form.extraService.photo" :min="0" :precision="2" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item>
          <el-button type="primary" @click="onSave">保存配置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFeeConfig } from '../api'
import { ElMessage } from 'element-plus'

const form = ref({
  inboundFee: { type: 'per_item', price: 2 },
  outboundFee: { type: 'per_item', price: 3 },
  storageFee: { type: 'per_day_per_item', price: 0.5 },
  deliveryFee: { basePrice: 10, perKg: 5, unit: 'kg' },
  extraService: { packaging: 5, photo: 2 }
})

const loadData = async () => {
  try {
    const res = await getFeeConfig()
    form.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const onSave = () => {
  ElMessage.success('配置保存成功')
}

onMounted(() => {
  loadData()
})
</script>
