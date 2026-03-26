export interface Todo {
  id: string
  createTime: number
  content: string
  status: boolean
}

export interface CreateTodoPayload {
  content: string
}

export interface UpdateTodoPayload {
  content: string
}
