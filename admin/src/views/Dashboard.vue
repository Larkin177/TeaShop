<template>
  <div>
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="6" v-for="card in cards" :key="card.key">
        <el-card shadow="hover">
          <div style="display: flex; align-items: center; justify-content: space-between">
            <div>
              <div style="font-size: 14px; color: #909399">{{ t(card.key) }}</div>
              <div style="font-size: 28px; font-weight: bold; color: #303133; margin-top: 8px">{{ card.value }}</div>
            </div>
            <el-icon :size="48" :color="card.color"><component :is="card.icon" /></el-icon>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span style="font-weight: bold">{{ t('recentOrders') }}</span></template>
          <el-table :data="recentOrders" stripe size="small" max-height="350">
            <el-table-column prop="order_no" :label="t('orderNo')" width="180" />
            <el-table-column prop="store_name" :label="t('store')" />
            <el-table-column prop="pay_amount" :label="t('amount')">
              <template #default="{ row }"><span style="color: #e64340; font-weight: bold">\u00A5{{ row.pay_amount }}</span></template>
            </el-table-column>
            <el-table-column prop="status" :label="t('status')">
              <template #default="{ row }"><el-tag :type="statusType(row.status)" size="small">{{ statusText(row.status) }}</el-tag></template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span style="font-weight: bold">{{ t('topProducts') }}</span></template>
          <el-table :data="topProducts" stripe size="small" max-height="350">
            <el-table-column prop="name" :label="t('name')" />
            <el-table-column prop="base_price" :label="t('price')"><template #default="{ row }">\u00A5{{ row.base_price }}</template></el-table-column>
            <el-table-column prop="monthly_sales" :label="t('sales')" />
            <el-table-column prop="status" :label="t('status')">
              <template #default="{ row }"><el-tag :type="row.status===1?'success':'info'" size="small">{{ row.status===1?t('active'):t('inactive') }}</el-tag></template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { adminApi } from '../api'
import { useLang } from '../i18n'
const { t } = useLang()
const stats = ref({}), recentOrders = ref([]), topProducts = ref([])
const cards = computed(() => [
  { key: 'totalProducts', value: stats.value.totalProducts || 0, icon: 'Goods', color: '#409eff' },
  { key: 'totalOrders', value: stats.value.totalOrders || 0, icon: 'Document', color: '#67c23a' },
  { key: 'totalUsers', value: stats.value.totalUsers || 0, icon: 'User', color: '#e6a23c' },
  { key: 'revenue', value: '\u00A5' + (stats.value.totalRevenue || 0), icon: 'Money', color: '#f56c6c' },
])
function statusText(s) { return [t('pending'),t('paid'),t('preparing'),t('delivering'),t('completed'),t('cancelled')][s] || '?' }
function statusType(s) { return ['warning','primary','info','','success','danger'][s] || 'info' }
onMounted(async () => {
  try {
    const [d, o, p] = await Promise.all([adminApi.getDashboard(), adminApi.getOrders(), adminApi.getProducts()])
    stats.value = d.data.data; recentOrders.value = (o.data.data || []).slice(0, 10)
    topProducts.value = (p.data.data || []).sort((a,b) => (b.monthly_sales||0)-(a.monthly_sales||0)).slice(0, 10)
  } catch (e) { console.error(e) }
})
</script>