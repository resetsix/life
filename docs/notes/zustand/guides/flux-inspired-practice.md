---
title: Flux 启发的实践
createTime: 2025/06/15 17:52:18
permalink: /zustand/juu2zw4w/
---

虽然 Zustand 是一个无固执己见的库，但我们确实推荐一些模式。
这些模式受到最初在 [Flux](https://github.com/facebookarchive/flux) 中发现的实践启发，
以及最近的 [Redux](https://redux.js.org/understanding/thinking-in-redux/three-principles)，
所以如果你来自另一个库，你应该感到宾至如归。

然而，Zustand 在一些基本方面确实有所不同，
所以一些术语可能不会与其他库完全一致。

## 推荐模式

### 单一 store

你的应用程序全局状态应该位于单个 Zustand store 中。

如果你有一个大型应用程序，Zustand 支持 [将 store 拆分为切片](./slices-pattern.md)。

### 使用 `set` / `setState` 更新 store

始终使用 `set`（或 `setState`）来执行对你的 store 的更新。
`set`（和 `setState`）确保所描述的更新被正确合并，并且监听器得到适当的通知。

### 将 store actions 放在一起

在 Zustand 中，状态可以在不使用其他 Flux 库中的分发 actions 和 reducers 的情况下更新。
这些 store actions 可以直接添加到 store 中，如下所示。

可选地，通过使用 `setState`，它们可以 [位于 store 外部](./practice-with-no-store-actions.md)

```js
const useBoundStore = create((set) => ({
  storeSliceA: ...,
  storeSliceB: ...,
  storeSliceC: ...,
  updateX: () => set(...),
  updateY: () => set(...),
}))
```

## Redux 风格的模式

如果你离不开 Redux 风格的 reducers，你可以在 store 的根级别定义一个 `dispatch` 函数：

```typescript
const types = { increase: 'INCREASE', decrease: 'DECREASE' }

const reducer = (state, { type, by = 1 }) => {
  switch (type) {
    case types.increase:
      return { grumpiness: state.grumpiness + by }
    case types.decrease:
      return { grumpiness: state.grumpiness - by }
  }
}

const useGrumpyStore = create((set) => ({
  grumpiness: 0,
  dispatch: (args) => set((state) => reducer(state, args)),
}))

const dispatch = useGrumpyStore((state) => state.dispatch)
dispatch({ type: types.increase, by: 2 })
```

你也可以使用我们的 redux 中间件。它连接你的主 reducer，设置初始状态，并向状态本身和 vanilla API 添加 dispatch 函数。

```typescript
import { redux } from 'zustand/middleware'

const useReduxStore = create(redux(reducer, initialState))
```

更新 store 的另一种方式可能是通过包装状态函数的函数。这些也可以处理 actions 的副作用。例如，使用 HTTP 调用。要以非响应式方式使用 Zustand，请参见 [readme](https://github.com/pmndrs/zustand#readingwriting-state-and-reacting-to-changes-outside-of-components)。
