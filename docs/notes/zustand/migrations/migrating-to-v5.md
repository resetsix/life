---
title: 如何从 v4 迁移到 v5
createTime: 2025/06/15 17:52:18
permalink: /zustand/ye98is23/
---

# 如何从 v4 迁移到 v5

我们强烈建议在迁移到 v5 之前更新到 v4 的最新版本。它会显示所有弃用警告而不会破坏你的应用。

## v5 中的变更

- 移除默认导出
- 移除已弃用的功能
- 将 React 18 作为最低要求版本
- 将 use-sync-external-store 作为对等依赖（`zustand/traditional` 中的 `createWithEqualityFn` 和 `useStoreWithEqualityFn` 需要）
- 将 TypeScript 4.5 作为最低要求版本
- 移除 UMD/SystemJS 支持
- 在 package.json 中组织入口点
- 移除 ES5 支持
- 当 setState 的 replace 标志设置时更严格的类型
- Persist 中间件行为变更
- 其他小改进（技术上的破坏性变更）

## 迁移指南

### 使用自定义等价函数如 `shallow`

v5 中的 `create` 函数不支持自定义等价函数。

如果你使用自定义等价函数如 `shallow`，
最简单的迁移是使用 `createWithEqualityFn`。

```js
// v4
import { create } from 'zustand'
import { shallow } from 'zustand/shallow'

const useCountStore = create((set) => ({
  count: 0,
  text: 'hello',
  // ...
}))

const Component = () => {
  const { count, text } = useCountStore(
    (state) => ({
      count: state.count,
      text: state.text,
    }),
    shallow,
  )
  // ...
}
```

在 v5 中可以使用 `createWithEqualityFn` 来实现：

```bash
npm install use-sync-external-store
```

```js
// v5
import { createWithEqualityFn as create } from 'zustand/traditional'

// 其余部分与 v4 相同
```

或者，对于 `shallow` 用例，你可以使用 `useShallow` hook：

```js
// v5
import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'

const useCountStore = create((set) => ({
  count: 0,
  text: 'hello',
  // ...
}))

const Component = () => {
  const { count, text } = useCountStore(
    useShallow((state) => ({
      count: state.count,
      text: state.text,
    })),
  )
  // ...
}
```

### 要求稳定的选择器输出

v5 中有一个行为变更以匹配 React 默认行为。
如果选择器返回一个新引用，可能会导致无限循环。

例如，这可能会导致无限循环。

```js
// v4
const [searchValue, setSearchValue] = useStore((state) => [
  state.searchValue,
  state.setSearchValue,
])
```

错误消息会是这样的：

```plaintext
Uncaught Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.
```

要修复它，使用 `useShallow` hook，它会返回一个稳定的引用。

```js
// v5
import { useShallow } from 'zustand/shallow'

const [searchValue, setSearchValue] = useStore(
  useShallow((state) => [state.searchValue, state.setSearchValue]),
)
```

这是另一个可能导致无限循环的例子。

```js
// v4
const action = useMainStore((state) => {
  return state.action ?? () => {}
})
```

要修复它，确保选择器函数返回一个稳定的引用。

```js
// v5

const FALLBACK_ACTION = () => {}

const action = useMainStore((state) => {
  return state.action ?? FALLBACK_ACTION
})
```

或者，如果你需要 v4 行为，`createWithEqualityFn` 可以做到。

```js
// v5
import { createWithEqualityFn as create } from 'zustand/traditional'
```

### 当 setState 的 replace 标志设置时更严格的类型（仅 TypeScript）

```diff
- setState:
-   (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean | undefined) => void;
+ setState:
+   (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: false) => void;
+   (state: T | ((state: T) => T), replace: true) => void;
```

如果你没有使用 `replace` 标志，不需要迁移。

如果你使用 `replace` 标志并且设置为 `true`，你必须提供一个完整的状态对象。
这个变更确保 `store.setState({}, true)`（会导致无效状态）不再被认为是有效的。

**示例：**

```ts
// 部分状态更新（有效）
store.setState({ key: 'value' })

// 完整状态替换（有效）
store.setState({ key: 'value' }, true)

// 不完整状态替换（无效）
store.setState({}, true) // 错误
```

#### 处理动态 `replace` 标志

如果 `replace` 标志的值是动态的并在运行时确定，你可能会遇到问题。要处理这个问题，你可以使用一个解决方案，通过用 `setState` 函数的参数注释 `replace` 参数：

```ts
const replaceFlag = Math.random() > 0.5
const args = [{ bears: 5 }, replaceFlag] as Parameters<
  typeof useBearStore.setState
>
store.setState(...args)
```

#### Persist 中间件不再在 store 创建时存储项目

以前，`persist` 中间件在 store 创建期间存储初始状态。这个行为在 v5（和 v4.5.5）中已被移除。

例如，在以下代码中，初始状态存储在存储中。

```js
// v4
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCountStore = create(
  persist(
    () => ({
      count: Math.floor(Math.random() * 1000),
    }),
    {
      name: 'count',
    },
  ),
)
```

在 v5 中，这不再是这种情况，你需要在 store 创建后显式设置状态。

```js
// v5
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCountStore = create(
  persist(
    () => ({
      count: 0,
    }),
    {
      name: 'count',
    },
  ),
)
useCountStore.setState({
  count: Math.floor(Math.random() * 1000),
})
```

## 链接

- https://github.com/pmndrs/zustand/pull/2138
- https://github.com/pmndrs/zustand/pull/2580
