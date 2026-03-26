# vite-todo-sample

基於 Vue 3 + TypeScript + Vite 的待辦事項（TodoList）前端應用，串接六角學院 TodoList API 進行使用者認證與待辦事項 CRUD 操作。

## 技術棧

| 類別 | 技術 | 版本 |
|------|------|------|
| 框架 | Vue | 3.5 |
| 語言 | TypeScript | 5.9 |
| 建構工具 | Vite | 7.3 |
| 狀態管理 | Pinia | 3 |
| 路由 | Vue Router | 5 |
| 外部 API | 六角學院 TodoList API | — |

## 快速開始

### 環境需求
- Node.js `^20.19.0` 或 `>=22.12.0`
- npm（隨 Node.js 安裝）

### 安裝與啟動

```bash
# 1. 複製專案
git clone <repo-url>
cd vite-todo-sample

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器
npm run dev
```

開發伺服器啟動後，瀏覽器開啟 `http://localhost:5173`。

### 建構生產版本

```bash
# 型別檢查 + 建構
npm run build

# 預覽生產版本
npm run preview
```

## 常用指令

| 指令 | 說明 |
|------|------|
| `npm run dev` | 啟動 Vite 開發伺服器（HMR） |
| `npm run build` | 執行 type-check 後建構生產版本 |
| `npm run build-only` | 僅建構，不做型別檢查 |
| `npm run preview` | 預覽 dist/ 生產版本 |
| `npm run type-check` | 使用 vue-tsc 執行 TypeScript 型別檢查 |

## 外部 API

本專案串接六角學院 TodoList API：
- Base URL：`https://todolist-api.hexschool.io`
- 認證方式：JWT Token（放在 header `authorization`）
- API 文件：`docs/swagger_output.json`
- 注意：API 資料會在每日凌晨 1:15 清除

## 文件索引

| 文件 | 說明 |
|------|------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 架構、目錄結構、資料流 |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | 開發規範、命名規則 |
| [FEATURES.md](./FEATURES.md) | 功能列表與完成狀態 |
| [TESTING.md](./TESTING.md) | 測試規範與指南 |
| [CHANGELOG.md](./CHANGELOG.md) | 更新日誌 |
| [swagger_output.json](./swagger_output.json) | 六角學院 TodoList API Swagger 文件 |
