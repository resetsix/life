---
title: combine
description: 如何创建 store 并自动推断类型
createTime: 2025/06/15 17:52:18
permalink: /zustand/jvdq5dmt/
---

# combine

`combine` 中间件让你通过将初始状态与添加新状态切片和 actions 的状态创建器函数合并来创建一个内聚的状态。这非常有用，因为它会自动推断类型，所以不需要显式的类型定义。

> [!TIP]
> 这通过使 `create` 和 `createStore` 的柯里化版本在中间件使用中不再必要，使状态管理更加直接和高效。

```js
const nextStateCreatorFn = combine(initialState, additionalStateCreatorFn)
```

- [类型](#类型)
  - [签名](#签名)
- [参考](#参考)
- [用法](#用法)
  - [创建具有推断类型的状态](#创建具有推断类型的状态)
- [故障排除](#故障排除)

## 类型

### 签名

```ts
combine<T, U>(initialState: T, additionalStateCreatorFn: StateCreator<T, [], [], U>): StateCreator<Omit<T, keyof U> & U, [], []>
```

## 参考

### `combine(initialState, additionalStateCreatorFn)`

#### 参数

- `initialState`: 你希望状态初始时的值。它可以是任何类型的值，除了函数。
- `additionalStateCreatorFn`: 一个接受 `set` 函数、`get` 函数和 `store` 作为参数的函数。通常，你会返回一个包含你想要暴露的方法的对象。

#### 返回值

`combine` 返回一个状态创建器函数。

## 用法

### 创建具有推断类型的 store

这个示例展示了如何创建一个 store 并自动推断类型，这样你就不需要显式定义它们。

```ts
import { createStore } from 'zustand/vanilla'
import { combine } from 'zustand/middleware'

const positionStore = createStore(
  combine({ position: { x: 0, y: 0 } }, (set) => ({
    setPosition: (position) => set({ position }),
  })),
)

const $dotContainer = document.getElementById('dot-container') as HTMLDivElement
const $dot = document.getElementById('dot') as HTMLDivElement

$dotContainer.addEventListener('pointermove', (event) => {
  positionStore.getState().setPosition({
    x: event.clientX,
    y: event.clientY,
  })
})

const render: Parameters<typeof positionStore.subscribe>[0] = (state) => {
  $dot.style.transform = `translate(${state.position.x}px, ${state.position.y}px)`
}

render(positionStore.getInitialState(), positionStore.getInitialState())

positionStore.subscribe(render)
```

这是 `html` 代码

```html
<div
  id="dot-container"
  style="position: relative; width: 100vw; height: 100vh;"
>
  <div
    id="dot"
    style="position: absolute; background-color: red; border-radius: 50%; left: -10px; top: -10px; width: 20px; height: 20px;"
  ></div>
</div>
```

## 故障排除

此部分正在完善中。如果遇到问题，请参考 [Zustand 官方文档](https://github.com/pmndrs/zustand) 或在 GitHub 上提交 issue。
