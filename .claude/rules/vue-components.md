---
paths:
  - "src/**"
---

# Vue 元件開發規則

- 一律使用 `<script setup lang="ts">` Composition API，禁止 Options API
- Props 使用 `defineProps<{}>()` 搭配 TypeScript 泛型定義型別
- Emits 使用 `defineEmits<{}>()` 搭配 TypeScript 泛型定義型別
- 元件檔名使用 PascalCase（如 `TodoItem.vue`）
- Pinia store 使用 Composition API 風格（setup function），命名為 `use{Name}Store`
- import 路徑使用 `@/` alias（對應 `src/`）
- 樣式使用 `<style scoped>` 避免全域污染
- API 呼叫的 base URL 為 `https://todolist-api.hexschool.io`
- 需認證的 API 請求在 header `authorization` 帶 JWT Token
- API 回應統一格式：成功 `{ status: true, data/message/token }` / 失敗 `{ status: false, message }`
