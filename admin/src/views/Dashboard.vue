<template>
  <div>
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="6" v-for="card in cards" :key="card.title">
        <el-card shadow="hover">
          <div style="display: flex; align-items: center; justify-content: space-between">
            <div>
              <div style="font-size: 14px; color: #909399">{{ card.title }}</div>
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
          <template #header><span style="font-weight: bold">Recent Orders</span></template>
          <el-table :data="recentOrders" stripe size="small" max-height="350">
            <el-table-column prop="order_no" label="Order No" width="180" />
            <el-table-column prop="store_name" label="Store" />
            <el-table-column prop="pay_amount" label="Amount">
              <template #default="{ row }"><span style="color: #e64340; font-weight: bold">¥{{ row.pay_amount }}</span></template>
            </el-table-column>
            <el-table-column prop="status" label="Status">
              <template #default="{ row }">
                <el-tag :type="statusType(row.status)" size="small">{{ statusText(row.status) }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span style="font-weight: bold">Top Products</span></template>
          <el-table :data="topProducts" stripe size="small" max-height="350">
            <el-table-column prop="name" label="Product" />
            <el-table-column prop="base_price" label="Price">
              <template #default="{ row }">¥{{ row.base_price }}</template>
            </el-table-column>
            <el-table-column prop="monthly_sales" label="Sales" />
            <el-table-column prop="status" label="Status">
              <template #default="{ row }">
                <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">{{ row.status === 1 ? 'Active' : 'Inactive' }}</el-tag>
              </template>
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

const stats = ref({})
const recentOrders = ref([])
const topProducts = ref([])

const cards = computed(() => [
  { title: 'Total Products', value: stats.value.totalProducts || 0, icon: 'Goods', color: '#409eff' },
  { title: 'Total Orders', value: stats.value.totalOrders || 0, icon: 'Document', color: '#67c23a' },
  { title: 'Total Users', value: stats.value.totalUsers || 0, icon: 'User', color: '#e6a23c' },
  { title: 'Revenue', value: '¥' + (stats.value.totalRevenue || 0), icon: 'Money', color: '#f56c6c' },
])

function statusText(s) { return ['Pending','Paid','Preparing','Delivering','Completed','Cancelled'][s] || 'Unknown' }
function statusType(s) { return ['warning','primary','info','','success','danger'][s] || 'info' }

onMounted(async () => {
  try {
    const [dashRes, ordersRes, productsRes] = await Promise.all([
      adminApi.getDashboard(),
      adminApi.getOrders(),
      adminApi.getProducts()
    ])
    stats.value = dashRes.data.data
    recentOrders.value = (ordersRes.data.data || []).slice(0, 10)
    topProducts.value = (productsRes.data.data || []).sort((a, b) => (b.monthly_sales || 0) - (a.monthly_sales || 0)).slice(0, 10)
  } catch (e) { console.error(e) }
})
</script>
