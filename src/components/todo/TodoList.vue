<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Todo } from '@/types/todo'
import TodoItem from './TodoItem.vue'

const props = defineProps<{
  todos: Todo[]
}>()

const emit = defineEmits<{
  toggle: [id: string]
  update: [id: string, content: string]
  delete: [id: string]
}>()

type FilterType = 'all' | 'pending' | 'done'
const activeFilter = ref<FilterType>('all')

const filteredTodos = computed(() => {
  switch (activeFilter.value) {
    case 'pending':
      return props.todos.filter((t) => !t.status)
    case 'done':
      return props.todos.filter((t) => t.status)
    default:
      return props.todos
  }
})

const pendingCount = computed(() => props.todos.filter((t) => !t.status).length)
const doneCount = computed(() => props.todos.filter((t) => t.status).length)

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待完成' },
  { key: 'done', label: '已完成' },
]
</script>

<template>
  <div>
    <!-- 篩選 Tab -->
    <div class="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg">
      <button
        v-for="filter in filters"
        :key="filter.key"
        @click="activeFilter = filter.key"
        class="flex-1 py-2 text-sm font-medium rounded-md transition"
        :class="activeFilter === filter.key
          ? 'bg-white text-blue-600 shadow-sm'
          : 'text-gray-500 hover:text-gray-700'"
      >
        {{ filter.label }}
        <span class="ml-1 text-xs text-gray-400">
          ({{ filter.key === 'all' ? todos.length : filter.key === 'pending' ? pendingCount : doneCount }})
        </span>
      </button>
    </div>

    <!-- 待辦列表 -->
    <ul v-if="filteredTodos.length" class="space-y-2">
      <TodoItem
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
        @toggle="emit('toggle', $event)"
        @update="(id, content) => emit('update', id, content)"
        @delete="emit('delete', $event)"
      />
    </ul>

    <div v-else class="text-center py-8 text-gray-400">
      {{ activeFilter === 'all' ? '還沒有待辦事項，新增一筆吧！' : '沒有符合條件的項目' }}
    </div>
  </div>
</template>
