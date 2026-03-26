---
paths: []
---

# 安全性規則

- JWT Token 不可硬編碼在原始碼中，使用 store 或 localStorage 管理
- 使用者輸入必須在顯示前進行處理，避免 XSS（Vue 預設會 escape，但 `v-html` 須特別注意）
- 禁止使用 `v-html` 渲染使用者輸入的內容
- API 密鑰、token 等機密資訊不可 commit 至版本控制
- 密碼欄位使用 `type="password"`，不在前端 console 輸出密碼
- 登出時確實清除所有本地儲存的認證資訊（store + localStorage）
- CORS 相關問題由後端處理，前端不使用 proxy 繞過（除開發環境外）
