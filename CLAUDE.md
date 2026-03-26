# CLAUDE.md

## 專案概述
vite-todo-sample — 基於 Vue 3 + TypeScript + Vite 的待辦事項前端應用，串接六角學院 TodoList API

## 技術棧
- Vue 3.5 (Composition API + `<script setup>`)
- TypeScript 5.9
- Vite 7.3
- Pinia 3（狀態管理）
- Vue Router 5（路由）
- Tailwind CSS 4（樣式）
- 外部 API：`https://todolist-api.hexschool.io`（JWT 認證）

## 常用指令
```bash
npm run dev          # 啟動開發伺服器
npm run build        # 型別檢查 + 建構生產版本
npm run build-only   # 僅建構（不做型別檢查）
npm run preview      # 預覽生產版本
npm run type-check   # TypeScript 型別檢查
```

## 關鍵規則
- 使用 Composition API + `<script setup>` 語法，不使用 Options API
- 狀態管理統一使用 Pinia store，放在 `src/stores/`
- 路由設定集中在 `src/router/index.ts`
- API base URL：`https://todolist-api.hexschool.io`，需帶 JWT Token 於 header `authorization`
- 功能開發使用 docs/plans/ 記錄計畫；完成後移至 docs/plans/archive/

## 詳細文件
- ./docs/README.md — 項目介紹與快速開始
- ./docs/ARCHITECTURE.md — 架構、目錄結構、資料流
- ./docs/DEVELOPMENT.md — 開發規範、命名規則
- ./docs/FEATURES.md — 功能列表與完成狀態
- ./docs/TESTING.md — 測試規範與指南
- ./docs/CHANGELOG.md — 更新日誌
- ./docs/swagger_output.json — 六角學院 TodoList API Swagger 文件
