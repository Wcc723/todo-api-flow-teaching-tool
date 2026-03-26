import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useApiClient } from '@/composables/useApiClient'
import type { Todo } from '@/types/todo'

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])
  const isLoading = ref(false)

  async function fetchTodos() {
    isLoading.value = true
    const { request } = useApiClient()
    const res = await request<Todo[]>('GET', '/todos/')
    if (res.status && res.data) {
      todos.value = res.data
    }
    isLoading.value = false
  }

  async function addTodo(content: string) {
    const { request } = useApiClient()
    const res = await request('POST', '/todos/', {
      body: { content },
    })
    if (res.status) {
      await fetchTodos()
    }
    return res
  }

  async function updateTodo(id: string, content: string) {
    const { request } = useApiClient()
    const res = await request('PUT', `/todos/${id}`, {
      body: { content },
    })
    if (res.status) {
      await fetchTodos()
    }
    return res
  }

  async function deleteTodo(id: string) {
    const { request } = useApiClient()
    const res = await request('DELETE', `/todos/${id}`)
    if (res.status) {
      await fetchTodos()
    }
    return res
  }

  async function toggleTodo(id: string) {
    const { request } = useApiClient()
    const res = await request('PATCH', `/todos/${id}/toggle`)
    if (res.status) {
      await fetchTodos()
    }
    return res
  }

  return {
    todos,
    isLoading,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  }
})
