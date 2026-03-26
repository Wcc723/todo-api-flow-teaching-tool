# 更新日誌

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.1.0/)。

## [0.1.0] - 2026-03-26

### 新增

**認證功能**
- 使用者註冊（`POST /users/sign_up`）：email + password + nickname，成功後切換至登入 Tab
- 使用者登入（`POST /users/sign_in`）：取得 JWT Token，持久化至 localStorage
- 使用者登出（`POST /users/sign_out`）：呼叫 API 後清除 store + localStorage 認證資訊
- Token 有效性驗證（`GET /users/checkout`）：`checkToken()` 可手動驗證 token

**待辦事項 CRUD**
- 取得待辦列表（`GET /todos/`）：進入頁面時自動載入，每次 CRUD 成功後重新同步
- 新增待辦事項（`POST /todos/`）：輸入框 + 「新增」按鈕，空白內容 disabled
- 編輯待辦事項（`PUT /todos/{id}`）：行內編輯，支援雙擊文字或點擊「編輯」按鈕，Enter 儲存 / Escape 取消
- 刪除待辦事項（`DELETE /todos/{id}`）：Hover 顯示「刪除」按鈕
- 切換完成狀態（`PATCH /todos/{id}/toggle`）：checkbox 切換，已完成顯示刪除線

**UI 功能**
- 待辦列表篩選 Tab：全部 / 待完成 / 已完成，各顯示數量
- 登入/註冊頁面 Tab 切換（`LoginView`）
- 顯示登入使用者暱稱（`TodoPanel` Header）
- 路由守衛：未登入訪問 `/todo` 自動導向 `/login`；已登入訪問 `/login` 自動導向 `/todo`

**API 視覺化面板**
- `useApiClient` composable：統一封裝 fetch 請求，自動注入 JWT Token，含 300ms 階段延遲
- `apiVisualizerStore`：狀態機管理 API 請求生命週期（idle → sending → processing → responding → done/error）
- `ApiVisualizerPanel`：TodoView 右側深色面板，即時反映 API 請求狀態
- `EndpointDisplay`：顯示 HTTP method（色彩 badge）+ path + base URL
- `StatusIndicator`：phase 文字 + 動態閃爍圓點
- `RequestAnimation`：瀏覽器↔伺服器連線動畫（封包移動、伺服器旋轉 SVG）
- `RequestHistory`：最近 20 筆請求紀錄（method、path、status code、耗時 ms）

**型別系統**
- `src/types/todo.ts`：`Todo`、`CreateTodoPayload`、`UpdateTodoPayload`
- `src/types/auth.ts`：`LoginPayload`、`SignUpPayload`、`LoginResponse`、`SignUpResponse`、`CheckoutResponse`
- `src/types/api.ts`：`ApiRequestPhase`（union type）、`ApiRequestInfo`、`ApiResponse<T>`

**樣式**
- 引入 Tailwind CSS 4（`@import "tailwindcss"`）
- 自訂動畫：`animate-move-right`、`animate-move-left`、`animate-pulse-slow`、`animate-spin-slow`

---

## [0.0.0] - 2026-03-26

### 新增
- 初始化 Vue 3 + TypeScript + Vite 專案
- 設定 Pinia 狀態管理
- 設定 Vue Router（routes 待定義）
- 建立專案文件結構（CLAUDE.md、docs/）
- 加入六角學院 TodoList API Swagger 文件
