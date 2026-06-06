<template>
  <el-card shadow="hover">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span style="font-weight: bold">Categories</span>
        <el-button type="primary" @click="showDialog()"><el-icon><Plus /></el-icon> Add</el-button>
      </div>
    </template>
    <el-table :data="categories" stripe border v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="Name" />
      <el-table-column label="Icon" width="80"><template #default="{ row }"><el-image :src="row.icon" style="40px" fit="cover" /></template></el-table-column>
      <el-table-column prop="sortOrder" label="Sort" width="80" />
      <el-table-column label="Actions" width="140">
        <template #default="{ row }">
          <el-button size="small" type="primary" link @click="showDialog(row)">Edit</el-button>
          <el-popconfirm title="Delete?" @confirm="del(row.id)"><template #reference><el-button size="small" type="danger" link>Delete</el-button></template></el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dlg" :title="editing ? 'Edit' : 'Add'" width="400px">
      <el-form :model="form" label-width="60px">
        <el-form-item label="Name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="Icon"><el-input v-model="form.icon" placeholder="URL" /></el-form-item>
        <el-form-item label="Sort"><el-input-number v-model="form.sort_order" :min="0" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dlg=false">Cancel</el-button><el-button type="primary" @click="save">Save</el-button></template>
    </el-dialog>
  </el-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '../api'
import { ElMessage } from 'element-plus'
const categories = ref([]), loading = ref(false), dlg = ref(false), editing = ref(null)
const form = ref({ name: '', icon: '', sort_order: 0 })
function showDialog(c) { editing.value = c; form.value = c ? { name: c.name, icon: c.icon, sort_order: c.sortOrder } : { name: '', icon: '', sort_order: 0 }; dlg.value = true }
async function save() {
  try { editing.value ? await adminApi.updateCategory(editing.value.id, form.value) : await adminApi.createCategory(form.value); ElMessage.success('OK'); dlg.value = false; load() } catch (e) { ElMessage.error('Error') }
}
async function del(id) { await adminApi.deleteCategory(id); ElMessage.success('Deleted'); load() }
async function load() { loading.value = true; try { categories.value = (await adminApi.getCategories()).data.data } catch (e) {} loading.value = false }
onMounted(load)
</script>
