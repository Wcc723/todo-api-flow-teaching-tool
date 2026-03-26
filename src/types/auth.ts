export interface LoginPayload {
  email: string
  password: string
}

export interface SignUpPayload {
  email: string
  password: string
  nickname: string
}

export interface LoginResponse {
  status: boolean
  exp: number
  token: string
}

export interface SignUpResponse {
  status: boolean
  uid: string
}

export interface CheckoutResponse {
  status: boolean
  uid: string
}
