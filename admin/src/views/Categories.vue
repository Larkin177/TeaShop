<template>
  <el-card shadow="hover">
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-weight:bold">{{ t('categoriesTitle') }}</span>
        <el-button type="primary" @click="showDialog()"><el-icon><Plus /></el-icon> {{ t('add') }}</el-button>
      </div>
    </template>
    <el-table :data="categories" stripe border v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" :label="t('name')" />
      <el-table-column :label="t('icon')" width="80"><template #default="{row}"><el-image :src="row.icon" style="width:40px;height:40px" fit="cover" /></template></el-table-column>
      <el-table-column prop="sortOrder" :label="t('sort')" width="80" />
      <el-table-column :label="t('actions')" width="140">
        <template #default="{row}"><el-button size="small" type="primary" link @click="showDialog(row)">{{ t('edit') }}</el-button><el-popconfirm :title="t('confirmDelete')" @confirm="del(row.id)"><template #reference><el-button size="small" type="danger" link>{{ t('delete') }}</el-button></template></el-popconfirm></template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dlg" :title="edt?t('editCategory'):t('addCategory')" width="400px">
      <el-form :model="f" label-width="60px">
        <el-form-item :label="t('name')"><el-input v-model="f.name" /></el-form-item>
        <el-form-item :label="t('icon')"><el-input v-model="f.icon" placeholder="URL" /></el-form-item>
        <el-form-item :label="t('sort')"><el-input-number v-model="f.sort_order" :min="0" /></el-form-item>
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
const categories = ref([]), loading = ref(false), dlg = ref(false), edt = ref(null)
const f = ref({ name:'', icon:'', sort_order:0 })
function showDialog(c) { edt.value=c; f.value=c?{name:c.name,icon:c.icon,sort_order:c.sortOrder}:{name:'',icon:'',sort_order:0}; dlg.value=true }
async function save() { try { edt.value?await adminApi.updateCategory(edt.value.id,f.value):await adminApi.createCategory(f.value); ElMessage.success(t('success')); dlg.value=false; load() } catch(e){ElMessage.error(t('error'))} }
async function del(id) { await adminApi.deleteCategory(id); ElMessage.success(t('success')); load() }
async function load() { loading.value=true; try { categories.value=(await adminApi.getCategories()).data.data } catch(e){} loading.value=false }
onMounted(load)
</script>