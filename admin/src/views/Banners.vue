<template>
  <el-card shadow="hover">
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-weight:bold">{{ t('bannersTitle') }}</span>
        <el-button type="primary" @click="showDialog()"><el-icon><Plus /></el-icon> {{ t('add') }}</el-button>
      </div>
    </template>
    <el-table :data="banners" stripe border v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column :label="t('image')"><template #default="{row}"><el-image :src="row.image" style="width:200px;height:80px" fit="cover" /></template></el-table-column>
      <el-table-column prop="link" :label="t('link')" />
      <el-table-column prop="sortOrder" :label="t('sort')" width="80" />
      <el-table-column :label="t('status')" width="80"><template #default="{row}"><el-tag :type="row.status===1?'success':'info'" size="small">{{ row.status===1?t('active'):t('inactive') }}</el-tag></template></el-table-column>
      <el-table-column :label="t('actions')" width="140">
        <template #default="{row}"><el-button size="small" type="primary" link @click="showDialog(row)">{{ t('edit') }}</el-button><el-popconfirm :title="t('confirmDelete')" @confirm="del(row.id)"><template #reference><el-button size="small" type="danger" link>{{ t('delete') }}</el-button></template></el-popconfirm></template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dlg" :title="edt?t('editBanner'):t('addBanner')" width="500px">
      <el-form :model="f" label-width="60px">
        <el-form-item :label="t('image')"><el-input v-model="f.image" placeholder="URL" /></el-form-item>
        <el-form-item :label="t('link')"><el-input v-model="f.link" /></el-form-item>
        <el-form-item :label="t('sort')"><el-input-number v-model="f.sort_order" :min="0" /></el-form-item>
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
const banners = ref([]), loading = ref(false), dlg = ref(false), edt = ref(null)
const f = ref({ image:'', link:'', sort_order:0, status:1 })
function showDialog(b) { edt.value=b; f.value=b?{image:b.image,link:b.link,sort_order:b.sortOrder,status:b.status}:{image:'',link:'',sort_order:0,status:1}; dlg.value=true }
async function save() { try { edt.value?await adminApi.updateBanner(edt.value.id,f.value):await adminApi.createBanner(f.value); ElMessage.success(t('success')); dlg.value=false; load() } catch(e){ElMessage.error(t('error'))} }
async function del(id) { await adminApi.deleteBanner(id); ElMessage.success(t('success')); load() }
async function load() { loading.value=true; try { banners.value=(await adminApi.getBanners()).data.data } catch(e){} loading.value=false }
onMounted(load)
</script>