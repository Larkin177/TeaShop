<template>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
    <el-card style="width: 400px" shadow="always">
      <template #header>
        <div style="text-align: center">
          <h2 style="margin: 0; color: #303133">{{ t('loginTitle') }}</h2>
          <p style="color: #909399; margin: 8px 0 0">{{ t('loginSub') }}</p>
        </div>
      </template>
      <el-form @submit.prevent="handleLogin">
        <el-form-item><el-input v-model="form.username" :placeholder="t('username')" prefix-icon="User" size="large" /></el-form-item>
        <el-form-item><el-input v-model="form.password" type="password" :placeholder="t('password')" prefix-icon="Lock" size="large" show-password /></el-form-item>
        <el-button type="primary" size="large" style="width: 100%" @click="handleLogin">{{ t('loginBtn') }}</el-button>
      </el-form>
    </el-card>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useLang } from '../i18n'
const { t } = useLang()
const router = useRouter()
const form = reactive({ username: 'admin', password: 'admin' })
function handleLogin() {
  if (form.username === 'admin' && form.password === 'admin') {
    ElMessage.success(t('loginSuccess')); router.push('/dashboard')
  } else { ElMessage.error(t('loginFail')) }
}
</script>