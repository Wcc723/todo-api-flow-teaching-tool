<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useApiVisualizerStore } from '@/stores/apiVisualizer'
import EndpointDisplay from './EndpointDisplay.vue'
import StatusIndicator from './StatusIndicator.vue'
import RequestAnimation from './RequestAnimation.vue'
import RequestHistory from './RequestHistory.vue'

const store = useApiVisualizerStore()
const { currentRequest, history } = storeToRefs(store)
</script>

<template>
  <div class="flex flex-col h-full bg-gray-900 rounded-xl p-6 text-white">
    <h2 class="text-lg font-bold text-gray-200 mb-6">API 運作監控</h2>

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
