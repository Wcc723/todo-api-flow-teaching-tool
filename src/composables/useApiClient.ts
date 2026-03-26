import { useApiVisualizerStore } from '@/stores/apiVisualizer'
import { useAuthStore } from '@/stores/auth'
import type { ApiResponse } from '@/types/api'

const API_BASE_URL = 'https://todolist-api.hexschool.io'

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export function useApiClient() {
  const visualizer = useApiVisualizerStore()
  const auth = useAuthStore()

  async function request<T = unknown>(
    method: string,
    path: string,
    options?: { body?: unknown; auth?: boolean },
  ): Promise<ApiResponse<T>> {
    const needsAuth = options?.auth ?? true

    // Phase: sending
    visualizer.startRequest({
      method: method.toUpperCase(),
      path,
      baseUrl: API_BASE_URL,
      body: options?.body,
    })
    await delay(300)

    try {
      // Phase: processing (request in flight)
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (needsAuth && auth.token) {
        headers['authorization'] = auth.token
      }

      const fetchOptions: RequestInit = {
        method: method.toUpperCase(),
        headers,
      }
      if (options?.body) {
        fetchOptions.body = JSON.stringify(options.body)
      }

      visualizer.setPhase('processing')
      const res = await fetch(`${API_BASE_URL}${path}`, fetchOptions)
      await delay(300)

      // Phase: responding
      visualizer.setPhase('responding')
      const data = await res.json()
      await delay(300)

      // Phase: done
      visualizer.completeRequest({ status: res.status, data })
      return data as ApiResponse<T>
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知錯誤'
      visualizer.failRequest(message)
      return { status: false, message } as ApiResponse<T>
    }
  }

  return { request }
}
