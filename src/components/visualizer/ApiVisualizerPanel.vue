<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useApiVisualizerStore } from '@/stores/apiVisualizer'
import EndpointDisplay from './EndpointDisplay.vue'
import StatusIndicator from './StatusIndicator.vue'
import RequestAnimation from './RequestAnimation.vue'
import RequestHistory from './RequestHistory.vue'

const store = useApiVisualizerStore()
const { currentRequest, history, slowMode } = storeToRefs(store)
</script>

<template>
  <div class="flex flex-col h-full bg-gray-900 rounded-xl p-6 text-white">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold text-gray-200">API 運作監控</h2>
      <label class="flex items-center gap-2 cursor-pointer select-none">
        <span class="text-xs text-gray-400">慢速模式</span>
        <div class="relative">
          <input
            v-model="slowMode"
            type="checkbox"
            class="sr-only peer"
          />
          <div class="w-9 h-5 bg-gray-700 rounded-full peer-checked:bg-amber-500 transition-colors" />
          <div class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
        </div>
      </label>
    </div>

    <!-- Endpoint 資訊 -->
    <div class="mb-4">
      <EndpointDisplay :request="currentRequest" />
    </div>

    <!-- 狀態 -->
    <div class="mb-2">
      <StatusIndicator :phase="currentRequest?.phase ?? 'idle'" />
    </div>

    <!-- 動畫 -->
    <div class="mb-6">
      <RequestAnimation :phase="currentRequest?.phase ?? 'idle'" />
    </div>

    <!-- Response 預覽 -->
    <div v-if="currentRequest?.response || currentRequest?.error" class="mb-6">
      <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">回應</h3>
      <pre
        class="text-xs font-mono p-3 rounded-lg overflow-auto max-h-32"
        :class="currentRequest.error ? 'bg-red-900/30 text-red-300' : 'bg-gray-800 text-green-300'"
      >{{ currentRequest.error || JSON.stringify(currentRequest.response?.data, null, 2) }}</pre>
    </div>

    <!-- 歷史紀錄 -->
    <div class="flex-1 overflow-hidden">
      <RequestHistory :history="history" />
    </div>
  </div>
</template>
