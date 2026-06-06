<template>
  <el-card shadow="hover">
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-weight:bold">{{ t('ordersTitle') }}</span>
        <el-radio-group v-model="filter" @change="load">
          <el-radio-button label="">{{ t('all') }}</el-radio-button>
          <el-radio-button :label="0">{{ t('pending') }}</el-radio-button>
          <el-radio-button :label="1">{{ t('paid') }}</el-radio-button>
          <el-radio-button :label="4">{{ t('completed') }}</el-radio-button>
        </el-radio-group>
      </div>
    </template>
    <el-table :data="orders" stripe border v-loading="loading">
      <el-table-column prop="order_no" :label="t('orderNo')" width="180" />
      <el-table-column prop="user_nickname" :label="t('customer')" width="100" />
      <el-table-column prop="user_phone" :label="t('phone')" width="120" />
      <el-table-column prop="store_name" :label="t('store')" />
      <el-table-column prop="pay_amount" :label="t('amount')" width="80"><template #default="{row}"><span style="color:#e64340;font-weight:bold">\u00A5{{ row.pay_amount }}</span></template></el-table-column>
      <el-table-column :label="t('status')" width="100"><template #default="{row}"><el-tag :type="st(row.status)" size="small">{{ stxt(row.status) }}</el-tag></template></el-table-column>
      <el-table-column prop="remark" :label="t('remark')" />
      <el-table-column prop="created_at" :label="t('created')" width="160" />
      <el-table-column :label="t('actions')" width="120" fixed="right">
        <template #default="{row}">
          <el-dropdown v-if="row.status<4" @command="(c)=>upd(row.id,c)">
            <el-button size="small" type="primary" link>{{ t('updateStatus') }} <el-icon><ArrowDown /></el-icon></el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="row.status===0" :command="1">{{ t('markPaid') }}</el-dropdown-item>
                <el-dropdown-item v-if="row.status<=1" :command="2">{{ t('preparing') }}</el-dropdown-item>
                <el-dropdown-item v-if="row.status<=2" :command="3">{{ t('delivering') }}</el-dropdown-item>
                <el-dropdown-item :command="4">{{ t('markComplete') }}</el-dropdown-item>
                <el-dropdown-item :command="5" divided>{{ t('markCancel') }}</el-dropdown-item>
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
import { useLang } from '../i18n'
const { t } = useLang()
const orders = ref([]), loading = ref(false), filter = ref('')
function stxt(s) { return [t('pending'),t('paid'),t('preparing'),t('delivering'),t('completed'),t('cancelled')][s]||'?' }
function st(s) { return ['warning','primary','info','','success','danger'][s]||'info' }
async function upd(id,s) { try { await adminApi.updateOrderStatus(id,s); ElMessage.success(t('success')); load() } catch(e){ElMessage.error(t('error'))} }
async function load() { loading.value=true; try { orders.value=(await adminApi.getOrders(filter.value===''?undefined:filter.value)).data.data } catch(e){} loading.value=false }
onMounted(load)
</script>