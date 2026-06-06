<template>
  <div>
    <el-card shadow="hover">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-weight: bold">Products Management</span>
          <el-button type="primary" @click="showDialog()"><el-icon><Plus /></el-icon> Add Product</el-button>
        </div>
      </template>
      <el-table :data="products" stripe v-loading="loading" border>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column label="Image" width="80">
          <template #default="{ row }">
            <el-image :src="row.image" style="width: 50px; height: 50px" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Name" min-width="120" />
        <el-table-column label="Category" width="100">
          <template #default="{ row }">{{ getCategoryName(row.categoryId) }}</template>
        </el-table-column>
        <el-table-column prop="basePrice" label="Price" width="80">
          <template #default="{ row }">¥{{ row.basePrice }}</template>
        </el-table-column>
        <el-table-column prop="monthlySales" label="Sales" width="80" />
        <el-table-column label="Status" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">{{ row.status === 1 ? 'Active' : 'Inactive' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Recommended" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isRecommended === 1 ? 'warning' : 'info'" size="small">{{ row.isRecommended === 1 ? 'Yes' : 'No' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="160" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="showDialog(row)">Edit</el-button>
            <el-popconfirm title="Delete this product?" @confirm="deleteProduct(row.id)">
              <template #reference><el-button size="small" type="danger" link>Delete</el-button></template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-model="dialogVisible" :title="editingProduct ? 'Edit Product' : 'Add Product'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="Name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="Category">
          <el-select v-model="form.category_id" style="width: 100%">
            <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Price"><el-input-number v-model="form.base_price" :min="0" :precision="2" /></el-form-item>
        <el-form-item label="Image"><el-input v-model="form.image" placeholder="Image URL" /></el-form-item>
        <el-form-item label="Description"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="Status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="Recommend">
          <el-switch v-model="form.is_recommended" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveProduct">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '../api'
import { ElMessage } from 'element-plus'

const products = ref([])
const categories = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const editingProduct = ref(null)
const form = ref({ name: '', category_id: 1, base_price: 0, image: '', description: '', status: 1, is_recommended: 0 })

function getCategoryName(id) { const c = categories.value.find(x => x.id === id); return c ? c.name : id }

function showDialog(product) {
  if (product) {
    editingProduct.value = product
    form.value = { name: product.name, category_id: product.categoryId, base_price: product.basePrice, image: product.image, description: product.description, status: product.status, is_recommended: product.isRecommended }
  } else {
    editingProduct.value = null
    form.value = { name: '', category_id: 1, base_price: 0, image: '', description: '', status: 1, is_recommended: 0 }
  }
  dialogVisible.value = true
}

async function saveProduct() {
  try {
    if (editingProduct.value) {
      await adminApi.updateProduct(editingProduct.value.id, form.value)
    } else {
      await adminApi.createProduct(form.value)
    }
    ElMessage.success('Saved')
    dialogVisible.value = false
    loadData()
  } catch (e) { ElMessage.error(e.response?.data?.message || 'Error') }
}

async function deleteProduct(id) {
  try {
    await adminApi.deleteProduct(id)
    ElMessage.success('Deleted')
    loadData()
  } catch (e) { ElMessage.error('Error') }
}

async function loadData() {
  loading.value = true
  try {
    const [pRes, cRes] = await Promise.all([adminApi.getProducts(), adminApi.getCategories()])
    products.value = pRes.data.data
    categories.value = cRes.data.data
  } catch (e) { console.error(e) }
  loading.value = false
}

onMounted(loadData)
</script>
