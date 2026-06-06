<template>
  <el-container style="height: 100vh">
    <el-aside width="220px" style="background: #304156">
      <div style="height: 60px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px; font-weight: bold; border-bottom: 1px solid #3d4a5a">
        <span style="color: #409eff">Tea</span>Shop
      </div>
      <el-menu :default-active="activeMenu" background-color="#304156" text-color="#bfcbd9" active-text-color="#409eff" router>
        <el-menu-item v-for="m in menuItems" :key="m.path" :index="m.path">
          <el-icon><component :is="m.icon" /></el-icon>
          <span>{{ t(m.label) }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="height: 60px; background: #fff; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 1px 4px rgba(0,0,0,.08); padding: 0 20px">
        <h3 style="margin: 0; color: #333">{{ t(currentLabel) }}</h3>
        <div style="display: flex; align-items: center; gap: 16px">
          <el-button size="small" @click="toggleLang">{{ lang === 'zh' ? 'EN' : '中文' }}</el-button>
          <el-dropdown>
            <span style="cursor: pointer; color: #606266">{{ t('admin') }} <el-icon><ArrowDown /></el-icon></span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logout">{{ t('logout') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main style="background: #f0f2f5; padding: 20px">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLang } from '../i18n'

const { lang, t, toggleLang } = useLang()
const route = useRoute()
const router = useRouter()
const activeMenu = computed(() => route.path)
const currentLabel = computed(() => route.meta.label || 'dashboard')

const menuItems = [
  { path: '/dashboard', icon: 'DataBoard', label: 'dashboard' },
  { path: '/products', icon: 'Goods', label: 'products' },
  { path: '/categories', icon: 'Menu', label: 'categories' },
  { path: '/orders', icon: 'Document', label: 'orders' },
  { path: '/users', icon: 'User', label: 'users' },
  { path: '/banners', icon: 'Picture', label: 'banners' },
  { path: '/coupons', icon: 'Ticket', label: 'coupons' },
  { path: '/stores', icon: 'OfficeBuilding', label: 'stores' },
]

function logout() { router.push('/login') }
</script>