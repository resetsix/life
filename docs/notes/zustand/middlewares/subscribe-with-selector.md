---
title: subscribeWithSelector
description: 如何在 store 中订阅细粒度的 store 更新
createTime: 2025/06/15 17:52:18
permalink: /zustand/29e187xk/
---

# subscribeWithSelector

`subscribeWithSelector` 中间件让你可以基于当前状态订阅特定数据。

```js
const nextStateCreatorFn = subscribeWithSelector(stateCreatorFn)
```

- [类型](#类型)
  - [签名](#签名)
  - [变更器](#变更器)
- [参考](#参考)
- [用法](#用法)
- [故障排除](#故障排除)

## 类型

### 签名

```ts
subscribeWithSelector<T>(stateCreatorFn: StateCreator<T, [], []>): StateCreator<T, [['zustand/subscribeWithSelector', never]], []>
```

### 变更器

<!-- prettier-ignore-start -->
```ts
['zustand/subscribeWithSelector', never]
```
<!-- prettier-ignore-end -->

## 参考

### `subscribeWithSelector(stateCreatorFn)`

#### 参数

- `stateCreatorFn`: 一个接受 `set` 函数、`get` 函数和 `store` 作为参数的函数。通常，你会返回一个包含你想要暴露的方法的对象。

#### 返回值

`subscribeWithSelector` 返回一个状态创建器函数。

## 用法

### 订阅部分状态更新

通过订阅部分状态更新，你注册一个回调函数，该函数在 store 的部分状态更新时触发。我们可以使用 `subscribe` 进行外部状态管理。

```ts
import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const positionStore = createStore<PositionStore>()(
  subscribeWithSelector((set) => ({
    position: { x: 0, y: 0 },
    setPosition: (position) => set({ position }),
  })),
)

const $dot = document.getElementById('dot') as HTMLDivElement

$dot.addEventListener('mouseenter', (event) => {
  const parent = event.currentTarget.parentElement
  const parentWidth = parent.clientWidth
  const parentHeight = parent.clientHeight

  positionStore.getState().setPosition({
    x: Math.ceil(Math.random() * parentWidth),
    y: Math.ceil(Math.random() * parentHeight),
  })
})

const render: Parameters<typeof positionStore.subscribe>[0] = (state) => {
  $dot.style.transform = `translate(${state.position.x}px, ${state.position.y}px)`
}

render(positionStore.getInitialState(), positionStore.getInitialState())

positionStore.subscribe((state) => state.position, render)

const logger: Parameters<typeof positionStore.subscribe>[0] = (x) => {
  console.log('new x position', { x })
}

positionStore.subscribe((state) => state.position.x, logger)
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
