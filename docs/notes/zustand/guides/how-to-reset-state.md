---
title: 如何重置状态
createTime: 2025/06/15 17:52:18
permalink: /zustand/lmy25a9a/
---

以下模式可用于将状态重置为其初始值。

```ts
import { create } from 'zustand'

// 分别定义状态值和 actions 的类型
type State = {
  salmon: number
  tuna: number
}

type Actions = {
  addSalmon: (qty: number) => void
  addTuna: (qty: number) => void
  reset: () => void
}

// 定义初始状态
const initialState: State = {
  salmon: 0,
  tuna: 0,
}

// 创建 store
const useSlice = create<State & Actions>()((set, get) => ({
  ...initialState,
  addSalmon: (qty: number) => {
    set({ salmon: get().salmon + qty })
  },
  addTuna: (qty: number) => {
    set({ tuna: get().tuna + qty })
  },
  reset: () => {
    set(initialState)
  },
}))
```

一次重置多个 stores

```ts
import type { StateCreator } from 'zustand'
import { create: actualCreate } from 'zustand'

const storeResetFns = new Set<() => void>()

const resetAllStores = () => {
  storeResetFns.forEach((resetFn) => {
    resetFn()
  })
}

export const create = (<T>() => {
  return (stateCreator: StateCreator<T>) => {
    const store = actualCreate(stateCreator)
    const initialState = store.getInitialState()
    storeResetFns.add(() => {
      store.setState(initialState, true)
    })
    return store
  }
}) as typeof actualCreate
```

## CodeSandbox 演示

- 基础版: https://codesandbox.io/s/zustand-how-to-reset-state-basic-demo-rrqyon
- 高级版: https://codesandbox.io/s/zustand-how-to-reset-state-advanced-demo-gtu0qe
- Immer 版: https://codesandbox.io/s/how-to-reset-state-advance-immer-demo-nyet3f
