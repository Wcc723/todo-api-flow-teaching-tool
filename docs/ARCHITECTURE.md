# 架構文件

## 目錄結構

```
vite-todo-sample/
├── index.html                  # Vite 入口 HTML，掛載 #app
├── package.json                # 專案設定、依賴、scripts
├── vite.config.ts              # Vite 設定（vue plugin、devtools、alias）
├── tsconfig.json               # TypeScript 根設定（references app + node）
├── tsconfig.app.json           # 應用程式 TS 設定（DOM 型別、path alias @/*）
├── tsconfig.node.json          # Node 環境 TS 設定（vite.config.ts 用）
├── env.d.ts                    # Vite 環境變數型別宣告
├── public/
│   └── favicon.ico             # 靜態 favicon
├── src/
│   ├── main.ts                 # 應用入口：建立 Vue app、註冊 Pinia 和 Router
│   ├── App.vue                 # 根元件（目前為初始模板）
│   ├── router/
│   │   └── index.ts            # Vue Router 設定（createWebHistory，routes 目前為空）
│   └── stores/
│       └── counter.ts          # Pinia store 範例（counter，含 count、doubleCount、increment）
├── docs/
│   ├── swagger_output.json     # 六角學院 TodoList API Swagger 2.0 文件
│   ├── README.md               # 項目介紹與快速開始
│   ├── ARCHITECTURE.md         # 本文件
│   ├── DEVELOPMENT.md          # 開發規範
│   ├── FEATURES.md             # 功能列表
│   ├── TESTING.md              # 測試規範
│   ├── CHANGELOG.md            # 更新日誌
│   └── plans/                  # 開發計畫
│       └── archive/            # 已完成計畫歸檔
└── .vscode/
    ├── extensions.json         # 推薦 VS Code 擴充套件
    └── settings.json           # VS Code 工作區設定
```

## 啟動流程

1. **`index.html`** — Vite 的入口點，包含 `<div id="app">` 掛載點和 `<script type="module" src="/src/main.ts">`
2. **`src/main.ts`** — 應用入口：
   - `createApp(App)` 建立 Vue 應用實例
   - `app.use(createPinia())` 註冊 Pinia 狀態管理
   - `app.use(router)` 註冊 Vue Router
   - `app.mount('#app')` 掛載至 DOM
3. **`src/App.vue`** — 根元件，使用 `<script setup lang="ts">` + `<template>` + `<style scoped>` 結構
4. **`src/router/index.ts`** — 使用 `createWebHistory` 模式，routes 陣列目前為空（待開發）
5. **`src/stores/counter.ts`** — Pinia store 範例，使用 Composition API 風格（`defineStore` + setup function）

## 資料流架構

```
[Vue 元件] <--雙向綁定--> [Pinia Store] --HTTP 請求--> [六角學院 TodoList API]
                                                              |
                                                        JWT Token 認證
                                                    (header: authorization)
```

### 資料流說明

1. **元件層（Views/Components）**：負責 UI 渲染與使用者互動，透過 Pinia store 存取資料
2. **狀態管理層（Pinia Stores）**：集中管理應用狀態，處理業務邏輯，發送 API 請求
3. **API 層**：與六角學院 TodoList API 通訊，所有需認證的請求須帶 JWT Token

### 認證流程

```
使用者登入 → POST /users/sign_in → 取得 token + exp
         → 儲存 token 至 store/localStorage
         → 後續 API 請求帶 authorization header
         → Token 過期或登出 → POST /users/sign_out → 清除 token
```

## 外部 API 總覽

Base URL：`https://todolist-api.hexschool.io`

### 使用者相關

| 方法 | 路徑 | 說明 | 認證 |
|------|------|------|------|
| POST | `/users/sign_up` | 註冊帳號 | 不需要 |
| POST | `/users/sign_in` | 登入帳號 | 不需要 |
| GET | `/users/checkout` | 驗證 Token | 需要 JWT |
| POST | `/users/sign_out` | 登出帳號 | 需要 JWT |

### 待辦事項相關

| 方法 | 路徑 | 說明 | 認證 |
|------|------|------|------|
| GET | `/todos/` | 取得所有待辦事項 | 需要 JWT |
| POST | `/todos/` | 新增待辦事項 | 需要 JWT |
| PUT | `/todos/{id}` | 更新待辦事項內容 | 需要 JWT |
| DELETE | `/todos/{id}` | 刪除待辦事項 | 需要 JWT |
| PATCH | `/todos/{id}/toggle` | 切換完成狀態 | 需要 JWT |

### 統一回應格式

**成功回應：**
```json
{
  "status": true,
  "data": [...] // 或 "message": "...", "token": "...", "uid": "..." 等
}
```

**失敗回應：**
```json
{
  "status": false,
  "message": "錯誤訊息"
}
```

### 待辦事項資料結構

```typescript
interface Todo {
  id: string        // 待辦事項唯一 ID
  createTime: number // 建立時間（Unix timestamp）
  content: string    // 待辦事項內容
  status: boolean    // 完成狀態（false=未完成，true=已完成）
}
```

### 認證機制

- 認證方式：JWT Token
- Token 位置：HTTP Header `authorization`
- 登入成功回傳 `token`（JWT）和 `exp`（過期時間，Unix timestamp）
- 需認證的 API 若未帶 Token 或 Token 無效，回傳 400 錯誤

## Vite 設定

`vite.config.ts` 關鍵設定：
- **vue()** — Vue 3 SFC 編譯支援
- **vueDevTools()** — Vue DevTools 整合（開發環境）
- **resolve.alias** — `@` 對應 `./src`，簡化 import 路徑

## TypeScript 設定

- **tsconfig.app.json**：應用程式碼設定，繼承 `@vue/tsconfig/tsconfig.dom.json`
  - `noUncheckedIndexedAccess: true` — 陣列/物件存取額外安全檢查
  - `paths: { "@/*": ["./src/*"] }` — path alias
- **tsconfig.node.json**：Node 環境設定（`vite.config.ts` 等建構工具檔案用）
