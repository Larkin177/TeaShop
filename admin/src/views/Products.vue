<template>
  <el-card shadow="hover">
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-weight:bold">{{ t('productsTitle') }}</span>
        <el-button type="primary" @click="showDialog()"><el-icon><Plus /></el-icon> {{ t('addProduct') }}</el-button>
      </div>
    </template>
    <el-table :data="products" stripe border v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column :label="t('image')" width="80"><template #default="{row}"><el-image :src="row.image" style="width:50px;height:50px" fit="cover" /></template></el-table-column>
      <el-table-column prop="name" :label="t('name')" min-width="120" />
      <el-table-column :label="t('category')" width="100"><template #default="{row}">{{ catName(row.categoryId) }}</template></el-table-column>
      <el-table-column prop="basePrice" :label="t('price')" width="80"><template #default="{row}">\u00A5{{ row.basePrice }}</template></el-table-column>
      <el-table-column prop="monthlySales" :label="t('sales')" width="80" />
      <el-table-column :label="t('status')" width="80"><template #default="{row}"><el-tag :type="row.status===1?'success':'info'" size="small">{{ row.status===1?t('active'):t('inactive') }}</el-tag></template></el-table-column>
      <el-table-column :label="t('recommend')" width="80"><template #default="{row}"><el-tag :type="row.isRecommended===1?'warning':'info'" size="small">{{ row.isRecommended===1?t('active'):t('inactive') }}</el-tag></template></el-table-column>
      <el-table-column :label="t('actions')" width="160" fixed="right">
        <template #default="{row}">
          <el-button size="small" type="primary" link @click="showDialog(row)">{{ t('edit') }}</el-button>
          <el-popconfirm :title="t('confirmDelete')" @confirm="del(row.id)"><template #reference><el-button size="small" type="danger" link>{{ t('delete') }}</el-button></template></el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dlg" :title="edt?t('editProduct'):t('addProduct')" width="500px">
      <el-form :model="f" label-width="80px">
        <el-form-item :label="t('name')"><el-input v-model="f.name" /></el-form-item>
        <el-form-item :label="t('category')"><el-select v-model="f.category_id" style="width:100%"><el-option v-for="c in cats" :key="c.id" :label="c.name" :value="c.id" /></el-select></el-form-item>
        <el-form-item :label="t('price')"><el-input-number v-model="f.base_price" :min="0" :precision="2" /></el-form-item>
        <el-form-item :label="t('image')"><el-input v-model="f.image" placeholder="URL" /></el-form-item>
        <el-form-item :label="t('description')"><el-input v-model="f.description" type="textarea" :rows="3" /></el-form-item>
        <el-form-item :label="t('status')"><el-switch v-model="f.status" :active-value="1" :inactive-value="0" /></el-form-item>
        <el-form-item :label="t('recommend')"><el-switch v-model="f.is_recommended" :active-value="1" :inactive-value="0" /></el-form-item>
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
const products = ref([]), cats = ref([]), loading = ref(false), dlg = ref(false), edt = ref(null)
const f = ref({ name:'', category_id:1, base_price:0, image:'', description:'', status:1, is_recommended:0 })
function catName(id) { const c = cats.value.find(x=>x.id===id); return c?c.name:id }
function showDialog(p) { edt.value=p; f.value=p?{name:p.name,category_id:p.categoryId,base_price:p.basePrice,image:p.image,description:p.description,status:p.status,is_recommended:p.isRecommended}:{name:'',category_id:1,base_price:0,image:'',description:'',status:1,is_recommended:0}; dlg.value=true }
async function save() { try { edt.value?await adminApi.updateProduct(edt.value.id,f.value):await adminApi.createProduct(f.value); ElMessage.success(t('success')); dlg.value=false; load() } catch(e){ElMessage.error(t('error'))} }
async function del(id) { await adminApi.deleteProduct(id); ElMessage.success(t('success')); load() }
async function load() { loading.value=true; try { const [p,c]=await Promise.all([adminApi.getProducts(),adminApi.getCategories()]); products.value=p.data.data; cats.value=c.data.data } catch(e){} loading.value=false }
onMounted(load)
</script>