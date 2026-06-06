<template>
  <el-card shadow="hover">
    <template #header><span style="font-weight: bold">Users</span></template>
    <el-table :data="users" stripe border v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="nickname" label="Nickname" />
      <el-table-column prop="phone" label="Phone" />
      <el-table-column prop="points" label="Points" width="80" />
      <el-table-column prop="membership_level" label="Level" width="80" />
      <el-table-column prop="created_at" label="Registered" width="160" />
    </el-table>
  </el-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '../api'
const users = ref([]), loading = ref(false)
onMounted(async () => {
  loading.value = true
  try { users.value = (await adminApi.getUsers()).data.data } catch (e) {}
  loading.value = false
})
</script>
