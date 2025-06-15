---
title: 将状态与 URL 连接
createTime: 2025/06/15 17:52:18
permalink: /zustand/8b0k3jzg/
---

## 将状态与 URL Hash 连接

如果你想将 store 的状态连接到 URL hash，你可以创建自己的 hash 存储。

```ts
import { create } from 'zustand'
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware'

const hashStorage: StateStorage = {
  getItem: (key): string => {
    const searchParams = new URLSearchParams(location.hash.slice(1))
    const storedValue = searchParams.get(key) ?? ''
    return JSON.parse(storedValue)
  },
  setItem: (key, newValue): void => {
    const searchParams = new URLSearchParams(location.hash.slice(1))
    searchParams.set(key, JSON.stringify(newValue))
    location.hash = searchParams.toString()
  },
  removeItem: (key): void => {
    const searchParams = new URLSearchParams(location.hash.slice(1))
    searchParams.delete(key)
    location.hash = searchParams.toString()
  },
}

export const useBoundStore = create(
  persist(
    (set, get) => ({
      fishes: 0,
      addAFish: () => set({ fishes: get().fishes + 1 }),
    }),
    {
      name: 'food-storage', // 唯一名称
      storage: createJSONStorage(() => hashStorage),
    },
  ),
)
```

### CodeSandbox 演示

https://codesandbox.io/s/zustand-state-with-url-hash-demo-f29b88?file=/src/store/index.ts

## 持久化并将状态与 URL 参数连接（示例：URL 查询参数）

有时你想要有条件地将状态连接到 URL。这个示例描述了 URL 查询参数的使用，同时保持与另一个持久化实现（如 `localstorage`）的同步。

如果你希望 URL 参数始终填充，可以删除对 `getUrlSearch()` 的条件检查。

下面的实现将在相关状态更改时就地更新 URL，无需刷新。

```ts
import { create } from 'zustand'
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware'

const getUrlSearch = () => {
  return window.location.search.slice(1)
}

const persistentStorage: StateStorage = {
  getItem: (key): string => {
    // 首先检查 URL
    if (getUrlSearch()) {
      const searchParams = new URLSearchParams(getUrlSearch())
      const storedValue = searchParams.get(key)
      return JSON.parse(storedValue as string)
    } else {
      // 否则，我们应该从 localstorage 或替代存储加载
      return JSON.parse(localStorage.getItem(key) as string)
    }
  },
  setItem: (key, newValue): void => {
    // 检查查询参数是否存在，如果始终想要设置 URL 可以删除检查
    if (getUrlSearch()) {
      const searchParams = new URLSearchParams(getUrlSearch())
      searchParams.set(key, JSON.stringify(newValue))
      window.history.replaceState(null, '', `?${searchParams.toString()}`)
    }

    localStorage.setItem(key, JSON.stringify(newValue))
  },
  removeItem: (key): void => {
    const searchParams = new URLSearchParams(getUrlSearch())
    searchParams.delete(key)
    window.location.search = searchParams.toString()
  },
}

type LocalAndUrlStore = {
  typesOfFish: string[]
  addTypeOfFish: (fishType: string) => void
  numberOfBears: number
  setNumberOfBears: (newNumber: number) => void
}

const storageOptions = {
  name: 'fishAndBearsStore',
  storage: createJSONStorage<LocalAndUrlStore>(() => persistentStorage),
}

const useLocalAndUrlStore = create(
  persist<LocalAndUrlStore>(
    (set) => ({
      typesOfFish: [],
      addTypeOfFish: (fishType) =>
        set((state) => ({ typesOfFish: [...state.typesOfFish, fishType] })),

      numberOfBears: 0,
      setNumberOfBears: (numberOfBears) => set(() => ({ numberOfBears })),
    }),
    storageOptions,
  ),
)

export default useLocalAndUrlStore
```

从组件生成 URL 时，你可以调用 buildShareableUrl：

```ts
const buildURLSuffix = (params, version = 0) => {
  const searchParams = new URLSearchParams()

  const zustandStoreParams = {
    state: {
      typesOfFish: params.typesOfFish,
      numberOfBears: params.numberOfBears,
    },
    version: version, // version 在这里是因为这是 Zustand 设置状态时包含的内容
  }

  // URL 参数键应该与 store 的名称匹配，如上面 storageOptions 中指定的
  searchParams.set('fishAndBearsStore', JSON.stringify(zustandStoreParams))
  return searchParams.toString()
}

export const buildShareableUrl = (params, version) => {
  return `${window.location.origin}?${buildURLSuffix(params, version)}`
}
```

生成的 URL 看起来像这样（这里没有任何编码，为了可读性）：

`https://localhost/search?fishAndBearsStore={"state":{"typesOfFish":["tilapia","salmon"],"numberOfBears":15},"version":0}}`
