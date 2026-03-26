# 測試規範

## 目前狀態

專案尚未設定測試框架。以下為建議的測試規範，供後續導入時參考。

## 建議測試框架

| 類別 | 工具 | 說明 |
|------|------|------|
| 單元測試 | Vitest | 與 Vite 原生整合，速度快 |
| 元件測試 | @vue/test-utils + Vitest | Vue 元件掛載與互動測試 |
| E2E 測試 | Cypress 或 Playwright | 端對端瀏覽器測試 |

## 安裝指南（未來導入時）

```bash
# 安裝 Vitest + Vue Test Utils
npm install -D vitest @vue/test-utils happy-dom

# 安裝 E2E（擇一）
npm install -D cypress
# 或
npm install -D @playwright/test
```

### Vitest 設定

在 `vite.config.ts` 中加入：

```typescript
/// <reference types="vitest" />
export default defineConfig({
  // ... 既有設定
  test: {
    environment: 'happy-dom',
    globals: true,
  },
})
```

在 `package.json` 加入 scripts：

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

## 測試目錄結構

```
src/
├── components/
│   ├── TodoItem.vue
│   └── __tests__/
│       └── TodoItem.spec.ts       # 元件測試放在同層 __tests__/
├── stores/
│   ├── todo.ts
│   └── __tests__/
│       └── todo.spec.ts           # Store 測試
└── composables/
    ├── useAuth.ts
    └── __tests__/
        └── useAuth.spec.ts        # Composable 測試
```

## 測試撰寫規範

### 命名規則

- 測試檔案：`{被測檔名}.spec.ts`
- describe：描述被測試的單元名稱
- it/test：描述預期行為，使用「should...」格式

### 範例

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoItem from '../TodoItem.vue'

describe('TodoItem', () => {
  it('should render todo content', () => {
    const wrapper = mount(TodoItem, {
      props: { content: '買晚餐', status: false }
    })
    expect(wrapper.text()).toContain('買晚餐')
  })

  it('should emit toggle event when checkbox clicked', async () => {
    const wrapper = mount(TodoItem, {
      props: { id: '1', content: '買晚餐', status: false }
    })
    await wrapper.find('input[type="checkbox"]').trigger('change')
    expect(wrapper.emitted('toggle')).toBeTruthy()
  })
})
```

### Pinia Store 測試

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTodoStore } from '../todo'

describe('useTodoStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should start with empty todos', () => {
    const store = useTodoStore()
    expect(store.todos).toEqual([])
  })
})
```

## 注意事項

- API 呼叫在單元測試中應 mock，避免依賴外部服務
- 六角學院 API 資料每日凌晨 1:15 清除，E2E 測試需考慮此限制
- 測試環境使用 `happy-dom`（比 jsdom 更快）
- 元件測試應覆蓋：渲染、props 傳入、事件觸發、條件渲染
