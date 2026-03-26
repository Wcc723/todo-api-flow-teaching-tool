<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  add: [content: string]
}>()

const newTodo = ref('')
const isAdding = ref(false)

async function handleAdd() {
  const content = newTodo.value.trim()
  if (!content || isAdding.value) return
  isAdding.value = true
  emit('add', content)
  newTodo.value = ''
  isAdding.value = false
}
</script>

<template>
  <form @submit.prevent="handleAdd" class="flex gap-2">
    <input
      v-model="newTodo"
      type="text"
      placeholder="新增待辦事項..."
      class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
    />
    <button
      type="submit"
      :disabled="!newTodo.trim() || isAdding"
      class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
    >
      新增
    </button>
  </form>
</template>
