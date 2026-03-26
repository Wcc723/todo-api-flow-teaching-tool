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
│   ├── App.vue                 # 根元件（僅包含 <RouterView />）
│   ├── assets/
│   │   └── main.css            # 全域樣式：Tailwind CSS 4 入口 + 自訂動畫 keyframes
│   ├── types/                  # TypeScript 型別定義
│   │   ├── todo.ts             # Todo、CreateTodoPayload、UpdateTodoPayload
│   │   ├── auth.ts             # LoginPayload、SignUpPayload、LoginResponse、SignUpResponse、CheckoutResponse
│   │   └── api.ts              # ApiRequestPhase、ApiRequestInfo、ApiResponse
│   ├── composables/            # 共用可組合邏輯
│   │   └── useApiClient.ts     # 封裝 fetch + 300ms 延遲 + apiVisualizer 狀態機觸發
│   ├── stores/                 # Pinia 狀態管理
│   │   ├── auth.ts             # 認證狀態：token、nickname、login/signUp/checkToken/logout
│   │   ├── todo.ts             # 待辦狀態：todos、fetchTodos/addTodo/updateTodo/deleteTodo/toggleTodo
│   │   └── apiVisualizer.ts    # API 請求狀態機：currentRequest、history、phase 轉換
│   ├── router/
│   │   └── index.ts            # 路由設定：/login、/todo（requiresAuth）、beforeEach 守衛
│   ├── views/                  # 頁面級元件
│   │   ├── LoginView.vue       # 登入/註冊頁面（含 Tab 切換）
│   │   └── TodoView.vue        # 主頁面（左右分欄：TodoPanel + ApiVisualizerPanel）
│   └── components/
│       ├── todo/               # Todo 功能元件
│       │   ├── TodoPanel.vue   # Todo 面板容器（含 Header、新增、列表）
│       │   ├── TodoInput.vue   # 新增待辦輸入框
│       │   ├── TodoList.vue    # 待辦列表（含全部/待完成/已完成篩選 Tab）
│       │   └── TodoItem.vue    # 單筆待辦項目（含行內編輯、切換狀態、刪除）
│       └── visualizer/         # API 視覺化元件
│           ├── ApiVisualizerPanel.vue  # 視覺化面板容器（深色背景，組合子元件）
│           ├── EndpointDisplay.vue     # 顯示當前 API endpoint（method badge + path + baseUrl）
│           ├── StatusIndicator.vue     # 顯示目前 phase 狀態（含動畫 dot）
│           ├── RequestAnimation.vue    # 瀏覽器↔伺服器連線動畫（封包移動效果）
│           └── RequestHistory.vue      # 最近 20 筆請求紀錄（method、path、狀態碼、耗時）
├── docs/
│   ├── swagger_output.json     # 六角學院 TodoList API Swagger 2.0 文件
│   ├── README.md               # 項目介紹與快速開始
│   ├── ARCHITECTURE.md         # 本文件
│   ├── DEVELOPMENT.md          # 開發規範
│   ├── FEATURES.md             # 功能列表
│   ├── TESTING.md              # 測試規範
│   ├── CHANGELOG.md            # 更新日誌
│   └── plans/                  # 開發計畫
│       ├── 2026-03-26-todo-api-teaching-tool.md  # 待歸檔計畫
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
   - `import './assets/main.css'` 載入 Tailwind CSS 4
   - `app.mount('#app')` 掛載至 DOM
3. **`src/App.vue`** — 根元件，僅包含 `<RouterView />`，路由決定渲染哪個 View
4. **`src/router/index.ts`** — 使用 `createWebHistory` 模式：
   - `/` 重新導向至 `/todo`
   - `/login` → `LoginView.vue`（公開頁面）
   - `/todo` → `TodoView.vue`（需認證，`meta.requiresAuth: true`）
   - `router.beforeEach`：未登入訪問 `/todo` 導向 `/login`；已登入訪問 `/login` 導向 `/todo`
5. **`src/views/TodoView.vue`** — 主頁面，渲染左右兩欄：`TodoPanel`（待辦操作）和 `ApiVisualizerPanel`（API 監控）

## 資料流架構

### 整體架構

```
[Vue 元件 / Views]
       |
       | 呼叫 store action
       v
[Pinia Stores]                        [apiVisualizer store]
  auth.ts                                     ^
  todo.ts                                     | 狀態機更新
       |                                      |
       | 呼叫 composable                       |
       v                                      |
[useApiClient composable] ──────────────────>─┘
       |
       | 1. startRequest → phase: sending → delay 300ms
       | 2. fetch() 發出 HTTP 請求 → phase: processing → delay 300ms
       | 3. res.json() 解析回應 → phase: responding → delay 300ms
       | 4. completeRequest / failRequest → phase: done / error
       v
[六角學院 TodoList API]
https://todolist-api.hexschool.io
(JWT 認證：header authorization)
```

### 資料流說明

1. **元件層（Views/Components）**：負責 UI 渲染與使用者互動。呼叫 Pinia store 的 action，不直接發 API 請求
2. **狀態管理層（Pinia Stores）**：
   - `auth.ts`：管理登入狀態，token 持久化至 localStorage
   - `todo.ts`：管理待辦列表，CRUD 操作完成後重新呼叫 `fetchTodos()` 同步資料
   - `apiVisualizer.ts`：管理 API 請求的即時狀態，供視覺化面板讀取
3. **Composable 層（useApiClient）**：統一的 HTTP 請求入口，負責：
   - 注入 JWT Token 到 request header
   - 以 300ms 延遲驅動 apiVisualizer 狀態機轉換
   - 捕獲錯誤並回傳統一格式 `ApiResponse`
4. **視覺化層（ApiVisualizerPanel）**：訂閱 `apiVisualizerStore`，即時反映每次 API 請求的生命週期

### apiVisualizer 狀態機

每次 API 請求依序經歷以下 phase 轉換：

```
idle
 |
 | startRequest() ── useApiClient 呼叫
 v
sending         ← 封包從瀏覽器往伺服器移動（動畫）
 | delay 300ms
 v
processing      ← 伺服器圖示旋轉（fetch 進行中）
 | delay 300ms
 v
responding      ← 封包從伺服器往瀏覽器移動（動畫）
 | delay 300ms
 v
done            ← 顯示回應內容，寫入 history
  \
   error        ← 發生例外，顯示錯誤訊息，寫入 history
```

history 保留最近 20 筆紀錄，每筆包含：method、path、HTTP status code、耗時（ms）

### 認證流程

```
使用者登入 → POST /users/sign_in → 取得 token
          → token 儲存至 authStore.token + localStorage('todo_token')
          → 後續 API 請求由 useApiClient 自動帶入 authorization header
          → 登出 → POST /users/sign_out → clearAuth() 清除 store + localStorage
```

路由守衛在 `router.beforeEach` 中檢查 `authStore.isLoggedIn`（`computed(() => !!token.value)`），不需主動呼叫 `checkToken()`。`checkToken()` 可在需要驗證 token 有效性時手動呼叫。

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
  id: string         // 待辦事項唯一 ID
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

## Tailwind CSS 4 設定

使用 Tailwind CSS 4 的 `@import "tailwindcss"` 方式引入，無需 `tailwind.config.js`。

自訂動畫定義於 `src/assets/main.css` 的 `@theme` 區塊：

| 動畫名稱 | 用途 |
|----------|------|
| `animate-move-right` | 封包從瀏覽器移向伺服器（sending phase） |
| `animate-move-left` | 封包從伺服器移回瀏覽器（responding phase） |
| `animate-pulse-slow` | 緩慢脈衝（備用） |
| `animate-spin-slow` | 伺服器圖示旋轉（processing phase） |
