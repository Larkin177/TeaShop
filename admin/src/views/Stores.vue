<template>
  <el-card shadow="hover">
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-weight:bold">{{ t('storesTitle') }}</span>
        <el-button type="primary" @click="showDialog()"><el-icon><Plus /></el-icon> {{ t('add') }}</el-button>
      </div>
    </template>
    <el-table :data="stores" stripe border v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" :label="t('name')" />
      <el-table-column prop="address" :label="t('address')" />
      <el-table-column prop="phone" :label="t('phone')" width="130" />
      <el-table-column prop="businessHours" :label="t('hours')" width="120" />
      <el-table-column :label="t('status')" width="80"><template #default="{row}"><el-tag :type="row.status===1?'success':'info'" size="small">{{ row.status===1?t('open'):t('closed') }}</el-tag></template></el-table-column>
      <el-table-column :label="t('actions')" width="140">
        <template #default="{row}"><el-button size="small" type="primary" link @click="showDialog(row)">{{ t('edit') }}</el-button><el-popconfirm :title="t('confirmDelete')" @confirm="del(row.id)"><template #reference><el-button size="small" type="danger" link>{{ t('delete') }}</el-button></template></el-popconfirm></template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dlg" :title="edt?t('editStore'):t('addStore')" width="500px">
      <el-form :model="f" label-width="80px">
        <el-form-item :label="t('name')"><el-input v-model="f.name" /></el-form-item>
        <el-form-item :label="t('address')"><el-input v-model="f.address" /></el-form-item>
        <el-form-item :label="t('phone')"><el-input v-model="f.phone" /></el-form-item>
        <el-form-item :label="t('hours')"><el-input v-model="f.business_hours" /></el-form-item>
        <el-form-item :label="t('status')"><el-switch v-model="f.status" :active-value="1" :inactive-value="0" /></el-form-item>
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
const stores = ref([]), loading = ref(false), dlg = ref(false), edt = ref(null)
const f = ref({ name:'', address:'', phone:'', business_hours:'09:00-22:00', status:1 })
function showDialog(s) { edt.value=s; f.value=s?{name:s.name,address:s.address,phone:s.phone,business_hours:s.businessHours,status:s.status}:{name:'',address:'',phone:'',business_hours:'09:00-22:00',status:1}; dlg.value=true }
async function save() { try { edt.value?await adminApi.updateStore(edt.value.id,f.value):await adminApi.createStore(f.value); ElMessage.success(t('success')); dlg.value=false; load() } catch(e){ElMessage.error(t('error'))} }
async function del(id) { await adminApi.deleteStore(id); ElMessage.success(t('success')); load() }
async function load() { loading.value=true; try { stores.value=(await adminApi.getStores()).data.data } catch(e){} loading.value=false }
onMounted(load)
</script>