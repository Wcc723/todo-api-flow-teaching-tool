<script setup lang="ts">
import { ref } from 'vue'
import type { Todo } from '@/types/todo'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  toggle: [id: string]
  update: [id: string, content: string]
  delete: [id: string]
}>()

const isEditing = ref(false)
const editContent = ref('')

function startEdit() {
  editContent.value = props.todo.content
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
}

function saveEdit() {
  const content = editContent.value.trim()
  if (content && content !== props.todo.content) {
    emit('update', props.todo.id, content)
  }
  isEditing.value = false
}
</script>

<template>
  <li class="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 group hover:shadow-sm transition">
    <input
      type="checkbox"
      :checked="todo.status"
      @change="emit('toggle', todo.id)"
      class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
    />

    <template v-if="isEditing">
      <input
        v-model="editContent"
        @keyup.enter="saveEdit"
        @keyup.escape="cancelEdit"
        class="flex-1 px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        autofocus
      />
      <button @click="saveEdit" class="text-green-600 hover:text-green-800 text-sm font-medium">
        儲存
      </button>
      <button @click="cancelEdit" class="text-gray-400 hover:text-gray-600 text-sm">
        取消
      </button>
    </template>

    <template v-else>
      <span
        class="flex-1 text-sm cursor-pointer"
        :class="todo.status ? 'line-through text-gray-400' : 'text-gray-700'"
        @dblclick="startEdit"
      >
        {{ todo.content }}
      </span>
      <button
        @click="startEdit"
        class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition text-sm"
      >
        編輯
      </button>
      <button
        @click="emit('delete', todo.id)"
        class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition text-sm"
      >
        刪除
      </button>
    </template>
  </li>
</template>
