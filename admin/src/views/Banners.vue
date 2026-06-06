<template>
  <el-card shadow="hover">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span style="font-weight: bold">Banners</span>
        <el-button type="primary" @click="showDialog()"><el-icon><Plus /></el-icon> Add</el-button>
      </div>
    </template>
    <el-table :data="banners" stripe border v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column label="Image"><template #default="{ row }"><el-image :src="row.image" style="width: 200px; height: 80px" fit="cover" /></template></el-table-column>
      <el-table-column prop="link" label="Link" />
      <el-table-column prop="sortOrder" label="Sort" width="80" />
      <el-table-column label="Status" width="80"><template #default="{ row }"><el-tag :type="row.status===1?'success':'info'" size="small">{{ row.status===1?'Active':'Inactive' }}</el-tag></template></el-table-column>
      <el-table-column label="Actions" width="140">
        <template #default="{ row }">
          <el-button size="small" type="primary" link @click="showDialog(row)">Edit</el-button>
          <el-popconfirm title="Delete?" @confirm="del(row.id)"><template #reference><el-button size="small" type="danger" link>Delete</el-button></template></el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dlg" :title="editing?'Edit':'Add'" width="500px">
      <el-form :model="form" label-width="60px">
        <el-form-item label="Image"><el-input v-model="form.image" placeholder="Image URL" /></el-form-item>
        <el-form-item label="Link"><el-input v-model="form.link" /></el-form-item>
        <el-form-item label="Sort"><el-input-number v-model="form.sort_order" :min="0" /></el-form-item>
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
const banners = ref([]), loading = ref(false), dlg = ref(false), editing = ref(null)
const form = ref({ image: '', link: '', sort_order: 0, status: 1 })
function showDialog(b) { editing.value = b; form.value = b ? { image: b.image, link: b.link, sort_order: b.sortOrder, status: b.status } : { image: '', link: '', sort_order: 0, status: 1 }; dlg.value = true }
async function save() { try { editing.value ? await adminApi.updateBanner(editing.value.id, form.value) : await adminApi.createBanner(form.value); ElMessage.success('OK'); dlg.value = false; load() } catch (e) { ElMessage.error('Error') } }
async function del(id) { await adminApi.deleteBanner(id); ElMessage.success('Deleted'); load() }
async function load() { loading.value = true; try { banners.value = (await adminApi.getBanners()).data.data } catch (e) {} loading.value = false }
onMounted(load)
</script>
