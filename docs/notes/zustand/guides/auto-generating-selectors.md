---
title: 自动生成选择器
createTime: 2025/06/15 17:52:18
permalink: /zustand/d0tmw48q/
---

我们建议在使用 store 中的属性或 actions 时使用选择器。你可以这样从 store 中访问值：

```typescript
const bears = useBearStore((state) => state.bears)
```

然而，编写这些可能很繁琐。如果你遇到这种情况，可以自动生成选择器。

## 创建以下函数：`createSelectors`

```typescript
import { StoreApi, UseBoundStore } from 'zustand'

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (const k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }

  return store
}
```

如果你有这样的 store：

```typescript
interface BearState {
  bears: number
  increase: (by: number) => void
  increment: () => void
}

const useBearStoreBase = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
  increment: () => set((state) => ({ bears: state.bears + 1 })),
}))
```

将该函数应用到你的 store：

```typescript
const useBearStore = createSelectors(useBearStoreBase)
```

现在选择器已自动生成，你可以直接访问它们：

```typescript
// 获取属性
const bears = useBearStore.use.bears()

// 获取 action
const increment = useBearStore.use.increment()
```

## Vanilla Store

如果你使用的是 vanilla store，请使用以下 `createSelectors` 函数：

```typescript
import { StoreApi, useStore } from 'zustand'

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

const createSelectors = <S extends StoreApi<object>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (const k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () =>
      useStore(_store, (s) => s[k as keyof typeof s])
  }

  return store
}
```

用法与 React store 相同。如果你有这样的 store：

```typescript
import { createStore } from 'zustand'

interface BearState {
  bears: number
  increase: (by: number) => void
  increment: () => void
}

const store = createStore<BearState>((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
  increment: () => set((state) => ({ bears: state.bears + 1 })),
}))
```

将该函数应用到你的 store：

```typescript
const useBearStore = createSelectors(store)
```

现在选择器已自动生成，你可以直接访问它们：

```typescript
// 获取属性
const bears = useBearStore.use.bears()

// 获取 action
const increment = useBearStore.use.increment()
```

## 在线演示

有关此功能的工作示例，请参见 [Code Sandbox](https://codesandbox.io/s/zustand-auto-generate-selectors-forked-rl8v5e?file=/src/selectors.ts)。

## 第三方库

- [auto-zustand-selectors-hook](https://github.com/Albert-Gao/auto-zustand-selectors-hook)
- [react-hooks-global-state](https://github.com/dai-shi/react-hooks-global-state)
- [zustood](https://github.com/udecode/zustood)
- [@davstack/store](https://github.com/DawidWraga/davstack)
