---
title: devtools
description: 如何时间旅行调试你的 store
createTime: 2025/06/15 17:52:18
permalink: /zustand/7juum7h4/
---

# devtools

`devtools` 中间件让你可以在不使用 Redux 的情况下使用 [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)。阅读更多关于使用 [Redux DevTools 进行调试的好处](https://redux.js.org/style-guide/#use-the-redux-devtools-extension-for-debugging)。

> [!IMPORTANT]
> 为了使用 `zustand/middleware` 中的 `devtools`，你需要安装 `@redux-devtools/extension` 库。

```js
const nextStateCreatorFn = devtools(stateCreatorFn, devtoolsOptions)
```

- [类型](#类型)
  - [签名](#签名)
  - [变更器](#变更器)
- [参考](#参考)
- [用法](#用法)
  - [调试 store](#调试-store)
  - [调试基于切片模式的 store](#调试基于切片模式的-store)
  - [清理](#清理)
- [故障排除](#故障排除)
  - [只显示一个 store](#只显示一个-store)
  - [所有 action 名称都标记为 'anonymous'](#所有-action-名称都标记为-anonymous)

## 类型

### 签名

```ts
devtools<T>(stateCreatorFn: StateCreator<T, [], []>, devtoolsOptions?: DevtoolsOptions): StateCreator<T, [['zustand/devtools', never]], []>
```

### 变更器

<!-- prettier-ignore-start -->
```ts
['zustand/devtools', never]
```
<!-- prettier-ignore-end -->

## 参考

### `devtools(stateCreatorFn, devtoolsOptions)`

#### 参数

- `stateCreatorFn`: 一个接受 `set` 函数、`get` 函数和 `store` 作为参数的函数。通常，你会返回一个包含你想要暴露的方法的对象。
- **可选** `devtoolsOptions`: 一个定义 `Redux Devtools` 选项的对象。
  - **可选** `name`: Redux DevTools 中连接的自定义标识符。
  - **可选** `enabled`: 在开发模式下默认为 `true`，在生产模式下默认为 `false`。启用或禁用此 store 的 Redux DevTools 集成。
  - **可选** `anonymousActionType`: 默认为推断的 action 类型，如果不可用则为 `anonymous`。在 Redux DevTools 中用作匿名变更的 action 类型的字符串。
  - **可选** `store`: Redux DevTools 中 store 的自定义标识符。

#### 返回值

`devtools` 返回一个状态创建器函数。

## 用法

### 调试 store

这个例子展示了如何使用 `Redux Devtools` 来调试 store

```ts
import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

type JungleStore = {
  bears: number
  addBear: () => void
  fishes: number
  addFish: () => void
}

const useJungleStore = create<JungleStore>()(
  devtools((set) => ({
    bears: 0,
    addBear: () =>
      set((state) => ({ bears: state.bears + 1 }), undefined, 'jungle/addBear'),
    fishes: 0,
    addFish: () =>
      set(
        (state) => ({ fishes: state.fishes + 1 }),
        undefined,
        'jungle/addFish',
      ),
  })),
)
```

### 调试基于切片模式的 store

这个例子展示了如何使用 `Redux Devtools` 来调试基于切片模式的 store

```ts
import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

type BearSlice = {
  bears: number
  addBear: () => void
}

type FishSlice = {
  fishes: number
  addFish: () => void
}

type JungleStore = BearSlice & FishSlice

const createBearSlice: StateCreator<
  JungleStore,
  [['zustand/devtools', never]],
  [],
  BearSlice
> = (set) => ({
  bears: 0,
  addBear: () =>
    set(
      (state) => ({ bears: state.bears + 1 }),
      undefined,
      'jungle:bear/addBear',
    ),
})

const createFishSlice: StateCreator<
  JungleStore,
  [['zustand/devtools', never]],
  [],
  FishSlice
> = (set) => ({
  fishes: 0,
  addFish: () =>
    set(
      (state) => ({ fishes: state.fishes + 1 }),
      undefined,
      'jungle:fish/addFish',
    ),
})

const useJungleStore = create<JungleStore>()(
  devtools((...args) => ({
    ...createBearSlice(...args),
    ...createFishSlice(...args),
  })),
)
```

### 清理

当不再需要 store 时，你可以通过调用 store 上的 `cleanup` 方法来清理 Redux DevTools 连接：

```ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useStore = create(
  devtools((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
  })),
)

// 当你完成 store 的使用时，清理它
useStore.devtools.cleanup()
```

这在将 store 包装在 context 中或动态创建多个 stores 的应用程序中特别有用。

## 故障排除

### 只显示一个 store

默认情况下，`Redux Devtools` 一次只显示一个 store，所以为了查看其他 stores，你需要使用 store 选择器并选择不同的 store。

### 所有 action 名称都标记为 'anonymous'

如果没有提供 action 类型名称，它默认为 "anonymous"。你可以通过提供 `anonymousActionType` 参数来自定义此默认值：

例如，下一个例子没有 action 类型名称：

```ts
import { create, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

type BearSlice = {
  bears: number
  addBear: () => void
}

type FishSlice = {
  fishes: number
  addFish: () => void
}

type JungleStore = BearSlice & FishSlice

const createBearSlice: StateCreator<
  JungleStore,
  [['zustand/devtools', never]],
  [],
  BearSlice
> = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
})

const createFishSlice: StateCreator<
  JungleStore,
  [['zustand/devtools', never]],
  [],
  FishSlice
> = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
})

const useJungleStore = create<JungleStore>()(
  devtools((...args) => ({
    ...createBearSlice(...args),
    ...createFishSlice(...args),
  })),
)
```

为了修复前面的例子，我们需要提供 action 类型名称作为第三个参数。此外，为了保持替换逻辑的默认行为，第二个参数应该设置为 `undefined`。

这是修复后的前面例子：

```ts
import { create, StateCreator } from 'zustand'

type BearSlice = {
  bears: number
  addBear: () => void
}

type FishSlice = {
  fishes: number
  addFish: () => void
}

type JungleStore = BearSlice & FishSlice

const createBearSlice: StateCreator<
  JungleStore,
  [['zustand/devtools', never]],
  [],
  BearSlice
> = (set) => ({
  bears: 0,
  addBear: () =>
    set((state) => ({ bears: state.bears + 1 }), undefined, 'bear/addBear'),
})

const createFishSlice: StateCreator<
  JungleStore,
  [['zustand/devtools', never]],
  [],
  FishSlice
> = (set) => ({
  fishes: 0,
  addFish: () =>
    set((state) => ({ fishes: state.fishes + 1 }), undefined, 'fish/addFish'),
})

const useJungleStore = create<JungleStore>()(
  devtools((...args) => ({
    ...createBearSlice(...args),
    ...createFishSlice(...args),
  })),
)
```

> [!IMPORTANT]
> 除非你想要覆盖默认的替换逻辑，否则不要将第二个参数设置为 `true` 或 `false`
