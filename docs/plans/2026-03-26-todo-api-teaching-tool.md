# Todo List API 教學工具 — 實作計畫

## Context

本專案要建構一個教學用 Todo List 工具，核心目的是讓學生「了解 API 的運作」。畫面左側為 Todo 功能本體，右側為 API 運作視覺化面板，即時顯示每個 API 請求的端點、進度、本地/遠端狀態動畫。專案目前是空白 Vue 3 + TypeScript + Vite 模板，需從零建構。

---

## 目錄結構

```
src/
├── main.ts                           # 入口，引入 Tailwind CSS
├── App.vue                           # 根元件，<RouterView />
├── assets/
│   └── main.css                      # Tailwind v4 入口 + 自訂動畫 keyframes
├── types/
│   ├── todo.ts                       # Todo, CreateTodoPayload, UpdateTodoPayload
│   ├── auth.ts                       # LoginPayload, SignUpPayload, AuthResponse
│   └── api.ts                        # ApiRequestPhase, ApiRequestInfo, ApiResponse<T>
├── composables/
│   └── useApiClient.ts               # 核心：封裝 fetch + 延遲 + 視覺化串接
├── stores/
│   ├── apiVisualizer.ts              # API 請求生命週期狀態機
│   ├── auth.ts                       # 認證 (token, login, signUp, logout)
│   └── todo.ts                       # Todo CRUD
├── router/
│   └── index.ts                      # /login + /todo 路由 + 守衛
├── views/
│   ├── LoginView.vue                 # 登入/註冊（tab 切換）
│   └── TodoView.vue                  # 主頁：左右分欄
├── components/
│   ├── todo/
│   │   ├── TodoInput.vue             # 新增輸入框
│   │   ├── TodoItem.vue              # 單一待辦（toggle, edit, delete）
│   │   ├── TodoList.vue              # 列表 + 篩選 tab
│   │   └── TodoPanel.vue             # 左側容器
│   └── visualizer/
│       ├── ApiVisualizerPanel.vue    # 右側面板容器
│       ├── EndpointDisplay.vue       # method badge + path + base URL
│       ├── RequestAnimation.vue      # 瀏覽器 ↔ 伺服器動畫
│       ├── StatusIndicator.vue       # 狀態圓點 + 文字
│       └── RequestHistory.vue        # 歷史請求列表
```

---

## 核心架構：API 視覺化

### 狀態機

```
idle → sending → processing → responding → done
                                         → error
```

### 資料流

```
[Todo/Auth 元件操作]
  → [store action]
  → [useApiClient.request()]
    → apiVisualizer.startRequest()    // phase: sending
    → delay(300ms)
    → fetch()                         // 實際 HTTP 請求
    → apiVisualizer.setPhase('processing')
    → delay(300ms)
    → parse response
    → apiVisualizer.setPhase('responding')
    → delay(300ms)
    → apiVisualizer.completeRequest() // phase: done/error
  → [ApiVisualizerPanel 響應式渲染]
```

### 動畫對應

| Phase | 左側（瀏覽器） | 中間連線 | 右側（伺服器） |
|-------|-------------|---------|-------------|
| idle | 灰色 | 虛線 | 灰色 |
| sending | 高亮脈動 | 封包從左→右移動 | 灰色 |
| processing | 正常 | 實線 | 高亮 + 齒輪旋轉 |
| responding | 灰色 | 封包從右→左移動 | 高亮 |
| done | 短暫變綠 ✓ | 綠色實線 | 短暫變綠 ✓ |
| error | 紅色 | 紅色虛線 | 紅色 ✗ |

---

## 實作步驟

### Phase 0：基礎設施
- 安裝 `tailwindcss` + `@tailwindcss/vite`（使用 pnpm）
- 更新 `vite.config.ts` 加入 tailwindcss plugin
- 建立 `src/assets/main.css`（`@import "tailwindcss"` + 自訂 keyframes）
- 更新 `src/main.ts` 引入 CSS
- 建立所有目錄
- 刪除 `stores/counter.ts`

### Phase 1：型別定義
- `types/todo.ts`、`types/auth.ts`、`types/api.ts`

### Phase 2：核心 Store + Composable
- `stores/apiVisualizer.ts` — 請求生命週期狀態管理
- `composables/useApiClient.ts` — 封裝 fetch + 延遲 + 視覺化
- `stores/auth.ts` — 認證（token 存 localStorage）
- `stores/todo.ts` — CRUD（透過 useApiClient）

### Phase 3：路由 + 認證
- 更新 `router/index.ts`（登入、Todo 頁、路由守衛）
- 建立 `views/LoginView.vue`（登入/註冊 tab 切換）
- 更新 `App.vue`

### Phase 4：Todo 元件
- TodoInput → TodoItem → TodoList → TodoPanel

### Phase 5：API 視覺化元件
- EndpointDisplay → StatusIndicator → RequestAnimation → RequestHistory → ApiVisualizerPanel

### Phase 6：主頁整合
- `views/TodoView.vue`（grid 左右分欄）

### Phase 7：收尾
- Loading 狀態防重複點擊
- Error 訊息顯示
- 調校動畫時間
- 更新 `<title>`

---

## 關鍵設計決策

1. **原生 fetch**（不用 axios）— 教學目的，讓學生看到最原始的 HTTP 行為
2. **0.3s 人工延遲** — 插入 composable 而非 store，保持關注點分離
3. **SVG 內嵌圖示** — 不引入圖示庫，減少教學複雜度
4. **Tailwind v4 CSS-first** — 不需 config 檔，自訂動畫用 `@theme`
5. **Method badge 配色** — GET=藍、POST=綠、PUT=橘、DELETE=紅、PATCH=紫（Swagger 風格）
6. **登入頁含註冊** — Tab 切換，學生需先註冊帳號

---

## 需安裝套件

```bash
pnpm add tailwindcss @tailwindcss/vite
```

---

## 關鍵檔案

| 檔案 | 角色 |
|------|------|
| `src/composables/useApiClient.ts` | 整個視覺化架構樞紐 |
| `src/stores/apiVisualizer.ts` | 狀態機，驅動所有視覺化元件 |
| `src/components/visualizer/RequestAnimation.vue` | 核心動畫 |
| `src/types/api.ts` | 共用型別契約 |
| `vite.config.ts` | 需加入 Tailwind plugin |

---

## 驗證方式

1. `pnpm dev` 啟動開發伺服器
2. 進入登入頁 → 註冊帳號 → 登入，觀察右側面板顯示 API 呼叫動畫
3. 新增/編輯/刪除/toggle 待辦事項，確認每個操作都有對應的視覺化
4. 確認請求歷史列表正確記錄
5. `pnpm type-check` 確認 TypeScript 無錯誤
6. `pnpm build` 確認建構成功
