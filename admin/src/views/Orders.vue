<template>
  <el-card shadow="hover">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span style="font-weight: bold">Orders</span>
        <el-radio-group v-model="statusFilter" @change="load">
          <el-radio-button label="">All</el-radio-button>
          <el-radio-button :label="0">Pending</el-radio-button>
          <el-radio-button :label="1">Paid</el-radio-button>
          <el-radio-button :label="4">Completed</el-radio-button>
        </el-radio-group>
      </div>
    </template>
    <el-table :data="orders" stripe border v-loading="loading">
      <el-table-column prop="order_no" label="Order No" width="180" />
      <el-table-column prop="user_nickname" label="Customer" width="100" />
      <el-table-column prop="user_phone" label="Phone" width="120" />
      <el-table-column prop="store_name" label="Store" />
      <el-table-column prop="pay_amount" label="Amount" width="80"><template #default="{ row }"><span style="color: #e64340; font-weight: bold">¥{{ row.pay_amount }}</span></template></el-table-column>
      <el-table-column label="Status" width="100">
        <template #default="{ row }"><el-tag :type="statusType(row.status)" size="small">{{ statusText(row.status) }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="remark" label="Remark" />
      <el-table-column prop="created_at" label="Created" width="160" />
      <el-table-column label="Actions" width="120" fixed="right">
        <template #default="{ row }">
          <el-dropdown v-if="row.status < 4" @command="(cmd) => updateStatus(row.id, cmd)">
            <el-button size="small" type="primary" link>Update <el-icon><ArrowDown /></el-icon></el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="row.status === 0" :command="1">Mark Paid</el-dropdown-item>
                <el-dropdown-item v-if="row.status <= 1" :command="2">Preparing</el-dropdown-item>
                <el-dropdown-item v-if="row.status <= 2" :command="3">Delivering</el-dropdown-item>
                <el-dropdown-item :command="4">Complete</el-dropdown-item>
                <el-dropdown-item :command="5" divided>Cancel</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '../api'
import { ElMessage } from 'element-plus'
const orders = ref([]), loading = ref(false), statusFilter = ref('')
function statusText(s) { return ['Pending','Paid','Preparing','Delivering','Completed','Cancelled'][s] || '?' }
function statusType(s) { return ['warning','primary','info','','success','danger'][s] || 'info' }
async function updateStatus(id, status) {
  try { await adminApi.updateOrderStatus(id, status); ElMessage.success('Updated'); load() } catch (e) { ElMessage.error('Error') }
}
async function load() {
  loading.value = true
  try { orders.value = (await adminApi.getOrders(statusFilter.value === '' ? undefined : statusFilter.value)).data.data } catch (e) {}
  loading.value = false
}
onMounted(load)
</script>
