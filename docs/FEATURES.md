# 功能列表

## 功能總覽

| # | 功能 | 狀態 | 說明 |
|---|------|------|------|
| 1 | 使用者註冊 | 已完成 | 註冊新帳號（email + password + nickname） |
| 2 | 使用者登入 | 已完成 | 登入取得 JWT Token |
| 3 | 使用者登出 | 已完成 | 登出並清除 Token |
| 4 | Token 驗證 | 已完成 | 驗證 Token 有效性，自動登入 |
| 5 | 待辦事項列表 | 已完成 | 顯示所有待辦事項，支援全部/待完成/已完成篩選 |
| 6 | 新增待辦事項 | 已完成 | 新增一筆待辦事項 |
| 7 | 編輯待辦事項 | 已完成 | 更新待辦事項內容（行內雙擊編輯） |
| 8 | 刪除待辦事項 | 已完成 | 刪除指定待辦事項 |
| 9 | 切換完成狀態 | 已完成 | Toggle 待辦事項完成/未完成 |
| 10 | API 視覺化面板 | 已完成 | 即時顯示 API 請求生命週期（狀態機動畫） |

---

## 功能詳細描述

### 1. 使用者註冊

**API：** `POST /users/sign_up`

**實作位置：** `src/stores/auth.ts` → `signUp()`，`src/views/LoginView.vue`

**行為描述：**
- 使用者輸入 email、password、nickname 三個必填欄位
- 送出後呼叫 API 進行註冊
- 成功：切換至登入 Tab，清除密碼欄位
- 失敗：回傳 `status: false` 和 `message`（如「用戶已存在」），顯示錯誤訊息

**請求 Body：**
```json
{
  "email": "example@gmail.com",
  "password": "example",
  "nickname": "example"
}
```

**回應：**
- 201：`{ "status": true, "uid": "..." }`
- 400：`{ "status": false, "message": "用戶已存在" }`

---

### 2. 使用者登入

**API：** `POST /users/sign_in`

**實作位置：** `src/stores/auth.ts` → `login()`，`src/views/LoginView.vue`

**行為描述：**
- 使用者輸入 email 和 password
- 成功：回傳 `token`（JWT）和 `exp`（過期時間），token 儲存至 authStore 和 localStorage，導向 `/todo`
- 失敗：根據錯誤類型顯示對應訊息

**請求 Body：**
```json
{
  "email": "example@gmail.com",
  "password": "example"
}
```

**回應：**
- 200：`{ "status": true, "exp": 1234567890, "token": "..." }`
- 400：`{ "status": false, "message": "欄位驗證失敗" }`
- 401：`{ "status": false, "message": "帳號密碼驗證錯誤" }`
- 404：`{ "status": false, "message": "用戶不存在" }`

---

### 3. 使用者登出

**API：** `POST /users/sign_out`（需認證）

**實作位置：** `src/stores/auth.ts` → `logout()`，`src/components/todo/TodoPanel.vue`

**行為描述：**
- 點擊登出按鈕，呼叫 API 登出
- 無論 API 成功或失敗，皆呼叫 `clearAuth()` 清除 store 和 localStorage 中的 token/nickname
- 導向 `/login`

**回應：**
- 200：`{ "status": true, "message": "登出成功" }`
- 400：`{ "status": false, "message": "登出失敗" }`

---

### 4. Token 驗證

**API：** `GET /users/checkout`（需認證）

**實作位置：** `src/stores/auth.ts` → `checkToken()`

**行為描述：**
- 呼叫 API 驗證目前儲存的 token 是否仍有效
- 有效：回傳 `true`，允許存取需認證資源
- 無效：呼叫 `clearAuth()` 清除本地認證資訊，回傳 `false`
- 路由層級的認證保護由 `router.beforeEach` 配合 `authStore.isLoggedIn` 處理

**回應：**
- 200：`{ "status": true, "uid": "..." }`
- 400：`{ "status": false, "message": "該 Token 不存在" }`

---

### 5. 待辦事項列表

**API：** `GET /todos/`（需認證）

**實作位置：** `src/stores/todo.ts` → `fetchTodos()`，`src/components/todo/TodoList.vue`

**行為描述：**
- `TodoPanel` mount 時自動呼叫 `fetchTodos()` 載入所有待辦事項
- 每次 CRUD 操作成功後自動重新呼叫 `fetchTodos()` 同步最新資料
- 支援三個篩選 Tab（全部 / 待完成 / 已完成），顯示各分類數量
- `isLoading` 狀態控制載入中提示

**回應資料結構：**
```json
{
  "status": true,
  "data": [
    {
      "id": "123456789",
      "createTime": 1620281234,
      "content": "買晚餐",
      "status": false
    }
  ]
}
```

---

### 6. 新增待辦事項

**API：** `POST /todos/`（需認證）

**實作位置：** `src/stores/todo.ts` → `addTodo()`，`src/components/todo/TodoInput.vue`

**行為描述：**
- 使用者在輸入框輸入內容，按下「新增」按鈕或 Enter 鍵送出
- 輸入為空時按鈕 disabled，不可送出
- 成功：重新取得列表（`fetchTodos()`）更新顯示

**請求 Body：**
```json
{
  "content": "買晚餐"
}
```

**回應：**
- 201：`{ "status": true, "newTodo": { "id": "...", "createTime": ..., "content": "...", "status": false } }`
- 400：`{ "status": false, "message": "新增失敗" }`

---

### 7. 編輯待辦事項

**API：** `PUT /todos/{id}`（需認證）

**實作位置：** `src/stores/todo.ts` → `updateTodo()`，`src/components/todo/TodoItem.vue`

**行為描述：**
- 滑鼠移過待辦項目時顯示「編輯」按鈕；也可雙擊內容文字進入編輯模式
- 進入 `isEditing` 模式後顯示輸入框，可按 Enter 儲存或 Escape 取消
- 儲存時若內容與原始相同則不送出 API，直接關閉編輯模式
- 成功：重新取得列表更新顯示

**請求 Body：**
```json
{
  "content": "買早餐"
}
```

**回應：**
- 200：`{ "status": true, "message": "更新成功" }`
- 400：`{ "status": false, "message": "更新失敗" }`

---

### 8. 刪除待辦事項

**API：** `DELETE /todos/{id}`（需認證）

**實作位置：** `src/stores/todo.ts` → `deleteTodo()`，`src/components/todo/TodoItem.vue`

**行為描述：**
- 滑鼠移過待辦項目時顯示「刪除」按鈕
- 點擊後直接呼叫 API 刪除（無二次確認提示）
- 成功：重新取得列表移除該項目

**回應：**
- 200：`{ "status": true, "message": "刪除成功" }`
- 400：`{ "status": false, "message": "刪除失敗" }`

---

### 9. 切換完成狀態

**API：** `PATCH /todos/{id}/toggle`（需認證）

**實作位置：** `src/stores/todo.ts` → `toggleTodo()`，`src/components/todo/TodoItem.vue`

**行為描述：**
- 使用者點擊待辦項目前方的 checkbox 切換完成狀態
- `false` → `true`（標記為已完成，文字顯示刪除線）
- `true` → `false`（標記為未完成）
- 成功：重新取得列表更新顯示

**回應：**
- 200：`{ "status": true, "message": "狀態更新成功" }`
- 400：`{ "status": false, "message": "狀態更新失敗" }`

---

### 10. API 視覺化面板

**實作位置：** `src/stores/apiVisualizer.ts`、`src/composables/useApiClient.ts`、`src/components/visualizer/`

**行為描述：**

TodoView 採用左右分欄佈局：左側為 TodoPanel，右側為 ApiVisualizerPanel（深色背景）。

每次 API 請求時，`useApiClient` composable 驅動 `apiVisualizerStore` 狀態機，視覺化面板即時反映：

| 子元件 | 功能 |
|--------|------|
| `EndpointDisplay` | 顯示 HTTP method（色彩標示）+ path + base URL |
| `StatusIndicator` | 顯示目前 phase 文字（含動態閃爍圓點） |
| `RequestAnimation` | 瀏覽器↔伺服器連線動畫（封包移動、伺服器旋轉） |
| `ApiVisualizerPanel` | 顯示回應 JSON 預覽（成功綠色/錯誤紅色） |
| `RequestHistory` | 最近 20 筆請求紀錄（method、path、status code、耗時 ms） |

**Phase 狀態對應：**

| Phase | 視覺效果 |
|-------|---------|
| `idle` | 灰色，等待請求 |
| `sending` | 藍色脈衝，封包從瀏覽器往伺服器移動 |
| `processing` | 黃色，伺服器圖示旋轉 |
| `responding` | 綠色，封包從伺服器往瀏覽器移動 |
| `done` | 綠色，顯示回應內容 |
| `error` | 紅色，顯示錯誤訊息 |
