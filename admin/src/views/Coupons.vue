<template>
  <el-card shadow="hover">
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-weight:bold">{{ t('couponsTitle') }}</span>
        <el-button type="primary" @click="dlg=true"><el-icon><Plus /></el-icon> {{ t('addCoupon') }}</el-button>
      </div>
    </template>
    <el-table :data="coupons" stripe border v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" :label="t('name')" />
      <el-table-column :label="t('type')" width="100"><template #default="{row}">{{ row.type==='full_reduction'?t('fullReduction'):row.type==='discount'?t('discount'):t('freeItem') }}</template></el-table-column>
      <el-table-column prop="value" :label="t('value')" width="80" />
      <el-table-column prop="minAmount" :label="t('minAmount')" width="100" />
      <el-table-column prop="totalCount" :label="t('total')" width="80" />
      <el-table-column prop="usedCount" :label="t('used')" width="80" />
      <el-table-column prop="description" :label="t('couponDesc')" />
      <el-table-column :label="t('actions')" width="80">
        <template #default="{row}"><el-popconfirm :title="t('confirmDelete')" @confirm="del(row.id)"><template #reference><el-button size="small" type="danger" link>{{ t('delete') }}</el-button></template></el-popconfirm></template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dlg" :title="t('addCoupon')" width="450px">
      <el-form :model="f" label-width="90px">
        <el-form-item :label="t('name')"><el-input v-model="f.name" /></el-form-item>
        <el-form-item :label="t('type')"><el-select v-model="f.type" style="width:100%"><el-option :label="t('fullReduction')" value="full_reduction" /><el-option :label="t('discount')" value="discount" /><el-option :label="t('freeItem')" value="free_item" /></el-select></el-form-item>
        <el-form-item :label="t('value')"><el-input-number v-model="f.value" :min="0" :precision="2" /></el-form-item>
        <el-form-item :label="t('minAmount')"><el-input-number v-model="f.min_amount" :min="0" :precision="2" /></el-form-item>
        <el-form-item :label="t('total')"><el-input-number v-model="f.total_count" :min="1" /></el-form-item>
        <el-form-item :label="t('couponDesc')"><el-input v-model="f.description" type="textarea" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dlg=false">{{ t('cancel') }}</el-button><el-button type="primary" @click="save">{{ t('save') }}</el-button></template>
    </el-dialog>
  </el-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '../api'
import { ElMessage } from 'element-plus'
import { useLang } from '../i18n'
const { t } = useLang()
const coupons = ref([]), loading = ref(false), dlg = ref(false)
const f = ref({ name:'', type:'full_reduction', value:0, min_amount:0, total_count:100, description:'' })
async function save() { try { await adminApi.createCoupon(f.value); ElMessage.success(t('success')); dlg.value=false; load() } catch(e){ElMessage.error(t('error'))} }
async function del(id) { await adminApi.deleteCoupon(id); ElMessage.success(t('success')); load() }
async function load() { loading.value=true; try { coupons.value=(await adminApi.getCoupons()).data.data } catch(e){} loading.value=false }
onMounted(load)
</script>