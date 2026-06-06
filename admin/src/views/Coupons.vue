<template>
  <el-card shadow="hover">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span style="font-weight: bold">Coupons</span>
        <el-button type="primary" @click="showDialog()"><el-icon><Plus /></el-icon> Add</el-button>
      </div>
    </template>
    <el-table :data="coupons" stripe border v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="type" label="Type" width="120" />
      <el-table-column prop="value" label="Value" width="80" />
      <el-table-column prop="minAmount" label="Min Amount" width="100" />
      <el-table-column prop="totalCount" label="Total" width="80" />
      <el-table-column prop="usedCount" label="Used" width="80" />
      <el-table-column prop="description" label="Description" />
      <el-table-column label="Actions" width="80">
        <template #default="{ row }">
          <el-popconfirm title="Delete?" @confirm="del(row.id)"><template #reference><el-button size="small" type="danger" link>Delete</el-button></template></el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dlg" title="Add Coupon" width="450px">
      <el-form :model="form" label-width="90px">
        <el-form-item label="Name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="Type">
          <el-select v-model="form.type" style="width:100%">
            <el-option label="Full Reduction" value="full_reduction" />
            <el-option label="Discount" value="discount" />
            <el-option label="Free Item" value="free_item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Value"><el-input-number v-model="form.value" :min="0" :precision="2" /></el-form-item>
        <el-form-item label="Min Amount"><el-input-number v-model="form.min_amount" :min="0" :precision="2" /></el-form-item>
        <el-form-item label="Total"><el-input-number v-model="form.total_count" :min="1" /></el-form-item>
        <el-form-item label="Description"><el-input v-model="form.description" type="textarea" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dlg=false">Cancel</el-button><el-button type="primary" @click="save">Save</el-button></template>
    </el-dialog>
  </el-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '../api'
import { ElMessage } from 'element-plus'
const coupons = ref([]), loading = ref(false), dlg = ref(false)
const form = ref({ name: '', type: 'full_reduction', value: 0, min_amount: 0, total_count: 100, description: '' })
function showDialog() { form.value = { name: '', type: 'full_reduction', value: 0, min_amount: 0, total_count: 100, description: '' }; dlg.value = true }
async function save() { try { await adminApi.createCoupon(form.value); ElMessage.success('Created'); dlg.value = false; load() } catch (e) { ElMessage.error('Error') } }
async function del(id) { await adminApi.deleteCoupon(id); ElMessage.success('Deleted'); load() }
async function load() { loading.value = true; try { coupons.value = (await adminApi.getCoupons()).data.data } catch (e) {} loading.value = false }
onMounted(load)
</script>
