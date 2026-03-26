<script setup lang="ts">
import { computed } from 'vue'
import type { ApiRequestPhase } from '@/types/api'

const props = defineProps<{
  phase: ApiRequestPhase
}>()

const leftActive = computed(() => ['sending'].includes(props.phase))
const rightActive = computed(() => ['processing', 'responding'].includes(props.phase))
const isDone = computed(() => props.phase === 'done')
const isError = computed(() => props.phase === 'error')
const showPacketRight = computed(() => props.phase === 'sending')
const showPacketLeft = computed(() => props.phase === 'responding')

const lineColor = computed(() => {
  if (isError.value) return 'border-red-500'
  if (isDone.value) return 'border-green-500'
  if (['sending', 'processing', 'responding'].includes(props.phase)) return 'border-blue-500'
  return 'border-gray-600'
})

const lineStyle = computed(() => {
  if (['idle', 'error'].includes(props.phase)) return 'border-dashed'
  return 'border-solid'
})
</script>

<template>
  <div class="flex items-center gap-4 py-6">
    <!-- 左側：瀏覽器 -->
    <div class="flex flex-col items-center gap-2 w-20 shrink-0">
      <div
        class="w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300"
        :class="{
          'bg-blue-500/20 ring-2 ring-blue-400 animate-pulse': leftActive,
          'bg-green-500/20 ring-2 ring-green-400': isDone,
          'bg-red-500/20 ring-2 ring-red-400': isError,
          'bg-gray-700': !leftActive && !isDone && !isError,
        }"
      >
        <!-- Browser SVG -->
        <svg class="w-8 h-8" :class="leftActive ? 'text-blue-400' : isDone ? 'text-green-400' : isError ? 'text-red-400' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <rect x="2" y="3" width="20" height="18" rx="2" />
          <line x1="2" y1="8" x2="22" y2="8" />
          <circle cx="5.5" cy="5.5" r="0.8" fill="currentColor" />
          <circle cx="8.5" cy="5.5" r="0.8" fill="currentColor" />
          <circle cx="11.5" cy="5.5" r="0.8" fill="currentColor" />
        </svg>
      </div>
      <span class="text-xs text-gray-400">瀏覽器</span>
    </div>

    <!-- 中間：連線動畫 -->
    <div class="flex-1 relative h-8">
      <!-- 連線 -->
      <div
        class="absolute top-1/2 left-0 right-0 border-t-2 -translate-y-1/2 transition-colors duration-300"
        :class="[lineColor, lineStyle]"
      />

      <!-- 封包動畫 (左→右) -->
      <div
        v-if="showPacketRight"
        class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50 animate-move-right"
      />

      <!-- 封包動畫 (右→左) -->
      <div
        v-if="showPacketLeft"
        class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50 animate-move-left"
      />

      <!-- 箭頭方向指示 -->
      <div v-if="showPacketRight" class="absolute right-0 top-1/2 -translate-y-1/2 text-blue-400 text-xs">
        &rarr;
      </div>
      <div v-if="showPacketLeft" class="absolute left-0 top-1/2 -translate-y-1/2 text-green-400 text-xs">
        &larr;
      </div>
    </div>

    <!-- 右側：伺服器 -->
    <div class="flex flex-col items-center gap-2 w-20 shrink-0">
      <div
        class="w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300"
        :class="{
          'bg-yellow-500/20 ring-2 ring-yellow-400': rightActive && props.phase === 'processing',
          'bg-green-500/20 ring-2 ring-green-400': rightActive && props.phase === 'responding' || isDone,
          'bg-red-500/20 ring-2 ring-red-400': isError,
          'bg-gray-700': !rightActive && !isDone && !isError,
        }"
      >
        <!-- Server SVG with LED indicators -->
        <svg
          class="w-8 h-8"
          :class="{
            'text-yellow-400': props.phase === 'processing',
            'text-green-400': props.phase === 'responding' || isDone,
            'text-red-400': isError,
            'text-gray-400': !rightActive && !isDone && !isError,
          }"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"
        >
          <!-- Server rack -->
          <rect x="3" y="2" width="18" height="6" rx="1" />
          <rect x="3" y="10" width="18" height="6" rx="1" />
          <!-- LED indicators -->
          <circle
            cx="7" cy="5" r="1"
            :class="props.phase === 'processing' ? 'animate-led-blink-1' : ''"
            :fill="props.phase === 'processing' ? '#facc15' : 'currentColor'"
          />
          <circle
            cx="10" cy="5" r="1"
            :class="props.phase === 'processing' ? 'animate-led-blink-2' : ''"
            :fill="props.phase === 'processing' ? '#facc15' : 'currentColor'"
          />
          <circle
            cx="7" cy="13" r="1"
            :class="props.phase === 'processing' ? 'animate-led-blink-2' : ''"
            :fill="props.phase === 'processing' ? '#facc15' : 'currentColor'"
          />
          <circle
            cx="10" cy="13" r="1"
            :class="props.phase === 'processing' ? 'animate-led-blink-1' : ''"
            :fill="props.phase === 'processing' ? '#facc15' : 'currentColor'"
          />
          <!-- Rack lines -->
          <line x1="13" y1="5" x2="17" y2="5" />
          <line x1="13" y1="13" x2="17" y2="13" />
          <!-- Base -->
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="8" y1="22" x2="16" y2="22" />
        </svg>
      </div>
      <span class="text-xs text-gray-400">伺服器</span>
    </div>
  </div>
</template>
