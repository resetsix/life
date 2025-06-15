---
title: 切片模式
createTime: 2025/06/15 17:52:18
permalink: /zustand/xjvjdi16/
---

## 将 store 切分为更小的 stores

随着你添加更多功能，你的 store 可能会变得越来越大，越来越难以维护。

你可以将主 store 分割为更小的独立 stores 来实现模块化。这在 Zustand 中很容易实现！

第一个独立的 store：

```js
export const createFishSlice = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
})
```

另一个独立的 store：

```js
export const createBearSlice = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
})
```

现在你可以将两个 stores 组合成 **一个绑定的 store**：

```js
import { create } from 'zustand'
import { createBearSlice } from './bearSlice'
import { createFishSlice } from './fishSlice'

export const useBoundStore = create((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
}))
```

### 在 React 组件中使用

```jsx
import { useBoundStore } from './stores/useBoundStore'

function App() {
  const bears = useBoundStore((state) => state.bears)
  const fishes = useBoundStore((state) => state.fishes)
  const addBear = useBoundStore((state) => state.addBear)
  return (
    <div>
      <h2>熊的数量: {bears}</h2>
      <h2>鱼的数量: {fishes}</h2>
      <button onClick={() => addBear()}>添加一只熊</button>
    </div>
  )
}

export default App
```

### 更新多个 stores

你可以在单个函数中同时更新多个 stores。

```js
export const createBearFishSlice = (set, get) => ({
  addBearAndFish: () => {
    get().addBear()
    get().addFish()
  },
})
```

将所有 stores 组合在一起与之前相同。

```js
import { create } from 'zustand'
import { createBearSlice } from './bearSlice'
import { createFishSlice } from './fishSlice'
import { createBearFishSlice } from './createBearFishSlice'

export const useBoundStore = create((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
  ...createBearFishSlice(...a),
}))
```

## 添加中间件

向组合的 store 添加中间件与其他普通 stores 相同。

向我们的 `useBoundStore` 添加 `persist` 中间件：

```js
import { create } from 'zustand'
import { createBearSlice } from './bearSlice'
import { createFishSlice } from './fishSlice'
import { persist } from 'zustand/middleware'

export const useBoundStore = create(
  persist(
    (...a) => ({
      ...createBearSlice(...a),
      ...createFishSlice(...a),
    }),
    { name: 'bound-store' },
  ),
)
```

请记住，你应该只在组合的 store 中应用中间件。在单独的切片中应用它们可能导致意外问题。

## 与 TypeScript 一起使用

关于如何在 Zustand 中使用 TypeScript 的切片模式的详细指南可以在 [这里](./typescript.md#slices-pattern) 找到。
