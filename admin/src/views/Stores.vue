<template>
  <el-card shadow="hover">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span style="font-weight: bold">Stores</span>
        <el-button type="primary" @click="showDialog()"><el-icon><Plus /></el-icon> Add</el-button>
      </div>
    </template>
    <el-table :data="stores" stripe border v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="address" label="Address" />
      <el-table-column prop="phone" label="Phone" width="130" />
      <el-table-column prop="businessHours" label="Hours" width="120" />
      <el-table-column label="Status" width="80"><template #default="{ row }"><el-tag :type="row.status===1?'success':'info'" size="small">{{ row.status===1?'Open':'Closed' }}</el-tag></template></el-table-column>
      <el-table-column label="Actions" width="140">
        <template #default="{ row }">
          <el-button size="small" type="primary" link @click="showDialog(row)">Edit</el-button>
          <el-popconfirm title="Delete?" @confirm="del(row.id)"><template #reference><el-button size="small" type="danger" link>Delete</el-button></template></el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dlg" :title="editing?'Edit':'Add'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="Name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="Address"><el-input v-model="form.address" /></el-form-item>
        <el-form-item label="Phone"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="Hours"><el-input v-model="form.business_hours" /></el-form-item>
        <el-form-item label="Status"><el-switch v-model="form.status" :active-value="1" :inactive-value="0" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dlg=false">Cancel</el-button><el-button type="primary" @click="save">Save</el-button></template>
    </el-dialog>
  </el-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '../api'
import { ElMessage } from 'element-plus'
const stores = ref([]), loading = ref(false), dlg = ref(false), editing = ref(null)
const form = ref({ name: '', address: '', phone: '', business_hours: '09:00-22:00', status: 1 })
function showDialog(s) { editing.value = s; form.value = s ? { name: s.name, address: s.address, phone: s.phone, business_hours: s.businessHours, status: s.status } : { name: '', address: '', phone: '', business_hours: '09:00-22:00', status: 1 }; dlg.value = true }
async function save() { try { editing.value ? await adminApi.updateStore(editing.value.id, form.value) : await adminApi.createStore(form.value); ElMessage.success('OK'); dlg.value = false; load() } catch (e) { ElMessage.error('Error') } }
async function del(id) { await adminApi.deleteStore(id); ElMessage.success('Deleted'); load() }
async function load() { loading.value = true; try { stores.value = (await adminApi.getStores()).data.data } catch (e) {} loading.value = false }
onMounted(load)
</script>
