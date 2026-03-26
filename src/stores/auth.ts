import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useApiClient } from '@/composables/useApiClient'
import type { LoginPayload, SignUpPayload, LoginResponse, SignUpResponse } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('todo_token') || '')
  const nickname = ref(localStorage.getItem('todo_nickname') || '')

  const isLoggedIn = computed(() => !!token.value)

  function setAuth(newToken: string, newNickname?: string) {
    token.value = newToken
    localStorage.setItem('todo_token', newToken)
    if (newNickname) {
      nickname.value = newNickname
      localStorage.setItem('todo_nickname', newNickname)
    }
  }

  function clearAuth() {
    token.value = ''
    nickname.value = ''
    localStorage.removeItem('todo_token')
    localStorage.removeItem('todo_nickname')
  }

  async function login(payload: LoginPayload) {
    const { request } = useApiClient()
    const res = await request<LoginResponse>('POST', '/users/sign_in', {
      body: payload,
      auth: false,
    })
    if (res.status) {
      const data = res as unknown as LoginResponse
      setAuth(data.token)
    }
    return res
  }

  async function signUp(payload: SignUpPayload) {
    const { request } = useApiClient()
    const res = await request<SignUpResponse>('POST', '/users/sign_up', {
      body: payload,
      auth: false,
    })
    return res
  }

  async function checkToken() {
    if (!token.value) return false
    const { request } = useApiClient()
    const res = await request('GET', '/users/checkout')
    if (!res.status) {
      clearAuth()
      return false
    }
    return true
  }

  async function logout() {
    const { request } = useApiClient()
    await request('POST', '/users/sign_out')
    clearAuth()
  }

  return {
    token,
    nickname,
    isLoggedIn,
    login,
    signUp,
    checkToken,
    logout,
    clearAuth,
  }
})
