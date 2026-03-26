<script setup lang="ts">
import type { ApiRequestInfo } from '@/types/api'

defineProps<{
  history: ApiRequestInfo[]
}>()

const methodColors: Record<string, string> = {
  GET: 'text-blue-400',
  POST: 'text-green-400',
  PUT: 'text-orange-400',
  DELETE: 'text-red-400',
  PATCH: 'text-purple-400',
}

function formatDuration(info: ApiRequestInfo): string {
  if (!info.endTime) return '...'
  return `${Math.round(info.endTime - info.startTime)}ms`
}
</script>

<template>
  <div>
    <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
      請求紀錄
    </h3>

    <div v-if="history.length" class="space-y-1.5 max-h-64 overflow-y-auto">
      <div
        v-for="item in history"
        :key="item.id"
        class="flex items-center gap-2 text-xs py-1.5 px-2 rounded bg-gray-800/50"
      >
        <span class="font-mono font-bold w-14 shrink-0" :class="methodColors[item.method] || 'text-gray-400'">
          {{ item.method }}
        </span>
        <span class="font-mono text-gray-300 flex-1 truncate">{{ item.path }}</span>
        <span
          class="shrink-0"
          :class="item.phase === 'done' ? 'text-green-400' : 'text-red-400'"
        >
          {{ item.phase === 'done' ? item.response?.status : 'ERR' }}
        </span>
        <span class="text-gray-500 w-14 text-right shrink-0">{{ formatDuration(item) }}</span>
      </div>
    </div>

    <div v-else class="text-sm text-gray-500 italic">
      尚無請求紀錄
    </div>
  </div>
</template>
