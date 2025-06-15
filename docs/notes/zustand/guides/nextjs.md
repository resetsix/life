---
title: 在 Next.js 中设置
createTime: 2025/06/15 17:52:18
permalink: /zustand/34ckjerl/
---

[Next.js](https://nextjs.org) 是一个流行的 React 服务端渲染框架，在正确使用 Zustand 时会遇到一些独特的挑战。请记住，Zustand store 是一个全局变量（也称为模块状态），这使得使用 `Context` 成为可选项。这些挑战包括：

- **每个请求的 store**：Next.js 服务器可以同时处理多个请求。这意味着 store 应该按请求创建，不应在请求之间共享。
- **SSR 友好**：Next.js 应用程序会渲染两次，首先在服务器上，然后在客户端上。在客户端和服务器上有不同的输出会导致"水合错误"。store 必须在服务器上初始化，然后在客户端用相同的数据重新初始化以避免这种情况。请在我们的 [SSR 和水合](./ssr-and-hydration) 指南中阅读更多相关内容。
- **SPA 路由友好**：Next.js 支持客户端路由的混合模型，这意味着为了重置 store，我们需要使用 `Context` 在组件级别初始化它。
- **服务器缓存友好**：Next.js 的最新版本（特别是使用 App Router 架构的应用程序）支持激进的服务器缓存。由于我们的 store 是一个**模块状态**，它与这种缓存完全兼容。

我们对 Zustand 的适当使用有以下一般建议：

- **没有全局 stores** - 因为 store 不应在请求之间共享，所以不应将其定义为全局变量。相反，应该按请求创建 store。
- **React Server Components 不应从 store 读取或写入** - RSCs 不能使用 hooks 或 context。它们不是有状态的。让 RSC 从全局 store 读取或写入值违反了 Next.js 的架构。

### 为每个请求创建 store

让我们编写我们的 store 工厂函数，它将为每个请求创建一个新的 store。

```json
// tsconfig.json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

> **注意**：不要忘记从你的 `tsconfig.json` 文件中删除所有注释。

```ts
// src/stores/counter-store.ts
import { createStore } from 'zustand/vanilla'

export type CounterState = {
  count: number
}

export type CounterActions = {
  decrementCount: () => void
  incrementCount: () => void
}

export type CounterStore = CounterState & CounterActions

export const defaultInitState: CounterState = {
  count: 0,
}

export const createCounterStore = (
  initState: CounterState = defaultInitState,
) => {
  return createStore<CounterStore>()((set) => ({
    ...initState,
    decrementCount: () => set((state) => ({ count: state.count - 1 })),
    incrementCount: () => set((state) => ({ count: state.count + 1 })),
  }))
}
```

### 提供 store

让我们在组件中使用 `createCounterStore` 并使用 context provider 共享它。

```tsx
// src/providers/counter-store-provider.tsx
'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { type CounterStore, createCounterStore } from '@/stores/counter-store'

export type CounterStoreApi = ReturnType<typeof createCounterStore>

export const CounterStoreContext = createContext<CounterStoreApi | undefined>(
  undefined,
)

export interface CounterStoreProviderProps {
  children: ReactNode
}

export const CounterStoreProvider = ({
  children,
}: CounterStoreProviderProps) => {
  const storeRef = useRef<CounterStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createCounterStore()
  }

  return (
    <CounterStoreContext.Provider value={storeRef.current}>
      {children}
    </CounterStoreContext.Provider>
  )
}

export const useCounterStore = <T,>(
  selector: (store: CounterStore) => T,
): T => {
  const counterStoreContext = useContext(CounterStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}
```

> **注意**：在这个例子中，我们通过检查引用的值来确保这个组件是重新渲染安全的，这样 store 只会被创建一次。这个组件在服务器上每个请求只会渲染一次，但如果在树中位于此组件上方有有状态的客户端组件，或者此组件也包含导致重新渲染的其他可变状态，则可能在客户端上重新渲染多次。

### 初始化 store

```ts
// src/stores/counter-store.ts
import { createStore } from 'zustand/vanilla'

export type CounterState = {
  count: number
}

export type CounterActions = {
  decrementCount: () => void
  incrementCount: () => void
}

export type CounterStore = CounterState & CounterActions

export const initCounterStore = (): CounterState => {
  return { count: new Date().getFullYear() }
}

export const defaultInitState: CounterState = {
  count: 0,
}

export const createCounterStore = (
  initState: CounterState = defaultInitState,
) => {
  return createStore<CounterStore>()((set) => ({
    ...initState,
    decrementCount: () => set((state) => ({ count: state.count - 1 })),
    incrementCount: () => set((state) => ({ count: state.count + 1 })),
  }))
}
```

```tsx
// src/providers/counter-store-provider.tsx
'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import {
  type CounterStore,
  createCounterStore,
  initCounterStore,
} from '@/stores/counter-store'

export type CounterStoreApi = ReturnType<typeof createCounterStore>

export const CounterStoreContext = createContext<CounterStoreApi | undefined>(
  undefined,
)

export interface CounterStoreProviderProps {
  children: ReactNode
}

export const CounterStoreProvider = ({
  children,
}: CounterStoreProviderProps) => {
  const storeRef = useRef<CounterStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createCounterStore(initCounterStore())
  }

  return (
    <CounterStoreContext.Provider value={storeRef.current}>
      {children}
    </CounterStoreContext.Provider>
  )
}

export const useCounterStore = <T,>(
  selector: (store: CounterStore) => T,
): T => {
  const counterStoreContext = useContext(CounterStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}
```

### 在不同架构中使用 store

Next.js 应用程序有两种架构：[Pages Router](https://nextjs.org/docs/pages/building-your-application/routing) 和 [App Router](https://nextjs.org/docs/app/building-your-application/routing)。在两种架构上使用 Zustand 应该是相同的，只是与每种架构相关的细微差别。

#### Pages Router

```tsx
// src/components/pages/home-page.tsx
import { useCounterStore } from '@/providers/counter-store-provider.ts'

export const HomePage = () => {
  const { count, incrementCount, decrementCount } = useCounterStore(
    (state) => state,
  )

  return (
    <div>
      计数: {count}
      <hr />
      <button type="button" onClick={incrementCount}>
        增加计数
      </button>
      <button type="button" onClick={decrementCount}>
        减少计数
      </button>
    </div>
  )
}
```

```tsx
// src/_app.tsx
import type { AppProps } from 'next/app'

import { CounterStoreProvider } from '@/providers/counter-store-provider.tsx'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CounterStoreProvider>
      <Component {...pageProps} />
    </CounterStoreProvider>
  )
}
```

```tsx
// src/pages/index.tsx
import { HomePage } from '@/components/pages/home-page.tsx'

export default function Home() {
  return <HomePage />
}
```

> **注意**：为每个路由创建 store 需要在页面（路由）组件级别创建和共享 store。如果你不需要为每个路由创建 store，请尽量不要使用这种方式。

```tsx
// src/pages/index.tsx
import { CounterStoreProvider } from '@/providers/counter-store-provider.tsx'
import { HomePage } from '@/components/pages/home-page.tsx'

export default function Home() {
  return (
    <CounterStoreProvider>
      <HomePage />
    </CounterStoreProvider>
  )
}
```

#### App Router

```tsx
// src/components/pages/home-page.tsx
'use client'

import { useCounterStore } from '@/providers/counter-store-provider'

export const HomePage = () => {
  const { count, incrementCount, decrementCount } = useCounterStore(
    (state) => state,
  )

  return (
    <div>
      计数: {count}
      <hr />
      <button type="button" onClick={incrementCount}>
        增加计数
      </button>
      <button type="button" onClick={decrementCount}>
        减少计数
      </button>
    </div>
  )
}
```

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { CounterStoreProvider } from '@/providers/counter-store-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CounterStoreProvider>{children}</CounterStoreProvider>
      </body>
    </html>
  )
}
```

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { CounterStoreProvider } from '@/providers/counter-store-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CounterStoreProvider>{children}</CounterStoreProvider>
      </body>
    </html>
  )
}
```

```tsx
// src/app/page.tsx
import { HomePage } from '@/components/pages/home-page'

export default function Home() {
  return <HomePage />
}
```

> **注意**：为每个路由创建 store 需要在页面（路由）组件级别创建和共享 store。如果你不需要为每个路由创建 store，请尽量不要使用这种方式。

```tsx
// src/app/page.tsx
import { CounterStoreProvider } from '@/providers/counter-store-provider'
import { HomePage } from '@/components/pages/home-page'

export default function Home() {
  return (
    <CounterStoreProvider>
      <HomePage />
    </CounterStoreProvider>
  )
}
```
