---
title: 使用 props 初始化状态
createTime: 2025/06/15 17:52:18
permalink: /zustand/lzy33bx1/
---

在需要[依赖注入](https://en.wikipedia.org/wiki/Dependency_injection)的情况下，比如当 store 应该用组件的 props 初始化时，推荐的方法是使用 vanilla store 与 React.context。

## 使用 `createStore` 创建 store

```ts
import { createStore } from 'zustand'

interface BearProps {
  bears: number
}

interface BearState extends BearProps {
  addBear: () => void
}

type BearStore = ReturnType<typeof createBearStore>

const createBearStore = (initProps?: Partial<BearProps>) => {
  const DEFAULT_PROPS: BearProps = {
    bears: 0,
  }
  return createStore<BearState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    addBear: () => set((state) => ({ bears: ++state.bears })),
  }))
}
```

## 使用 `React.createContext` 创建 context

```ts
import { createContext } from 'react'

export const BearContext = createContext<BearStore | null>(null)
```

## 基本组件用法

```tsx
// Provider 实现
import { useRef } from 'react'

function App() {
  const store = useRef(createBearStore()).current
  return (
    <BearContext.Provider value={store}>
      <BasicConsumer />
    </BearContext.Provider>
  )
}
```

```tsx
// Consumer 组件
import { useContext } from 'react'
import { useStore } from 'zustand'

function BasicConsumer() {
  const store = useContext(BearContext)
  if (!store) throw new Error('Missing BearContext.Provider in the tree')
  const bears = useStore(store, (s) => s.bears)
  const addBear = useStore(store, (s) => s.addBear)
  return (
    <>
      <div>{bears} 只熊。</div>
      <button onClick={addBear}>添加熊</button>
    </>
  )
}
```

## 常见模式

### 包装 context provider

```tsx
// Provider 包装器
import { useRef } from 'react'

type BearProviderProps = React.PropsWithChildren<BearProps>

function BearProvider({ children, ...props }: BearProviderProps) {
  const storeRef = useRef<BearStore>()
  if (!storeRef.current) {
    storeRef.current = createBearStore(props)
  }
  return (
    <BearContext.Provider value={storeRef.current}>
      {children}
    </BearContext.Provider>
  )
}
```

### 将 context 逻辑提取到自定义 hook

```tsx
// 模仿 `create` 返回的 hook
import { useContext } from 'react'
import { useStore } from 'zustand'

function useBearContext<T>(selector: (state: BearState) => T): T {
  const store = useContext(BearContext)
  if (!store) throw new Error('Missing BearContext.Provider in the tree')
  return useStore(store, selector)
}
```

```tsx
// 自定义 hook 的 Consumer 用法
function CommonConsumer() {
  const bears = useBearContext((s) => s.bears)
  const addBear = useBearContext((s) => s.addBear)
  return (
    <>
      <div>{bears} 只熊。</div>
      <button onClick={addBear}>添加熊</button>
    </>
  )
}
```

### 可选地允许使用自定义等价函数

```tsx
// 通过使用 useStoreWithEqualityFn 而不是 useStore 来允许自定义等价函数
import { useContext } from 'react'
import { useStoreWithEqualityFn } from 'zustand/traditional'

function useBearContext<T>(
  selector: (state: BearState) => T,
  equalityFn?: (left: T, right: T) => boolean,
): T {
  const store = useContext(BearContext)
  if (!store) throw new Error('Missing BearContext.Provider in the tree')
  return useStoreWithEqualityFn(store, selector, equalityFn)
}
```

### 完整示例

```tsx
// Provider 包装器和自定义 hook consumer
function App2() {
  return (
    <BearProvider bears={2}>
      <HookConsumer />
    </BearProvider>
  )
}
```
