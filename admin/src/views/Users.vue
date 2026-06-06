<template>
  <el-card shadow="hover">
    <template #header><span style="font-weight:bold">{{ t('usersTitle') }}</span></template>
    <el-table :data="users" stripe border v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="nickname" :label="t('nickname')" />
      <el-table-column prop="phone" :label="t('phone')" />
      <el-table-column prop="points" :label="t('points')" width="80" />
      <el-table-column prop="membership_level" :label="t('level')" width="80" />
      <el-table-column prop="created_at" :label="t('registered')" width="160" />
    </el-table>
  </el-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '../api'
import { useLang } from '../i18n'
const { t } = useLang()
const users = ref([]), loading = ref(false)
onMounted(async () => { loading.value=true; try { users.value=(await adminApi.getUsers()).data.data } catch(e){} loading.value=false })
</script>