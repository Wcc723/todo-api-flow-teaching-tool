<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todo'
import TodoInput from './TodoInput.vue'
import TodoList from './TodoList.vue'

const router = useRouter()
const auth = useAuthStore()
const todoStore = useTodoStore()

onMounted(() => {
  todoStore.fetchTodos()
})

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}

async function handleAdd(content: string) {
  await todoStore.addTodo(content)
}

async function handleToggle(id: string) {
  await todoStore.toggleTodo(id)
}

async function handleUpdate(id: string, content: string) {
  await todoStore.updateTodo(id, content)
}

async function handleDelete(id: string) {
  await todoStore.deleteTodo(id)
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">待辦事項</h2>
        <p v-if="auth.nickname" class="text-sm text-gray-500">{{ auth.nickname }} 的待辦清單</p>
      </div>
      <button
        @click="handleLogout"
        class="px-4 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
      >
        登出
      </button>
    </div>

    <!-- 新增 -->
    <div class="mb-6">
      <TodoInput @add="handleAdd" />
    </div>

    <!-- 列表 -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="todoStore.isLoading" class="text-center py-8 text-gray-400">
        載入中...
      </div>
      <TodoList
        v-else
        :todos="todoStore.todos"
        @toggle="handleToggle"
        @update="handleUpdate"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>
