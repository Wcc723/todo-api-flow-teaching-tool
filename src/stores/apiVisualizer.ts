import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ApiRequestInfo, ApiRequestPhase } from '@/types/api'

export const useApiVisualizerStore = defineStore('apiVisualizer', () => {
  const currentRequest = ref<ApiRequestInfo | null>(null)
  const history = ref<ApiRequestInfo[]>([])
  const slowMode = ref(false)

  const phaseDelay = computed(() => slowMode.value ? 500 : 300)

  const isActive = computed(() =>
    currentRequest.value !== null &&
    currentRequest.value.phase !== 'idle' &&
    currentRequest.value.phase !== 'done' &&
    currentRequest.value.phase !== 'error'
  )

  function startRequest(info: Omit<ApiRequestInfo, 'phase' | 'startTime' | 'id'>) {
    const request: ApiRequestInfo = {
      ...info,
      id: crypto.randomUUID(),
      phase: 'sending',
      startTime: performance.now(),
    }
    currentRequest.value = request
    return request.id
  }

  function setPhase(phase: ApiRequestPhase) {
    if (currentRequest.value) {
      currentRequest.value = { ...currentRequest.value, phase }
    }
  }

  function completeRequest(response: { status: number; data: unknown }) {
    if (currentRequest.value) {
      const completed: ApiRequestInfo = {
        ...currentRequest.value,
        phase: 'done',
        endTime: performance.now(),
        response,
      }
      currentRequest.value = completed
      history.value = [completed, ...history.value].slice(0, 20)
    }
  }

  function failRequest(error: string) {
    if (currentRequest.value) {
      const failed: ApiRequestInfo = {
        ...currentRequest.value,
        phase: 'error',
        endTime: performance.now(),
        error,
      }
      currentRequest.value = failed
      history.value = [failed, ...history.value].slice(0, 20)
    }
  }

  function reset() {
    currentRequest.value = null
  }

  return {
    currentRequest,
    history,
    slowMode,
    phaseDelay,
    isActive,
    startRequest,
    setPhase,
    completeRequest,
    failRequest,
    reset,
  }
})
