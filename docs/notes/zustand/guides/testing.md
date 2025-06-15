---
title: 测试
description: 编写测试
createTime: 2025/06/15 17:52:18
permalink: /zustand/pmh35ug7/
---

## 设置测试环境

### 测试运行器

通常，你的测试运行器需要配置为运行 JavaScript/TypeScript 语法。如果你要测试 UI 组件，你可能需要配置测试运行器使用 JSDOM 来提供模拟的 DOM 环境。

查看这些资源获取测试运行器配置说明：

- **Jest**
  - [Jest: 入门](https://jestjs.io/docs/getting-started)
  - [Jest: 配置 - 测试环境](https://jestjs.io/docs/configuration#testenvironment-string)
- **Vitest**
  - [Vitest: 入门](https://vitest.dev/guide)
  - [Vitest: 配置 - 测试环境](https://vitest.dev/config/#environment)

### UI 和网络测试工具

**我们推荐使用 [React Testing Library (RTL)](https://testing-library.com/docs/react-testing-library/intro) 来测试连接到 Zustand 的 React 组件**。RTL 是一个简单而完整的 React DOM 测试工具，鼓励良好的测试实践。它使用 ReactDOM 的 `render` 函数和来自 `react-dom/tests-utils` 的 `act`。此外，[Native Testing Library (RNTL)](https://testing-library.com/docs/react-native-testing-library/intro) 是 RTL 的替代品，用于测试 React Native 组件。[Testing Library](https://testing-library.com/) 工具系列还包括许多其他流行框架的适配器。

我们还推荐使用 [Mock Service Worker (MSW)](https://mswjs.io/) 来模拟网络请求，因为这意味着在编写测试时不需要更改或模拟你的应用程序逻辑。

- **React Testing Library (DOM)**
  - [DOM Testing Library: 设置](https://testing-library.com/docs/dom-testing-library/setup)
  - [React Testing Library: 设置](https://testing-library.com/docs/react-testing-library/setup)
  - [Testing Library Jest-DOM 匹配器](https://testing-library.com/docs/ecosystem-jest-dom)
- **Native Testing Library (React Native)**
  - [Native Testing Library: 设置](https://testing-library.com/docs/react-native-testing-library/setup)
- **User Event Testing Library (DOM)**
  - [User Event Testing Library: 设置](https://testing-library.com/docs/user-event/setup)
- **TypeScript for Jest**
  - [TypeScript for Jest: 设置](https://kulshekhar.github.io/ts-jest/docs/getting-started/installation)
- **TypeScript for Node**
  - [TypeScript for Node: 设置](https://typestrong.org/ts-node/docs/installation)
- **Mock Service Worker**
  - [MSW: 安装](https://mswjs.io/docs/getting-started/install)
  - [MSW: 设置模拟请求](https://mswjs.io/docs/getting-started/mocks/rest-api)
  - [MSW: Node 的模拟服务器配置](https://mswjs.io/docs/getting-started/integrate/node)

## 为测试设置 Zustand

> **注意**：由于 Jest 和 Vitest 有轻微的差异，比如 Vitest 使用 **ES 模块** 而 Jest 使用 **CommonJS 模块**，如果你使用 Vitest 而不是 Jest，你需要记住这一点。

下面提供的 mock 将使相关的测试运行器能够在每次测试后重置 zustand stores。

### 仅用于测试目的的共享代码

这个共享代码是为了避免在我们的演示中重复代码，因为我们对两种实现都使用相同的计数器 store 创建器，有和没有 `Context` API — 分别是 `createStore` 和 `create`。

```ts
// shared/counter-store-creator.ts
import { type StateCreator } from 'zustand'

export type CounterStore = {
  count: number
  inc: () => void
}

export const counterStoreCreator: StateCreator<CounterStore> = (set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
})
```

### Jest

在接下来的步骤中，我们将设置我们的 Jest 环境以模拟 Zustand。

```ts
// __mocks__/zustand.ts
import { act } from '@testing-library/react'
import type * as ZustandExportedTypes from 'zustand'
export * from 'zustand'

const { create: actualCreate, createStore: actualCreateStore } =
  jest.requireActual<typeof ZustandExportedTypes>('zustand')

// 一个变量来保存应用中声明的所有 stores 的重置函数
export const storeResetFns = new Set<() => void>()

const createUncurried = <T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  const store = actualCreate(stateCreator)
  const initialState = store.getInitialState()
  storeResetFns.add(() => {
    store.setState(initialState, true)
  })
  return store
}

// 当创建一个 store 时，我们获取其初始状态，创建一个重置函数并将其添加到集合中
export const create = (<T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  console.log('zustand create mock')

  // 支持 create 的柯里化版本
  return typeof stateCreator === 'function'
    ? createUncurried(stateCreator)
    : createUncurried
}) as typeof ZustandExportedTypes.create

const createStoreUncurried = <T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  const store = actualCreateStore(stateCreator)
  const initialState = store.getInitialState()
  storeResetFns.add(() => {
    store.setState(initialState, true)
  })
  return store
}

// 当创建一个 store 时，我们获取其初始状态，创建一个重置函数并将其添加到集合中
export const createStore = (<T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  console.log('zustand createStore mock')

  // 支持 createStore 的柯里化版本
  return typeof stateCreator === 'function'
    ? createStoreUncurried(stateCreator)
    : createStoreUncurried
}) as typeof ZustandExportedTypes.createStore

// 在每次测试运行后重置所有 stores
afterEach(() => {
  act(() => {
    storeResetFns.forEach((resetFn) => {
      resetFn()
    })
  })
})
```

```ts
// setup-jest.ts
import '@testing-library/jest-dom'
```

```ts
// jest.config.ts
import type { JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./setup-jest.ts'],
}

export default config
```

> **注意**：要使用 TypeScript，我们需要安装两个包 `ts-jest` 和 `ts-node`。

### Vitest

在接下来的步骤中，我们将设置我们的 Vitest 环境以模拟 Zustand。

> **警告**：在 Vitest 中你可以更改 [root](https://vitest.dev/config/#root)。因此，你需要确保在正确的位置创建你的 `__mocks__` 目录。假设你将 **root** 更改为 `./src`，这意味着你需要在 `./src` 下创建一个 `__mocks__` 目录。最终结果将是 `./src/__mocks__`，而不是 `./__mocks__`。在错误的位置创建 `__mocks__` 目录可能导致使用 Vitest 时出现问题。

```ts
// __mocks__/zustand.ts
import { act } from '@testing-library/react'
import type * as ZustandExportedTypes from 'zustand'
export * from 'zustand'

const { create: actualCreate, createStore: actualCreateStore } =
  await vi.importActual<typeof ZustandExportedTypes>('zustand')

// 一个变量来保存应用中声明的所有 stores 的重置函数
export const storeResetFns = new Set<() => void>()

const createUncurried = <T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  const store = actualCreate(stateCreator)
  const initialState = store.getInitialState()
  storeResetFns.add(() => {
    store.setState(initialState, true)
  })
  return store
}

// 当创建一个 store 时，我们获取其初始状态，创建一个重置函数并将其添加到集合中
export const create = (<T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  console.log('zustand create mock')

  // 支持 create 的柯里化版本
  return typeof stateCreator === 'function'
    ? createUncurried(stateCreator)
    : createUncurried
}) as typeof ZustandExportedTypes.create

const createStoreUncurried = <T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  const store = actualCreateStore(stateCreator)
  const initialState = store.getInitialState()
  storeResetFns.add(() => {
    store.setState(initialState, true)
  })
  return store
}

// 当创建一个 store 时，我们获取其初始状态，创建一个重置函数并将其添加到集合中
export const createStore = (<T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  console.log('zustand createStore mock')

  // 支持 createStore 的柯里化版本
  return typeof stateCreator === 'function'
    ? createStoreUncurried(stateCreator)
    : createStoreUncurried
}) as typeof ZustandExportedTypes.createStore

// 在每次测试运行后重置所有 stores
afterEach(() => {
  act(() => {
    storeResetFns.forEach((resetFn) => {
      resetFn()
    })
  })
})
```

> **注意**：如果没有启用 [globals 配置](https://vitest.dev/config/#globals)，我们需要在顶部添加 `import { afterEach, vi } from 'vitest'`。

```ts
// global.d.ts
/// <reference types="vite/client" />
/// <reference types="vitest/globals" />
```

> **注意**：如果没有启用 [globals 配置](https://vitest.dev/config/#globals)，我们需要移除 `/// <reference types="vitest/globals" />`。

```ts
// setup-vitest.ts
import '@testing-library/jest-dom'

vi.mock('zustand') // 使其像 Jest 一样工作（自动模拟）
```

> **注意**：如果没有启用 [globals 配置](https://vitest.dev/config/#globals)，我们需要在顶部添加 `import { vi } from 'vitest'`。

```ts
// vitest.config.ts
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./setup-vitest.ts'],
      },
    }),
  ),
)
```

### 测试组件

在接下来的示例中，我们将使用 `useCounterStore`

> **注意**：所有这些示例都是使用 TypeScript 编写的。

```ts
// shared/counter-store-creator.ts
import { type StateCreator } from 'zustand'

export type CounterStore = {
  count: number
  inc: () => void
}

export const counterStoreCreator: StateCreator<CounterStore> = (set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
})
```

```ts
// stores/use-counter-store.ts
import { create } from 'zustand'

import {
  type CounterStore,
  counterStoreCreator,
} from '../shared/counter-store-creator'

export const useCounterStore = create<CounterStore>()(counterStoreCreator)
```

```tsx
// contexts/use-counter-store-context.tsx
import { type ReactNode, createContext, useContext, useRef } from 'react'
import { createStore } from 'zustand'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'

import {
  type CounterStore,
  counterStoreCreator,
} from '../shared/counter-store-creator'

export const createCounterStore = () => {
  return createStore<CounterStore>(counterStoreCreator)
}

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
  const counterStoreRef = useRef<CounterStoreApi>(null)
  if (!counterStoreRef.current) {
    counterStoreRef.current = createCounterStore()
  }

  return (
    <CounterStoreContext.Provider value={counterStoreRef.current}>
      {children}
    </CounterStoreContext.Provider>
  )
}

export type UseCounterStoreContextSelector<T> = (store: CounterStore) => T

export const useCounterStoreContext = <T,>(
  selector: UseCounterStoreContextSelector<T>,
): T => {
  const counterStoreContext = useContext(CounterStoreContext)

  if (counterStoreContext === undefined) {
    throw new Error(
      'useCounterStoreContext must be used within CounterStoreProvider',
    )
  }

  return useStoreWithEqualityFn(counterStoreContext, selector, shallow)
}
```

```tsx
// components/counter/counter.tsx
import { useCounterStore } from '../../stores/use-counter-store'

export function Counter() {
  const { count, inc } = useCounterStore()

  return (
    <div>
      <h2>Counter Store</h2>
      <h4>{count}</h4>
      <button onClick={inc}>One Up</button>
    </div>
  )
}
```

```ts
// components/counter/index.ts
export * from './counter'
```

```tsx
// components/counter/counter.test.tsx
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Counter } from './counter'

describe('Counter', () => {
  test('should render with initial state of 1', async () => {
    renderCounter()

    expect(await screen.findByText(/^1$/)).toBeInTheDocument()
    expect(
      await screen.findByRole('button', { name: /one up/i }),
    ).toBeInTheDocument()
  })

  test('should increase count by clicking a button', async () => {
    const user = userEvent.setup()

    renderCounter()

    expect(await screen.findByText(/^1$/)).toBeInTheDocument()

    await user.click(await screen.findByRole('button', { name: /one up/i }))

    expect(await screen.findByText(/^2$/)).toBeInTheDocument()
  })
})

const renderCounter = () => {
  return render(<Counter />)
}
```

```tsx
// components/counter-with-context/counter-with-context.tsx
import {
  CounterStoreProvider,
  useCounterStoreContext,
} from '../../contexts/use-counter-store-context'

const Counter = () => {
  const { count, inc } = useCounterStoreContext((state) => state)

  return (
    <div>
      <h2>Counter Store Context</h2>
      <h4>{count}</h4>
      <button onClick={inc}>One Up</button>
    </div>
  )
}

export const CounterWithContext = () => {
  return (
    <CounterStoreProvider>
      <Counter />
    </CounterStoreProvider>
  )
}
```

```tsx
// components/counter-with-context/index.ts
export * from './counter-with-context'
```

```tsx
// components/counter-with-context/counter-with-context.test.tsx
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { CounterWithContext } from './counter-with-context'

describe('CounterWithContext', () => {
  test('should render with initial state of 1', async () => {
    renderCounterWithContext()

    expect(await screen.findByText(/^1$/)).toBeInTheDocument()
    expect(
      await screen.findByRole('button', { name: /one up/i }),
    ).toBeInTheDocument()
  })

  test('should increase count by clicking a button', async () => {
    const user = userEvent.setup()

    renderCounterWithContext()

    expect(await screen.findByText(/^1$/)).toBeInTheDocument()

    await user.click(await screen.findByRole('button', { name: /one up/i }))

    expect(await screen.findByText(/^2$/)).toBeInTheDocument()
  })
})

const renderCounterWithContext = () => {
  return render(<CounterWithContext />)
}
```

> **注意**：如果没有启用 [globals 配置](https://vitest.dev/config/#globals)，我们需要在每个测试文件的顶部添加 `import { describe, test, expect } from 'vitest'`。

**CodeSandbox 演示**

- Jest 演示: https://stackblitz.com/edit/jest-zustand
- Vitest 演示: https://stackblitz.com/edit/vitest-zustand

### 测试 Stores

在接下来的示例中，我们将使用 `useCounterStore`

> **注意**：所有这些示例都是使用 TypeScript 编写的。

```ts
// shared/counter-store-creator.ts
import { type StateCreator } from 'zustand'

export type CounterStore = {
  count: number
  inc: () => void
}

export const counterStoreCreator: StateCreator<CounterStore> = (set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
})
```

```ts
// stores/use-counter-store.ts
import { create } from 'zustand'

import {
  type CounterStore,
  counterStoreCreator,
} from '../shared/counter-store-creator'

export const useCounterStore = create<CounterStore>()(counterStoreCreator)
```

```tsx
// contexts/use-counter-store-context.tsx
import { type ReactNode, createContext, useContext, useRef } from 'react'
import { createStore } from 'zustand'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'

import {
  type CounterStore,
  counterStoreCreator,
} from '../shared/counter-store-creator'

export const createCounterStore = () => {
  return createStore<CounterStore>(counterStoreCreator)
}

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
  const counterStoreRef = useRef<CounterStoreApi>(null)
  if (!counterStoreRef.current) {
    counterStoreRef.current = createCounterStore()
  }

  return (
    <CounterStoreContext.Provider value={counterStoreRef.current}>
      {children}
    </CounterStoreContext.Provider>
  )
}

export type UseCounterStoreContextSelector<T> = (store: CounterStore) => T

export const useCounterStoreContext = <T,>(
  selector: UseCounterStoreContextSelector<T>,
): T => {
  const counterStoreContext = useContext(CounterStoreContext)

  if (counterStoreContext === undefined) {
    throw new Error(
      'useCounterStoreContext must be used within CounterStoreProvider',
    )
  }

  return useStoreWithEqualityFn(counterStoreContext, selector, shallow)
}
```

```tsx
// components/counter/counter.tsx
import { useCounterStore } from '../../stores/use-counter-store'

export function Counter() {
  const { count, inc } = useCounterStore()

  return (
    <div>
      <h2>Counter Store</h2>
      <h4>{count}</h4>
      <button onClick={inc}>One Up</button>
    </div>
  )
}
```

```ts
// components/counter/index.ts
export * from './counter'
```

```tsx
// components/counter/counter.test.tsx
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Counter, useCounterStore } from '../../../stores/use-counter-store.ts'

describe('Counter', () => {
  test('should render with initial state of 1', async () => {
    renderCounter()

    expect(useCounterStore.getState().count).toBe(1)
  })

  test('should increase count by clicking a button', async () => {
    const user = userEvent.setup()

    renderCounter()

    expect(useCounterStore.getState().count).toBe(1)

    await user.click(await screen.findByRole('button', { name: /one up/i }))

    expect(useCounterStore.getState().count).toBe(2)
  })
})

const renderCounter = () => {
  return render(<Counter />)
}
```

```tsx
// components/counter-with-context/counter-with-context.tsx
import {
  CounterStoreProvider,
  useCounterStoreContext,
} from '../../contexts/use-counter-store-context'

const Counter = () => {
  const { count, inc } = useCounterStoreContext((state) => state)

  return (
    <div>
      <h2>Counter Store Context</h2>
      <h4>{count}</h4>
      <button onClick={inc}>One Up</button>
    </div>
  )
}

export const CounterWithContext = () => {
  return (
    <CounterStoreProvider>
      <Counter />
    </CounterStoreProvider>
  )
}
```

```tsx
// components/counter-with-context/index.ts
export * from './counter-with-context'
```

```tsx
// components/counter-with-context/counter-with-context.test.tsx
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { CounterStoreContext } from '../../../contexts/use-counter-store-context'
import { counterStoreCreator } from '../../../shared/counter-store-creator'

describe('CounterWithContext', () => {
  test('should render with initial state of 1', async () => {
    const counterStore = counterStoreCreator()

    renderCounterWithContext(counterStore)

    expect(counterStore.getState().count).toBe(1)
    expect(
      await screen.findByRole('button', { name: /one up/i }),
    ).toBeInTheDocument()
  })

  test('should increase count by clicking a button', async () => {
    const user = userEvent.setup()
    const counterStore = counterStoreCreator()

    renderCounterWithContext(counterStore)

    expect(counterStore.getState().count).toBe(1)

    await user.click(await screen.findByRole('button', { name: /one up/i }))

    expect(counterStore.getState().count).toBe(2)
  })
})

const renderCounterWithContext = (store) => {
  return render(<CounterWithContext />, {
    wrapper: ({ children }) => (
      <CounterStoreContext.Provider value={store}>
        {children}
      </CounterStoreContext.Provider>
    ),
  })
}
```

## 参考资料

- **React Testing Library**: [React Testing Library (RTL)](https://testing-library.com/docs/react-testing-library/intro) 是一个非常轻量级的 React 组件测试解决方案。它在 `react-dom` 和 `react-dom/test-utils` 之上提供实用函数，以鼓励更好的测试实践的方式。其主要指导原则是："你的测试越像你的软件被使用的方式，它们就能给你越多的信心。"
- **Native Testing Library**: [Native Testing Library (RNTL)](https://testing-library.com/docs/react-native-testing-library/intro) 是一个非常轻量级的 React Native 组件测试解决方案，类似于 RTL，但其函数建立在 `react-test-renderer` 之上。
- **测试实现细节**: Kent C. Dodds 关于为什么他建议避免 [测试实现细节](https://kentcdodds.com/blog/testing-implementation-details) 的博客文章。
