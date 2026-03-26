# 開發規範

## 命名規則

| 類別 | 規則 | 範例 |
|------|------|------|
| 元件檔名 | PascalCase | `TodoList.vue`、`LoginForm.vue` |
| 元件名稱 | PascalCase（與檔名一致） | `<TodoList />` |
| Pinia Store | camelCase，以 `use` 開頭 + `Store` 結尾 | `useTodoStore`、`useAuthStore` |
| Store 檔案 | camelCase | `todo.ts`、`auth.ts` |
| 路由名稱 | camelCase | `{ name: 'todoList' }` |
| 變數/函式 | camelCase | `todoList`、`fetchTodos()` |
| 常數 | UPPER_SNAKE_CASE | `API_BASE_URL` |
| 型別/介面 | PascalCase | `interface Todo`、`type ApiResponse` |
| CSS class | kebab-case | `.todo-item`、`.login-form` |
| 事件名稱 | camelCase（emit） | `@updateTodo`、`@deleteTodo` |

## 元件規範

### 結構順序

每個 `.vue` 檔案遵循以下順序：

```vue
<script setup lang="ts">
// 1. import
// 2. props / emits 定義
// 3. composables / store
// 4. ref / reactive
// 5. computed
// 6. methods
// 7. lifecycle hooks
// 8. watch
</script>

<template>
  <!-- 模板內容 -->
</template>

<style scoped>
/* 樣式 */
</style>
```

### 元件設計原則

- 使用 `<script setup lang="ts">` Composition API，不使用 Options API
- Props 使用 `defineProps<{}>()` 搭配 TypeScript 型別
- Emits 使用 `defineEmits<{}>()` 搭配 TypeScript 型別
- 元件保持單一職責，超過 200 行考慮拆分

## Pinia Store 規範

使用 Composition API 風格（setup function）：

```typescript
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useExampleStore = defineStore('example', () => {
  // state
  const items = ref<Item[]>([])

  // getters
  const itemCount = computed(() => items.value.length)

  // actions
  function fetchItems() { /* ... */ }

  return { items, itemCount, fetchItems }
})
```

## API 呼叫規範

所有 API 請求一律透過 `useApiClient` composable 發送，不可直接在元件或 store 中呼叫 `fetch`。

### 使用方式

```typescript
import { useApiClient } from '@/composables/useApiClient'

const { request } = useApiClient()

// 不需認證
const res = await request('POST', '/users/sign_in', {
  body: { email, password },
  auth: false,
})

// 需認證（預設 auth: true）
const res = await request('GET', '/todos/')
```

### Base URL

```typescript
const API_BASE_URL = 'https://todolist-api.hexschool.io'
```

`useApiClient` 內部已定義此常數，外部不需重複定義。

### 認證請求

`useApiClient` 會自動從 `authStore.token` 取得 JWT Token 並注入 `authorization` header。僅在明確不需認證時傳入 `auth: false`（如登入、註冊 API）。

### 回傳格式

`request()` 回傳 `Promise<ApiResponse<T>>`：

```typescript
interface ApiResponse<T = unknown> {
  status: boolean
  message?: string
  data?: T
  [key: string]: unknown
}
```

### 錯誤處理

- API 回傳 `status: false` 時，`message` 欄位包含錯誤訊息，應顯示給使用者
- `useApiClient` 內部捕獲 fetch 例外，回傳 `{ status: false, message: '...' }`，不會拋出例外到呼叫端

### apiVisualizer 整合

`useApiClient` 在每次請求中自動觸發 `apiVisualizerStore` 狀態機，開發者無需手動更新視覺化狀態，各 phase 間有 300ms 延遲以便教學展示。

## 路由規範

路由定義集中在 `src/router/index.ts`，使用 `createWebHistory` 模式。

### 路由結構建議

```typescript
const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
  { path: '/todo', name: 'todo', component: () => import('@/views/TodoView.vue'), meta: { requiresAuth: true } },
]
```

### 路由守衛

需要認證的頁面加上 `meta: { requiresAuth: true }`，並在 `router.beforeEach` 中檢查。

## 目錄結構

```
src/
├── assets/          # 靜態資源（全域 CSS，Tailwind CSS 4 入口）
├── components/      # 功能元件，依功能分子目錄
│   ├── todo/        # Todo 相關元件
│   └── visualizer/  # API 視覺化相關元件
├── composables/     # 共用 Composables（如 useApiClient）
├── router/          # 路由設定
├── stores/          # Pinia Stores
├── types/           # TypeScript 型別定義
└── views/           # 頁面級元件（對應路由）
```

## 環境變數

Vite 使用 `.env` 檔案管理環境變數：

| 變數 | 用途 | 必要 | 預設值 |
|------|------|------|--------|
| `VITE_API_BASE_URL` | API Base URL | 否 | `https://todolist-api.hexschool.io` |
| `BASE_URL` | 應用 base path（Vue Router 用） | 否 | `/` |

存取方式：`import.meta.env.VITE_API_BASE_URL`

## Path Alias

`@` 對應 `./src` 目錄：

```typescript
import TodoList from '@/components/TodoList.vue'
import { useTodoStore } from '@/stores/todo'
```

設定位置：
- `vite.config.ts`：`resolve.alias`（Vite 解析用）
- `tsconfig.app.json`：`compilerOptions.paths`（TypeScript 型別用）

## 計畫歸檔流程

1. 計畫檔案命名格式：`YYYY-MM-DD-<feature-name>.md`
2. 計畫文件結構：User Story → Spec → Tasks
3. 功能完成後：移至 `docs/plans/archive/`
4. 更新 `docs/FEATURES.md` 和 `docs/CHANGELOG.md`
