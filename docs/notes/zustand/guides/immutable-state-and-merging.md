---
title: 不可变状态和合并
createTime: 2025/06/15 17:52:18
permalink: /zustand/h7hlg1xz/
---

就像 React 的 `useState` 一样，我们需要以不可变的方式更新状态。

这是一个典型的例子：

```jsx
import { create } from 'zustand'

const useCountStore = create((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 })),
}))
```

`set` 函数用于更新 store 中的状态。
因为状态是不可变的，它应该是这样的：

```js
set((state) => ({ ...state, count: state.count + 1 }))
```

然而，由于这是一个常见模式，`set` 实际上会合并状态，
我们可以跳过 `...state` 部分：

```js
set((state) => ({ count: state.count + 1 }))
```

## 嵌套对象

`set` 函数只在一个级别合并状态。
如果你有嵌套对象，你需要显式地合并它们。你将使用展开运算符模式，如下所示：

```jsx
import { create } from 'zustand'

const useCountStore = create((set) => ({
  nested: { count: 0 },
  inc: () =>
    set((state) => ({
      nested: { ...state.nested, count: state.nested.count + 1 },
    })),
}))
```

对于复杂的用例，考虑使用一些帮助进行不可变更新的库。
你可以参考 [更新嵌套状态对象值](./updating-state.md#deeply-nested-object)。

## Replace 标志

要禁用合并行为，你可以为 `set` 指定一个 `replace` 布尔值，如下所示：

```js
set((state) => newState, true)
```
