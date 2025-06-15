---
title: persist
description: 如何持久化 store
createTime: 2025/06/15 17:52:18
permalink: /zustand/6owg9l00/
---

# persist

`persist` 中间件让你在页面重新加载或应用重启时持久化 store 的状态。

```js
const nextStateCreatorFn = persist(stateCreatorFn, persistOptions)
```

- [类型](#类型)
  - [签名](#签名)
  - [变更器](#变更器)
- [参考](#参考)
- [用法](#用法)
  - [持久化状态](#持久化状态)
  - [部分持久化状态](#部分持久化状态)
  - [使用自定义存储持久化状态](#使用自定义存储持久化状态)
  - [通过版本控制和迁移持久化状态](#通过版本控制和迁移持久化状态)
  - [手动水合状态](#手动水合状态)
- [故障排除](#故障排除)

## 类型

### 签名

```ts
persist<T, U>(stateCreatorFn: StateCreator<T, [], []>, persistOptions?: PersistOptions<T, U>): StateCreator<T, [['zustand/persist', U]], []>
```

### 变更器

```ts
['zustand/persist', U]
```

## 参考

### `persist(stateCreatorFn)`

#### 参数

- `stateCreatorFn`: 一个接受 `set` 函数、`get` 函数和 `store` 作为参数的函数。通常，你会返回一个包含你想要暴露的方法的对象。
- `persistOptions`: 一个定义存储选项的对象。
  - `name`: 你的 store 在存储中的唯一名称。
  - **可选** `storage`: 默认为 `createJSONStorage(() => localStorage)`。
  - **可选** `partialize`: 一个在持久化之前过滤状态字段的函数。
  - **可选** `onRehydrateStorage`: 一个函数或返回函数的函数，允许在状态水合前后执行自定义逻辑。
  - **可选** `version`: 持久化状态的版本号。如果存储的状态版本不匹配，将不会使用它。
  - **可选** `migrate`: 当版本不匹配时迁移持久化状态的函数。
  - **可选** `merge`: 在水合期间将持久化状态与当前状态合并的自定义逻辑函数。默认为浅合并。
  - **可选** `skipHydration`: 默认为 `false`。如果为 `true`，中间件不会在初始化时自动水合状态。在这种情况下手动使用 `rehydrate` 函数。这对服务器端渲染 (SSR) 应用很有用。

#### 返回值

`persist` 返回一个状态创建器函数。

## 用法

### 持久化状态

在本教程中，我们将使用 vanilla store 和 `persist` 中间件创建一个简单的位置跟踪器。该示例跟踪鼠标在容器内移动时的 `position`，并将 `position` 存储在本地存储中，因此即使页面重新加载也会持久化。

我们首先设置一个 vanilla store，它保存位置（具有 `x` 和 `y` 坐标的对象）和更新它的 action。我们还将使用 `persist` 中间件将位置存储在 `localStorage` 中。

```ts
import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const positionStore = createStore<PositionStore>()(
  persist(
    (set) => ({
      position: { x: 0, y: 0 },
      setPosition: (position) => set({ position }),
    }),
    { name: 'position-storage' },
  ),
)
```

接下来，我们将跟踪 div 内的鼠标移动并使用新位置更新 store。

```ts
const $dotContainer = document.getElementById('dot-container') as HTMLDivElement
const $dot = document.getElementById('dot') as HTMLDivElement

$dotContainer.addEventListener('pointermove', (event) => {
  positionStore.getState().setPosition({
    x: event.clientX,
    y: event.clientY,
  })
})
```

我们希望通过将 div 元素（代表点）移动到新坐标来在屏幕上反映位置更新。

```ts
const render: Parameters<typeof positionStore.subscribe>[0] = (state) => {
  $dot.style.transform = `translate(${state.position.x}px, ${state.position.y}px)`
}

render(positionStore.getState(), positionStore.getState())

positionStore.subscribe(render)
```

这是完整的代码。

```ts
import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const positionStore = createStore<PositionStore>()(
  persist(
    (set) => ({
      position: { x: 0, y: 0 },
      setPosition: (position) => set({ position }),
    }),
    { name: 'position-storage' },
  ),
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

render(positionStore.getState(), positionStore.getState())

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

### 部分持久化状态

在本教程中，我们将使用 vanilla store 和 `persist` 中间件创建一个简单的位置跟踪器。此外，我们将向你展示如何仅持久化状态的一部分（部分持久化），这在你不想将整个状态存储在 `localStorage` 中时很有用。

我们将首先创建一个 vanilla store，它保存位置状态和更新它的 actions。我们将使用 `persist` 中间件仅持久化状态的相关部分（在这种情况下，包含位置的上下文）。

```ts
import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'

type PositionStoreState = {
  context: {
    position: { x: number; y: number }
  }
}

type PositionStoreActions = {
  actions: {
    setPosition: (
      nextPosition: PositionStoreState['context']['position'],
    ) => void
  }
}

type PositionStore = PositionStoreState & PositionStoreActions

const positionStore = createStore<PositionStore>()(
  persist(
    (set) => ({
      context: {
        position: { x: 0, y: 0 },
      },
      actions: {
        setPosition: (position) => set({ context: { position } }),
      },
    }),
    {
      name: 'position-storage',
      partialize: (state) => ({ context: state.context }),
    },
  ),
)
```

接下来，我们将跟踪 div 内的鼠标移动并使用新位置更新 store。

```ts
const $dotContainer = document.getElementById('dot-container') as HTMLDivElement
const $dot = document.getElementById('dot') as HTMLDivElement

$dotContainer.addEventListener('pointermove', (event) => {
  positionStore.getState().actions.setPosition({
    x: event.clientX,
    y: event.clientY,
  })
})
```

我们希望通过将 div 元素（代表点）移动到新坐标来在屏幕上反映位置更新。

```ts
const render: Parameters<typeof positionStore.subscribe>[0] = (state) => {
  $dot.style.transform = `translate(${state.context.position.x}px, ${state.context.position.y}px)`
}

render(positionStore.getState(), positionStore.getState())

positionStore.subscribe(render)
```

这是创建一个跟随鼠标在容器内移动的点并在 `localStorage` 中持久化 `context` 的完整代码。

```ts
import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'

type PositionStoreState = {
  context: {
    position: { x: number; y: number }
  }
}

type PositionStoreActions = {
  actions: {
    setPosition: (
      nextPosition: PositionStoreState['context']['position'],
    ) => void
  }
}

type PositionStore = PositionStoreState & PositionStoreActions

const positionStore = createStore<PositionStore>()(
  persist(
    (set) => ({
      context: {
        position: { x: 0, y: 0 },
      },
      actions: {
        setPosition: (position) => set({ context: { position } }),
      },
    }),
    {
      name: 'position-storage',
      partialize: (state) => ({ context: state.context }),
    },
  ),
)

const $dotContainer = document.getElementById('dot-container') as HTMLDivElement
const $dot = document.getElementById('dot') as HTMLDivElement

$dotContainer.addEventListener('pointermove', (event) => {
  positionStore.getState().actions.setPosition({
    x: event.clientX,
    y: event.clientY,
  })
})

const render: Parameters<typeof positionStore.subscribe>[0] = (state) => {
  $dot.style.transform = `translate(${state.context.position.x}px, ${state.context.position.y}px)`
}

render(positionStore.getState(), positionStore.getState())

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

### 使用自定义存储持久化状态

在这个小教程中，我们将使用 vanilla store 创建一个简单的位置跟踪系统，其中位置状态持久化在 URL 的搜索参数中。这种方法允许直接在浏览器的 URL 中进行状态持久化，这对于在页面重新加载时维护状态或共享嵌入状态的链接很有用。

我们需要实现函数来操作 URL 搜索参数，就像它们是存储机制一样。这包括检索、设置和删除参数。

```ts
const getSearchParams = () => {
  return new URL(location.href).searchParams
}

const updateSearchParams = (searchParams: URLSearchParams) => {
  window.history.replaceState(
    {},
    '',
    `${location.pathname}?${searchParams.toString()}`,
  )
}

const getSearchParam = (key: string) => {
  const searchParams = getSearchParams()
  return searchParams.get(key)
}

const updateSearchParam = (key: string, value: string) => {
  const searchParams = getSearchParams()
  searchParams.set(key, value)

  updateSearchParams(searchParams)
}

const removeSearchParam = (key: string) => {
  const searchParams = getSearchParams()
  searchParams.delete(key)

  updateSearchParams(searchParams)
}
```

要使用 URL 搜索参数作为存储，我们定义一个带有 `getItem`、`setItem` 和 `removeItem` 方法的 `searchParamsStorage` 对象。这些方法映射到我们操作搜索参数的自定义函数。

```ts
const searchParamsStorage = {
  getItem: (key: string) => getSearchParam(key),
  setItem: (key: string, value: string) => updateSearchParam(key, value),
  removeItem: (key: string) => removeSearchParam(key),
}
```

现在，我们使用 `persist` 中间件初始化 vanilla store，指定我们想要使用我们的自定义存储。我们将在 URL 搜索参数中持久化位置数据，而不是默认的 `localStorage` 或 `sessionStorage`。

```ts
import { createStore } from 'zustand/vanilla'
import { persist, createJSONStorage } from 'zustand/middleware'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const positionStore = createStore<PositionStore>()(
  persist(
    (set) => ({
      position: { x: 0, y: 0 },
      setPosition: (position) => set({ position }),
    }),
    {
      name: 'position-storage',
      storage: createJSONStorage(() => searchParamsStorage),
    },
  ),
)
```

接下来，我们将跟踪 div 内的鼠标移动并使用新位置更新 store。

```ts
const $dotContainer = document.getElementById('dot-container') as HTMLDivElement
const $dot = document.getElementById('dot') as HTMLDivElement

$dotContainer.addEventListener('pointermove', (event) => {
  positionStore.getState().setPosition({
    x: event.clientX,
    y: event.clientY,
  })
})
```

我们希望通过将 div 元素（代表点）移动到新坐标来在屏幕上反映位置更新。

```ts
const render: Parameters<typeof positionStore.subscribe>[0] = (state) => {
  $dot.style.transform = `translate(${state.position.x}px, ${state.position.y}px)`
}

render(positionStore.getState(), positionStore.getState())

positionStore.subscribe(render)
```

这是创建一个跟随鼠标在容器内移动的点并在 URL 搜索参数中持久化位置的完整代码。

```ts
import { createStore } from 'zustand/vanilla'
import { persist, createJSONStorage } from 'zustand/middleware'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const getSearchParams = () => {
  return new URL(location.href).searchParams
}

const updateSearchParams = (searchParams: URLSearchParams) => {
  window.history.replaceState(
    {},
    '',
    `${location.pathname}?${searchParams.toString()}`,
  )
}

const getSearchParam = (key: string) => {
  const searchParams = getSearchParams()
  return searchParams.get(key)
}

const updateSearchParam = (key: string, value: string) => {
  const searchParams = getSearchParams()
  searchParams.set(key, value)

  updateSearchParams(searchParams)
}

const removeSearchParam = (key: string) => {
  const searchParams = getSearchParams()
  searchParams.delete(key)

  updateSearchParams(searchParams)
}

const searchParamsStorage = {
  getItem: (key: string) => getSearchParam(key),
  setItem: (key: string, value: string) => updateSearchParam(key, value),
  removeItem: (key: string) => removeSearchParam(key),
}

const positionStore = createStore<PositionStore>()(
  persist(
    (set) => ({
      position: { x: 0, y: 0 },
      setPosition: (position) => set({ position }),
    }),
    {
      name: 'position-storage',
      storage: createJSONStorage(() => searchParamsStorage),
    },
  ),
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

render(positionStore.getState(), positionStore.getState())

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

### 通过版本控制和迁移持久化状态

在本教程中，我们将探索如何使用版本控制和迁移来管理状态持久化。我们将演示如何在不破坏现有持久化数据的情况下跨版本演进你的状态模式。

在转向版本化状态管理之前，我们为 `version` 0 模拟一个初始状态。这是通过在 `localStorage` 中手动设置 `version` 0 状态（如果它还不存在）来完成的。`version` 0 状态将坐标保存为 `x` 和 `y` 字段。

```ts
// 仅用于教程目的
if (!localStorage.getItem('position-storage')) {
  localStorage.setItem(
    'position-storage',
    JSON.stringify({
      state: { x: 100, y: 100 }, // version 0 结构
      version: 0,
    }),
  )
}
```

接下来，我们使用 `persist` 中间件来处理状态持久化。我们还添加一个迁移函数来处理版本之间的变化。在这个例子中，我们将状态从 `version` 0（其中 `x` 和 `y` 是分开的）`migrate` 到 `version` 1，其中它们被组合到一个 `position` 对象中。

```ts
migrate: (persisted: any, version) => {
  if (version === 0) {
    persisted.position = { x: persisted.x, y: persisted.y }
    delete persisted.x
    delete persisted.y
  }

  return persisted
}
```

接下来，我们将跟踪 div 内的鼠标移动并使用新位置更新 store。

```ts
const $dotContainer = document.getElementById('dot-container') as HTMLDivElement
const $dot = document.getElementById('dot') as HTMLDivElement

$dotContainer.addEventListener('pointermove', (event) => {
  positionStore.getState().setPosition({
    x: event.clientX,
    y: event.clientY,
  })
})
```

我们希望通过将 div 元素（代表点）移动到新坐标来在屏幕上反映位置更新。

```ts
const render: Parameters<typeof positionStore.subscribe>[0] = (state) => {
  $dot.style.transform = `translate(${state.position.x}px, ${state.position.y}px)`
}

render(positionStore.getState(), positionStore.getState())

positionStore.subscribe(render)
```

这是完整的代码。

```ts
import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'

// 仅用于教程目的
if (!localStorage.getItem('position-storage')) {
  localStorage.setItem(
    'position-storage',
    JSON.stringify({
      state: { x: 100, y: 100 },
      version: 0,
    }),
  )
}

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const positionStore = createStore<PositionStore>()(
  persist(
    (set) => ({
      position: { x: 0, y: 0 }, // version 0: 只是 x: 0, y: 0
      setPosition: (position) => set({ position }),
    }),
    {
      name: 'position-storage',
      version: 1,
      migrate: (persisted: any, version) => {
        if (version === 0) {
          persisted.position = { x: persisted.x, y: persisted.y }
          delete persisted.x
          delete persisted.y
        }

        return persisted
      },
    },
  ),
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

render(positionStore.getState(), positionStore.getState())

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

### 持久化嵌套对象状态

在本教程中，我们将创建一个 vanilla store，跟踪由 `x` 和 `y` 坐标表示的位置。我们还将使用 `localStorage` 实现持久化，并演示如何处理可能缺少字段的状态合并。

为了模拟教程的初始状态，我们将检查我们的位置数据是否存在于 `localStorage` 中。如果不存在，我们将设置它。

```ts
if (!localStorage.getItem('position-storage')) {
  localStorage.setItem(
    'position-storage',
    JSON.stringify({
      state: { position: { y: 100 } }, // 缺少 `x` 字段
      version: 0,
    }),
  )
}
```

现在，我们将创建 store 并配置它使用持久化和深度合并。

```ts
import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'
import createDeepMerge from '@fastify/deepmerge'

const deepMerge = createDeepMerge({ all: true })

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const positionStore = createStore<PositionStore>()(
  persist(
    (set) => ({
      position: { x: 0, y: 0 },
      setPosition: (position) => set({ position }),
    }),
    {
      name: 'position-storage',
      merge: (persisted, current) => deepMerge(current, persisted) as never,
    },
  ),
)
```

接下来，我们将跟踪 div 内的鼠标移动并使用新位置更新 store。

```ts
const $dotContainer = document.getElementById('dot-container') as HTMLDivElement
const $dot = document.getElementById('dot') as HTMLDivElement

$dotContainer.addEventListener('pointermove', (event) => {
  positionStore.getState().setPosition({
    x: event.clientX,
    y: event.clientY,
  })
})
```

我们希望通过将 div 元素（代表点）移动到新坐标来在屏幕上反映位置更新。

```ts
const render: Parameters<typeof positionStore.subscribe>[0] = (state) => {
  $dot.style.transform = `translate(${state.position.x}px, ${state.position.y}px)`
}

render(positionStore.getState(), positionStore.getState())

positionStore.subscribe(render)
```

这是完整的代码。

```ts
import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'
import createDeepMerge from '@fastify/deepmerge'

const deepMerge = createDeepMerge({ all: true })

// 仅用于教程目的
if (!localStorage.getItem('position-storage')) {
  localStorage.setItem(
    'position-storage',
    JSON.stringify({
      state: { position: { y: 100 } }, // 缺少 `x` 字段
      version: 0,
    }),
  )
}

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const positionStore = createStore<PositionStore>()(
  persist(
    (set) => ({
      position: { x: 0, y: 0 },
      setPosition: (position) => set({ position }),
    }),
    {
      name: 'position-storage',
      merge: (persisted, current) => deepMerge(current, persisted) as never,
    },
  ),
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
  console.log({ state })
  $dot.style.transform = `translate(${state.position.x}px, ${state.position.y}px)`
}

render(positionStore.getState(), positionStore.getState())

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

### 持久化状态并手动水合

在本教程中，我们将创建一个 vanilla store，跟踪由 `x` 和 `y` 坐标表示的位置。我们还将使用 `localStorage` 实现持久化，并探索如何跳过水合过程并在延迟后手动触发重新水合。

我们首先设置一个 vanilla store，它保存位置（具有 `x` 和 `y` 坐标的对象）和更新它的 action。此外，我们还将使用 `persist` 中间件将位置存储在 `localStorage` 中，但跳过水合。

```ts
import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const positionStore = createStore<PositionStore>()(
  persist(
    (set) => ({
      position: { x: 0, y: 0 },
      setPosition: (position) => set({ position }),
    }),
    {
      name: 'position-storage',
      skipHydration: true,
    },
  ),
)
```

由于我们在初始设置中跳过了水合，我们将手动重新水合状态。在这里，我们使用 `setTimeout` 来模拟延迟的重新水合。

```ts
setTimeout(() => {
  positionStore.persist.rehydrate()
}, 2000)
```

接下来，我们将跟踪 div 内的鼠标移动并使用新位置更新 store。

```ts
const $dotContainer = document.getElementById('dot-container') as HTMLDivElement
const $dot = document.getElementById('dot') as HTMLDivElement

$dotContainer.addEventListener('pointermove', (event) => {
  positionStore.getState().setPosition({
    x: event.clientX,
    y: event.clientY,
  })
})
```

我们希望通过将 div 元素（代表点）移动到新坐标来在屏幕上反映位置更新。

```ts
const render: Parameters<typeof positionStore.subscribe>[0] = (state) => {
  $dot.style.transform = `translate(${state.position.x}px, ${state.position.y}px)`
}

render(positionStore.getState(), positionStore.getState())

positionStore.subscribe(render)
```

这是完整的代码。

```ts
import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const positionStore = createStore<PositionStore>()(
  persist(
    (set) => ({
      position: { x: 0, y: 0 },
      setPosition: (position) => set({ position }),
    }),
    {
      name: 'position-storage',
      skipHydration: true,
    },
  ),
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

setTimeout(() => {
  positionStore.persist.rehydrate()
}, 2000)

render(positionStore.getState(), positionStore.getState())

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

TBD
