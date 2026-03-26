<script setup lang="ts">
import { computed } from 'vue'
import type { ApiRequestPhase } from '@/types/api'

const props = defineProps<{
  phase: ApiRequestPhase
}>()

const phaseConfig = computed(() => {
  const configs: Record<ApiRequestPhase, { label: string; color: string; dot: string }> = {
    idle: { label: '閒置中', color: 'text-gray-400', dot: 'bg-gray-400' },
    sending: { label: '發送請求中...', color: 'text-blue-400', dot: 'bg-blue-400' },
    processing: { label: '伺服器處理中...', color: 'text-yellow-400', dot: 'bg-yellow-400' },
    responding: { label: '接收回應中...', color: 'text-green-400', dot: 'bg-green-400' },
    done: { label: '完成', color: 'text-green-400', dot: 'bg-green-400' },
    error: { label: '錯誤', color: 'text-red-400', dot: 'bg-red-400' },
  }
  return configs[props.phase]
})

const isAnimating = computed(() =>
  ['sending', 'processing', 'responding'].includes(props.phase)
)
</script>

<template>
  <div class="flex items-center gap-2">
    <span
      class="w-2.5 h-2.5 rounded-full shrink-0"
      :class="[phaseConfig.dot, isAnimating ? 'animate-pulse' : '']"
    />
    <span class="text-sm font-medium" :class="phaseConfig.color">
      {{ phaseConfig.label }}
    </span>
  </div>
</template>
