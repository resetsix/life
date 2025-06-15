---
title: 持久化 store 数据
createTime: 2025/06/15 17:52:18
permalink: /zustand/mmjmpo2l/
---

Persist 中间件使你能够将 Zustand 状态存储在存储中（例如，`localStorage`、`AsyncStorage`、`IndexedDB` 等），从而持久化其数据。

请注意，此中间件支持同步存储（如 `localStorage`）和异步存储（如 `AsyncStorage`），但使用异步存储确实有成本。有关更多详细信息，请参见 [水合和异步存储](#水合和异步存储)。

## 简单示例

```ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useBearStore = create()(
  persist(
    (set, get) => ({
      bears: 0,
      addABear: () => set({ bears: get().bears + 1 }),
    }),
    {
      name: 'food-storage', // 存储中项目的名称（必须唯一）
      storage: createJSONStorage(() => sessionStorage), // （可选）默认使用 'localStorage'
    },
  ),
)
```

## TypeScript 简单示例

```ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type BearStore = {
  bears: number
  addABear: () => void
}

export const useBearStore = create<BearStore>()(
  persist(
    (set, get) => ({
      bears: 0,
      addABear: () => set({ bears: get().bears + 1 }),
    }),
    {
      name: 'food-storage', // 存储中项目的名称（必须唯一）
      storage: createJSONStorage(() => sessionStorage), // （可选）默认使用 'localStorage'
    },
  ),
)
```

## 选项

### `name`

这是唯一必需的选项。给定的名称将是用于在存储中存储你的 Zustand 状态的键，因此它必须是唯一的。

### `storage`

> 类型: `() => StateStorage`

> 默认: `createJSONStorage(() => localStorage)`

使你能够使用自己的存储。只需传递一个返回你想要使用的存储的函数。建议使用 [`createJSONStorage`](#createjsonstorage) 辅助函数来创建符合 `StateStorage` 接口的 `storage` 对象。

示例：

```ts
import { persist, createJSONStorage } from 'zustand/middleware'

export const useBoundStore = create(
  persist(
    (set, get) => ({
      // ...
    }),
    {
      // ...
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
```

### `partialize`

> 类型: `(state: Object) => Object`

> 默认: `(state) => state`

使你能够选择状态的某些字段存储在存储中。

你可以使用以下方式省略多个字段：

```ts
export const useBoundStore = create(
  persist(
    (set, get) => ({
      foo: 0,
      bar: 1,
    }),
    {
      // ...
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['foo'].includes(key)),
        ),
    },
  ),
)
```

或者你可以使用以下方式仅允许特定字段：

```ts
export const useBoundStore = create(
  persist(
    (set, get) => ({
      foo: 0,
      bar: 1,
    }),
    {
      // ...
      partialize: (state) => ({ foo: state.foo }),
    },
  ),
)
```

### `onRehydrateStorage`

> 类型: `(state: Object) => ((state?: Object, error?: Error) => void) | void`

此选项使你能够传递一个监听器函数，该函数将在存储水合时被调用。

示例：

```ts
export const useBoundStore = create(
  persist(
    (set, get) => ({
      // ...
    }),
    {
      // ...
      onRehydrateStorage: (state) => {
        console.log('水合开始')

        // 可选
        return (state, error) => {
          if (error) {
            console.log('水合期间发生错误', error)
          } else {
            console.log('水合完成')
          }
        }
      },
    },
  ),
)
```

### `version`

> 类型: `number`

> 默认: `0`

如果你想在存储中引入破坏性更改（例如重命名字段），你可以指定新的版本号。默认情况下，如果存储中的版本与代码中的版本不匹配，存储的值将不会被使用。你可以使用 [migrate](#migrate) 函数（见下文）来处理破坏性更改，以便持久化先前存储的数据。

### `migrate`

> 类型: `(persistedState: Object, version: number) => Object | Promise<Object>`

> 默认: `(persistedState) => persistedState`

你可以使用此选项来处理版本迁移。migrate 函数接受持久化状态和版本号作为参数。它必须返回符合最新版本（代码中的版本）的状态。

例如，如果你想重命名字段，你可以使用以下方式：

```ts
export const useBoundStore = create(
  persist(
    (set, get) => ({
      newField: 0, // 假设此字段在版本 0 中有其他名称
    }),
    {
      // ...
      version: 1, // 如果存储中的版本与此版本不匹配，将触发迁移
      migrate: (persistedState, version) => {
        if (version === 0) {
          // 如果存储的值在版本 0 中，我们将字段重命名为新名称
          persistedState.newField = persistedState.oldField
          delete persistedState.oldField
        }

        return persistedState
      },
    },
  ),
)
```

### `merge`

> 类型: `(persistedState: Object, currentState: Object) => Object`

> 默认: `(persistedState, currentState) => ({ ...currentState, ...persistedState })`

在某些情况下，你可能想要使用自定义合并函数来将持久化值与当前状态合并。

默认情况下，中间件执行浅合并。如果你有部分持久化的嵌套对象，浅合并可能不够。

### `skipHydration`

> 类型: `boolean | undefined`

> 默认: `undefined`

默认情况下，store 将在初始化时水合。

在某些应用程序中，你可能需要控制第一次水合何时发生。例如，在服务器渲染的应用程序中。

如果你设置 `skipHydration`，不会调用初始水合调用，由你手动调用 `rehydrate()`。

```ts
export const useBoundStore = create(
  persist(
    () => ({
      count: 0,
      // ...
    }),
    {
      // ...
      skipHydration: true,
    },
  ),
)
```

```tsx
import { useBoundStore } from './path-to-store';

export function StoreConsumer() {
  // 在挂载后水合持久化 store
  useEffect(() => {
    useBoundStore.persist.rehydrate();
  }, [])

  return (
    //...
  )
}
```

## API

> 版本: >=3.6.3

Persist API 使你能够从 React 组件内部或外部与 Persist 中间件进行多种交互。

### `getOptions`

> 类型: `() => Partial<PersistOptions>`

> 返回: Persist 中间件的选项

例如，它可以用于获取存储名称：

```ts
useBoundStore.persist.getOptions().name
```

### `setOptions`

> 类型: `(newOptions: Partial<PersistOptions>) => void`

更改中间件选项。请注意，新选项将与当前选项合并。

例如，这可以用于更改存储名称：

```ts
useBoundStore.persist.setOptions({
  name: 'new-name',
})
```

### `clearStorage`

> 类型: `() => void`

清除存储在 [name](#name) 键下的所有内容。

```ts
useBoundStore.persist.clearStorage()
```

### `rehydrate`

> 类型: `() => Promise<void>`

在某些情况下，你可能想要手动触发重新水合。这可以通过调用 `rehydrate` 方法来完成。

```ts
await useBoundStore.persist.rehydrate()
```

### `hasHydrated`

> 类型: `() => boolean`

这是一个非响应式 getter，用于检查存储是否已水合（请注意，它在调用 [`rehydrate`](#rehydrate) 时更新）。

```ts
useBoundStore.persist.hasHydrated()
```

### `onHydrate`

> 类型: `(listener: (state) => void) => () => void`

> 返回: 取消订阅函数

当水合过程开始时，将调用此监听器。

```ts
const unsub = useBoundStore.persist.onHydrate((state) => {
  console.log('水合开始')
})

// 稍后...
unsub()
```

### `onFinishHydration`

> 类型: `(listener: (state) => void) => () => void`

> 返回: 取消订阅函数

当水合过程结束时，将调用此监听器。

```ts
const unsub = useBoundStore.persist.onFinishHydration((state) => {
  console.log('水合完成')
})

// 稍后...
unsub()
```

### `createJSONStorage`

> 类型: `(getStorage: () => StateStorage, options?: JsonStorageOptions) => StateStorage`

> 返回: `PersistStorage`

此辅助函数使你能够创建一个 [`storage`](#storage) 对象，当你想要使用自定义存储引擎时很有用。

`getStorage` 是一个返回具有 `getItem`、`setItem` 和 `removeItem` 属性的存储引擎的函数。

`options` 是一个可选对象，可用于自定义数据的序列化和反序列化。`options.reviver` 是传递给 `JSON.parse` 以反序列化数据的函数。`options.replacer` 是传递给 `JSON.stringify` 以序列化数据的函数。

```ts
import { createJSONStorage } from 'zustand/middleware'

const storage = createJSONStorage(() => sessionStorage, {
  reviver: (key, value) => {
    if (value && value.type === 'date') {
      return new Date(value)
    }
    return value
  },
  replacer: (key, value) => {
    // 注意：如果可用，`.toJSON()` 的结果会作为 value 传递给
    // replacer 函数，所以 Date 在这里总是一个 `string`
    if (key === 'someDate') return { type: 'date', value }
    return value
  },
})
```

## 水合和异步存储

要解释异步存储的"成本"是什么，你需要了解什么是水合。

简而言之，水合是从存储中检索持久化状态并将其与当前状态合并的过程。

Persist 中间件执行两种水合：同步和异步。如果给定的存储是同步的（例如，`localStorage`），水合将同步完成。另一方面，如果给定的存储是异步的（例如，`AsyncStorage`），水合将异步完成。

但问题是什么？使用同步水合，Zustand store 将在其创建时已经水合。相比之下，使用异步水合，Zustand store 将稍后在微任务中水合。

为什么这很重要？异步水合可能导致一些意外行为。例如，如果你在 React 应用中使用 Zustand，store 在初始渲染时将**不会**水合。在你的应用依赖于页面加载时的持久化值的情况下，你可能会看到闪烁。

如果你的应用确实依赖于页面加载时的持久化状态，请参见下面 [FAQ](#faq) 部分中的 [_如何检查我的 store 是否已水合_](#如何检查我的-store-是否已水合)。

### 在 Next.js 中的使用

NextJS 使用服务器端渲染，它会比较服务器上渲染的组件与客户端上渲染的组件。但由于你使用来自浏览器的数据来更改组件，两次渲染会有所不同，Next 会向你抛出警告。

错误通常是：

- Text content does not match server-rendered HTML
- Hydration failed because the initial UI does not match what was rendered on the server
- There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering

要解决这些错误，请创建一个自定义 hook，以便 Zustand 在更改组件之前稍等一下。

创建一个包含以下内容的文件：

```ts
// useStore.ts
import { useState, useEffect } from 'react'

const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F,
) => {
  const result = store(callback) as F
  const [data, setData] = useState<F>()

  useEffect(() => {
    setData(result)
  }, [result])

  return data
}

export default useStore
```

现在在你的页面中，你将稍微不同地使用 hook：

```ts
// useBearStore.ts

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// store 本身不需要任何更改
export const useBearStore = create(
  persist(
    (set, get) => ({
      bears: 0,
      addABear: () => set({ bears: get().bears + 1 }),
    }),
    {
      name: 'food-storage',
    },
  ),
)
```

```ts
// yourComponent.tsx

import useStore from './useStore'
import { useBearStore } from './stores/useBearStore'

const bears = useStore(useBearStore, (state) => state.bears)
```

致谢：[这个 issue 的回复](https://github.com/pmndrs/zustand/issues/938#issuecomment-1481801942)，指向了[这篇博客文章](https://dev.to/abdulsamad/how-to-use-zustands-persist-middleware-in-nextjs-4lb5)。

## FAQ

### 如何检查我的 store 是否已水合

有几种不同的方法可以做到这一点。

你可以使用 [`onRehydrateStorage`](#onrehydratestorage) 监听器函数来更新 store 中的字段：

```ts
const useBoundStore = create(
  persist(
    (set, get) => ({
      // ...
      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state
        });
      }
    }),
    {
      // ...
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true)
      }
    }
  )
);

export default function App() {
  const hasHydrated = useBoundStore(state => state._hasHydrated);

  if (!hasHydrated) {
    return <p>Loading...</p>
  }

  return (
    // ...
  );
}
```

你也可以创建一个自定义的 `useHydration` hook：

```ts
const useBoundStore = create(persist(...))

const useHydration = () => {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // 注意：这只是为了考虑手动重新水合的情况。
    // 如果你不需要，可以删除以下行。
    const unsubHydrate = useBoundStore.persist.onHydrate(() => setHydrated(false))

    const unsubFinishHydration = useBoundStore.persist.onFinishHydration(() => setHydrated(true))

    setHydrated(useBoundStore.persist.hasHydrated())

    return () => {
      unsubHydrate()
      unsubFinishHydration()
    }
  }, [])

  return hydrated
}
```

### 如何使用自定义存储引擎

如果你想要使用的存储不符合预期的 API，你可以创建自己的存储：

```ts
import { create } from 'zustand'
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware'
import { get, set, del } from 'idb-keyval' // 可以使用任何东西：IndexedDB、Ionic Storage 等

// 自定义存储对象
const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    console.log(name, 'has been retrieved')
    return (await get(name)) || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    console.log(name, 'with value', value, 'has been saved')
    await set(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    console.log(name, 'has been deleted')
    await del(name)
  },
}

export const useBoundStore = create(
  persist(
    (set, get) => ({
      bears: 0,
      addABear: () => set({ bears: get().bears + 1 }),
    }),
    {
      name: 'food-storage', // 唯一名称
      storage: createJSONStorage(() => storage),
    },
  ),
)
```

如果你使用的类型 `JSON.stringify()` 不支持，你需要编写自己的序列化/反序列化代码。但是，如果这很繁琐，你可以使用第三方库来序列化和反序列化不同类型的数据。

例如，[Superjson](https://github.com/blitz-js/superjson) 可以序列化数据及其类型，允许数据在反序列化时解析回其原始类型

```ts
import superjson from 'superjson' //  可以使用任何东西：serialize-javascript、devalue 等
import { PersistStorage } from 'zustand/middleware'

interface BearState {
  bear: Map<string, string>
  fish: Set<string>
  time: Date
  query: RegExp
}

const storage: PersistStorage<BearState> = {
  getItem: (name) => {
    const str = localStorage.getItem(name)
    if (!str) return null
    return superjson.parse(str)
  },
  setItem: (name, value) => {
    localStorage.setItem(name, superjson.stringify(value))
  },
  removeItem: (name) => localStorage.removeItem(name),
}

const initialState: BearState = {
  bear: new Map(),
  fish: new Set(),
  time: new Date(),
  query: new RegExp(''),
}

export const useBearStore = create<BearState>()(
  persist(
    (set) => ({
      ...initialState,
      // ...
    }),
    {
      name: 'food-storage',
      storage,
    },
  ),
)
```

### 如何在存储事件上重新水合

你可以使用 Persist API 创建自己的实现，类似于下面的示例：

```ts
type StoreWithPersist = Mutate<StoreApi<State>, [["zustand/persist", unknown]]>

export const withStorageDOMEvents = (store: StoreWithPersist) => {
  const storageEventCallback = (e: StorageEvent) => {
    if (e.key === store.persist.getOptions().name && e.newValue) {
      store.persist.rehydrate()
    }
  }

  window.addEventListener('storage', storageEventCallback)

  return () => {
    window.removeEventListener('storage', storageEventCallback)
  }
}

const useBoundStore = create(persist(...))
withStorageDOMEvents(useBoundStore)
```

### 如何与 TypeScript 一起使用

基本的 TypeScript 使用不需要任何特殊的东西，除了编写 `create<State>()(...)` 而不是 `create(...)`。

```tsx
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface MyState {
  bears: number
  addABear: () => void
}

export const useBearStore = create<MyState>()(
  persist(
    (set, get) => ({
      bears: 0,
      addABear: () => set({ bears: get().bears + 1 }),
    }),
    {
      name: 'food-storage', // 存储中项目的名称（必须唯一）
      storage: createJSONStorage(() => sessionStorage), // （可选）默认使用 'localStorage'
      partialize: (state) => ({ bears: state.bears }),
    },
  ),
)
```

### 如何与 Map 和 Set 一起使用

为了持久化对象类型如 `Map` 和 `Set`，它们需要转换为 JSON 可序列化的类型，如 `Array`，这可以通过定义自定义 `storage` 引擎来完成。

假设你的状态使用 `Map` 来处理 `transactions` 列表，那么你可以在 `storage` 属性中将 `Map` 转换为 `Array`，如下所示：

```ts

interface BearState {
  .
  .
  .
  transactions: Map<any>
}

  storage: {
    getItem: (name) => {
      const str = localStorage.getItem(name);
      if (!str) return null;
      const existingValue = JSON.parse(str);
      return {
        ...existingValue,
        state: {
          ...existingValue.state,
          transactions: new Map(existingValue.state.transactions),
        }
      }
    },
    setItem: (name, newValue: StorageValue<BearState>) => {
      // 函数不能被 JSON 编码
      const str = JSON.stringify({
        ...newValue,
        state: {
          ...newValue.state,
          transactions: Array.from(newValue.state.transactions.entries()),
        },
      })
      localStorage.setItem(name, str)
    },
    removeItem: (name) => localStorage.removeItem(name),
  },
```

### 如何与 TypeScript 一起使用

基本的 TypeScript 使用不需要任何特殊的东西，除了写 `create<State>()(...)` 而不是 `create(...)`。

```tsx
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface MyState {
  bears: number
  addABear: () => void
}

export const useBearStore = create<MyState>()(
  persist(
    (set, get) => ({
      bears: 0,
      addABear: () => set({ bears: get().bears + 1 }),
    }),
    {
      name: 'food-storage', // storage 中项目的名称（必须唯一）
      storage: createJSONStorage(() => sessionStorage), // （可选）默认使用 'localStorage'
      partialize: (state) => ({ bears: state.bears }),
    },
  ),
)
```

### 如何与 Map 和 Set 一起使用

为了持久化诸如 `Map` 和 `Set` 之类的对象类型，它们需要转换为 JSON 可序列化的类型，例如 `Array`，这可以通过定义自定义 `storage` 引擎来完成。

假设你的状态使用 `Map` 来处理 `transactions` 列表，那么你可以在 `storage` 属性中将 `Map` 转换为 `Array`，如下所示：

```ts

interface BearState {
  .
  .
  .
  transactions: Map<any>
}

  storage: {
    getItem: (name) => {
      const str = localStorage.getItem(name);
      if (!str) return null;
      const existingValue = JSON.parse(str);
      return {
        ...existingValue,
        state: {
          ...existingValue.state,
          transactions: new Map(existingValue.state.transactions),
        }
      }
    },
    setItem: (name, newValue: StorageValue<BearState>) => {
      // 函数不能被 JSON 编码
      const str = JSON.stringify({
        ...newValue,
        state: {
          ...newValue.state,
          transactions: Array.from(newValue.state.transactions.entries()),
        },
      })
      localStorage.setItem(name, str)
    },
    removeItem: (name) => localStorage.removeItem(name),
  },
```
