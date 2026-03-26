<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const activeTab = ref<'login' | 'signup'>('login')
const email = ref('')
const password = ref('')
const nickname = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) {
    errorMessage.value = '請填寫所有欄位'
    return
  }
  isSubmitting.value = true
  errorMessage.value = ''
  const res = await auth.login({ email: email.value, password: password.value })
  isSubmitting.value = false
  if (res.status) {
    router.push('/todo')
  } else {
    errorMessage.value = (res as { message?: string }).message || '登入失敗'
  }
}

async function handleSignUp() {
  if (!email.value || !password.value || !nickname.value) {
    errorMessage.value = '請填寫所有欄位'
    return
  }
  isSubmitting.value = true
  errorMessage.value = ''
  const res = await auth.signUp({
    email: email.value,
    password: password.value,
    nickname: nickname.value,
  })
  isSubmitting.value = false
  if (res.status) {
    activeTab.value = 'login'
    errorMessage.value = ''
    password.value = ''
  } else {
    errorMessage.value = (res as { message?: string }).message || '註冊失敗'
  }
}

function switchTab(tab: 'login' | 'signup') {
  activeTab.value = tab
  errorMessage.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">
        Todo API 教學工具
      </h1>

      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Tab 切換 -->
        <div class="flex border-b border-gray-200">
          <button
            class="flex-1 py-3 text-center font-medium transition-colors"
            :class="activeTab === 'login'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'"
            @click="switchTab('login')"
          >
            登入
          </button>
          <button
            class="flex-1 py-3 text-center font-medium transition-colors"
            :class="activeTab === 'signup'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'"
            @click="switchTab('signup')"
          >
            註冊
          </button>
        </div>

        <!-- 表單 -->
        <form class="p-6 space-y-4" @submit.prevent="activeTab === 'login' ? handleLogin() : handleSignUp()">
          <div v-if="activeTab === 'signup'">
            <label class="block text-sm font-medium text-gray-700 mb-1">暱稱</label>
            <input
              v-model="nickname"
              type="text"
              placeholder="請輸入暱稱"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="請輸入 Email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">密碼</label>
            <input
              v-model="password"
              type="password"
              placeholder="請輸入密碼"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div v-if="errorMessage" class="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {{ isSubmitting ? '處理中...' : (activeTab === 'login' ? '登入' : '註冊') }}
          </button>
        </form>
      </div>

      <p class="text-center text-gray-400 text-sm mt-6">
        API: todolist-api.hexschool.io
      </p>
    </div>
  </div>
</template>
