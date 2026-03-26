---
paths: []
---

# Git Commit 規則

- Commit message 格式：`type: 描述`（中英文皆可）
- 常用 type：
  - `feat`: 新功能
  - `fix`: 修復 bug
  - `refactor`: 重構（不影響功能）
  - `style`: 格式調整（不影響程式邏輯）
  - `docs`: 文件更新
  - `test`: 測試相關
  - `chore`: 建構/工具/依賴更新
- 描述簡潔，說明「為什麼」而非「做了什麼」
- 禁止 commit 的檔案：`.env`、`.env.local`、`node_modules/`、`dist/`、`*.sqlite`
- 每次 commit 保持單一職責，不混合不相關的變更
