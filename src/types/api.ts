export type ApiRequestPhase =
  | 'idle'
  | 'sending'
  | 'processing'
  | 'responding'
  | 'done'
  | 'error'

export interface ApiRequestInfo {
  id: string
  method: string
  path: string
  baseUrl: string
  body?: unknown
  phase: ApiRequestPhase
  startTime: number
  endTime?: number
  response?: {
    status: number
    data: unknown
  }
  error?: string
}

export interface ApiResponse<T = unknown> {
  status: boolean
  message?: string
  data?: T
  [key: string]: unknown
}
