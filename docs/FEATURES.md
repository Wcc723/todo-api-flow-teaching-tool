# 功能列表

## 功能總覽

| # | 功能 | 狀態 | 說明 |
|---|------|------|------|
| 1 | 使用者註冊 | 待開發 | 註冊新帳號（email + password + nickname） |
| 2 | 使用者登入 | 待開發 | 登入取得 JWT Token |
| 3 | 使用者登出 | 待開發 | 登出並清除 Token |
| 4 | Token 驗證 | 待開發 | 驗證 Token 有效性，自動登入 |
| 5 | 待辦事項列表 | 待開發 | 顯示所有待辦事項 |
| 6 | 新增待辦事項 | 待開發 | 新增一筆待辦事項 |
| 7 | 編輯待辦事項 | 待開發 | 更新待辦事項內容 |
| 8 | 刪除待辦事項 | 待開發 | 刪除指定待辦事項 |
| 9 | 切換完成狀態 | 待開發 | Toggle 待辦事項完成/未完成 |

---

## 功能詳細描述

### 1. 使用者註冊

**API：** `POST /users/sign_up`

**行為描述：**
- 使用者輸入 email、password、nickname 三個必填欄位
- 送出後呼叫 API 進行註冊
- 成功：回傳 `status: true` 和 `uid`，導向登入頁面
- 失敗：回傳 `status: false` 和 `message`（如「用戶已存在」），顯示錯誤訊息

**請求 Body：**
```json
{
  "email": "example@gmail.com",    // 必填，email 格式
  "password": "example",           // 必填
  "nickname": "example"            // 必填
}
```

**回應：**
- 201：`{ "status": true, "uid": "..." }`
- 400：`{ "status": false, "message": "用戶已存在" }`

---

### 2. 使用者登入

**API：** `POST /users/sign_in`

**行為描述：**
- 使用者輸入 email 和 password
- 成功：回傳 `token`（JWT）和 `exp`（過期時間），儲存至 store 和 localStorage，導向待辦事項頁面
- 失敗：根據錯誤類型顯示對應訊息

**請求 Body：**
```json
{
  "email": "example@gmail.com",    // 必填
  "password": "example"            // 必填
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

**行為描述：**
- 呼叫 API 登出，無論成功失敗都清除本地 token
- 導向登入頁面

**回應：**
- 200：`{ "status": true, "message": "登出成功" }`
- 400：`{ "status": false, "message": "登出失敗" }`

---

### 4. Token 驗證

**API：** `GET /users/checkout`（需認證）

**行為描述：**
- 應用啟動時或路由切換時，檢查 localStorage 中的 token 是否仍有效
- 有效：允許進入需認證頁面
- 無效：清除 token，導向登入頁面

**回應：**
- 200：`{ "status": true, "uid": "..." }`
- 400：`{ "status": false, "message": "該 Token 不存在" }`

---

### 5. 待辦事項列表

**API：** `GET /todos/`（需認證）

**行為描述：**
- 進入待辦事項頁面時自動載入所有待辦事項
- 每筆待辦包含 `id`、`createTime`、`content`、`status`
- `status: false` 為未完成，`status: true` 為已完成
- 可考慮依狀態分類顯示（全部/待完成/已完成）

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

**行為描述：**
- 使用者輸入待辦事項內容，點擊新增
- 成功：回傳新建立的 todo 物件（含 `id`），加入列表
- 失敗：顯示錯誤訊息
- 輸入欄位不可為空

**請求 Body：**
```json
{
  "content": "買晚餐"    // 必填，待辦事項內容
}
```

**回應：**
- 201：`{ "status": true, "newTodo": { "id": "...", "createTime": ..., "content": "...", "status": false } }`
- 400：`{ "status": false, "message": "新增失敗" }`

---

### 7. 編輯待辦事項

**API：** `PUT /todos/{id}`（需認證）

**行為描述：**
- 使用者可編輯既有待辦事項的內容文字
- 進入編輯模式 → 修改內容 → 確認送出
- 成功：更新列表中對應項目的 content

**請求 Body：**
```json
{
  "content": "買早餐"    // 必填，更新後的內容
}
```

**回應：**
- 200：`{ "status": true, "message": "更新成功" }`
- 400：`{ "status": false, "message": "更新失敗" }`

---

### 8. 刪除待辦事項

**API：** `DELETE /todos/{id}`（需認證）

**行為描述：**
- 使用者點擊刪除按鈕，移除指定待辦事項
- 建議加上確認提示，避免誤刪
- 成功：從列表移除該項目

**回應：**
- 200：`{ "status": true, "message": "刪除成功" }`
- 400：`{ "status": false, "message": "刪除失敗" }`

---

### 9. 切換完成狀態

**API：** `PATCH /todos/{id}/toggle`（需認證）

**行為描述：**
- 使用者點擊 checkbox 或切換按鈕，toggle 待辦事項的完成狀態
- `false` → `true`（標記為已完成）
- `true` → `false`（標記為未完成）
- 成功：更新列表中對應項目的 status

**回應：**
- 200：`{ "status": true, "message": "狀態更新成功" }`
- 400：`{ "status": false, "message": "狀態更新失敗" }`
