<script setup lang="ts">
import type { ApiRequestInfo } from '@/types/api'

defineProps<{
  request: ApiRequestInfo | null
}>()

const methodColors: Record<string, string> = {
  GET: 'bg-blue-500',
  POST: 'bg-green-500',
  PUT: 'bg-orange-500',
  DELETE: 'bg-red-500',
  PATCH: 'bg-purple-500',
}
</script>

<template>
  <div class="space-y-2">
    <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">API Endpoint</h3>

    <div v-if="request" class="space-y-2">
      <div class="flex items-center gap-2">
        <span
          class="px-2 py-1 text-xs font-bold text-white rounded"
          :class="methodColors[request.method] || 'bg-gray-500'"
        >
          {{ request.method }}
        </span>
        <code class="text-sm text-white font-mono">{{ request.path }}</code>
      </div>
      <div class="text-xs text-gray-400">
        {{ request.baseUrl }}
      </div>
    </div>

    <div v-else class="text-sm text-gray-500 italic">
      等待 API 請求...
    </div>
  </div>
</template>
