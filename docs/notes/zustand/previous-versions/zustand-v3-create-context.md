---
title: zustand/context 中的 createContext
createTime: 2025/06/15 17:52:18
permalink: /zustand/td2xqkf1/
---

从 v3.5 开始提供了一个特殊的 `createContext`，
它避免了误用 store hook。

> **注意**: 这个函数在 v4 中已弃用，将在 v5 中移除。请参阅[迁移](#迁移)。

```jsx
import create from 'zustand'
import createContext from 'zustand/context'

const { Provider, useStore } = createContext()

const createStore = () => create(...)

const App = () => (
  <Provider createStore={createStore}>
    ...
  </Provider>
)

const Component = () => {
  const state = useStore()
  const slice = useStore(selector)
  ...
```

## 在真实组件中使用 createContext

```jsx
import create from "zustand";
import createContext from "zustand/context";

// 最佳实践：你可以将下面的 createContext() 和 createStore 移动到一个单独的文件（store.js）中，并在这里/任何需要的地方导入 Provider、useStore。

const { Provider, useStore } = createContext();

const createStore = () =>
  create((set) => ({
    bears: 0,
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 })
  }));

const Button = () => {
  return (
      {/** store() - 这将为每次使用 Button 组件创建一个 store，而不是为所有组件使用一个 store **/}
    <Provider createStore={createStore}>
      <ButtonChild />
    </Provider>
  );
};

const ButtonChild = () => {
  const state = useStore();
  return (
    <div>
      {state.bears}
      <button
        onClick={() => {
          state.increasePopulation();
        }}
      >
        +
      </button>
    </div>
  );
};

export default function App() {
  return (
    <div className="App">
      <Button />
      <Button />
    </div>
  );
}
```

## 使用 props 初始化的 createContext 用法

```tsx
import create from 'zustand'
import createContext from 'zustand/context'

const { Provider, useStore } = createContext()

export default function App({ initialBears }) {
  return (
    <Provider
      createStore={() =>
        create((set) => ({
          bears: initialBears,
          increase: () => set((state) => ({ bears: state.bears + 1 })),
        }))
      }
    >
      <Button />
    </Provider>
  )
}
```

## 迁移

讨论：https://github.com/pmndrs/zustand/discussions/1276

这是使用 v4 API 的新 context 用法。

```jsx
import { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'

const StoreContext = createContext(null)

const StoreProvider = ({ children }) => {
  const storeRef = useRef()
  if (storeRef.current === null) {
    storeRef.current = createStore((set) => ({
      // ...
    }))
  }
  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

const useStoreInContext = (selector) => {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error('Missing StoreProvider')
  }
  return useStore(store, selector)
}
```

或者联系一些提供 Zustand v3 类似 API 的第三方库：

- <https://github.com/charkour/zustand-di>
- <https://github.com/arvinxx/zustand-utils>
