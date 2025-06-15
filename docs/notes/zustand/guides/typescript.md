---
title: TypeScript 指南
createTime: 2025/06/15 17:52:18
permalink: /zustand/xsr0ah5i/
---

## 基本用法

使用 TypeScript 时的区别是，你需要编写 `create<T>()(...)` 而不是 `create(...)`（注意额外的括号 `()` 以及类型参数），其中 `T` 是要注释的状态类型。例如：

```ts
import { create } from 'zustand'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))
```

<details>
  <summary>为什么我们不能简单地从初始状态推断类型？</summary>

  <br/>

**简答**：因为状态泛型 `T` 是不变的。

考虑这个最小版本的 `create`：

```ts
declare const create: <T>(f: (get: () => T) => T) => T

const x = create((get) => ({
  foo: 0,
  bar: () => get(),
}))
// `x` 被推断为 `unknown` 而不是
// interface X {
//   foo: number,
//   bar: () => X
// }
```

这里，如果你查看 `create` 中 `f` 的类型，即 `(get: () => T) => T`，它通过返回"给出" `T`（使其协变），但它也通过 `get`"接受" `T`（使其逆变）。"那么 `T` 从哪里来？" TypeScript 想知道。这就像鸡和蛋的问题。最后 TypeScript 放弃并将 `T` 推断为 `unknown`。

所以，只要要推断的泛型是不变的（即既协变又逆变），TypeScript 就无法推断它。

</details>

<details>
  <summary>为什么要柯里化 `()(...)`？</summary>

  <br/>

**简答**：这是 [microsoft/TypeScript#10571](https://github.com/microsoft/TypeScript/issues/10571) 的解决方案。

想象你有这样的场景：

```ts
declare const withError: <T, E>(
  p: Promise<T>,
) => Promise<[error: undefined, value: T] | [error: E, value: undefined]>
declare const doSomething: () => Promise<string>

const main = async () => {
  let [error, value] = await withError(doSomething())
}
```

这里，`T` 被推断为 `string`，`E` 被推断为 `unknown`。你可能想将 `E` 注释为 `Foo`，因为你确定 `doSomething()` 会抛出的错误的形状。然而，你不能这样做。你要么传递所有泛型，要么都不传递。除了将 `E` 注释为 `Foo`，你还必须将 `T` 注释为 `string`，即使它无论如何都会被推断。解决方案是制作一个柯里化版本的 `withError`，它在运行时什么都不做。它的目的只是让你注释 `E`。

```ts
declare const withError: {
  <E>(): <T>(
    p: Promise<T>,
  ) => Promise<[error: undefined, value: T] | [error: E, value: undefined]>
  <T, E>(
    p: Promise<T>,
  ): Promise<[error: undefined, value: T] | [error: E, value: undefined]>
}

const main = async () => {
  let [error, value] = await withError<Foo>()(doSomething())
}
```

这样，`T` 被推断，你可以注释 `E`。Zustand 在我们想要注释状态（第一个类型参数）但允许其他参数被推断时有相同的用例。

</details>

或者，你也可以使用 `combine`，它推断状态，这样你就不需要输入它。

```ts
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

const useBearStore = create(
  combine({ bears: 0 }, (set) => ({
    increase: (by: number) => set((state) => ({ bears: state.bears + by })),
  })),
)
```

<details>
  <summary>小心一点</summary>

  <br/>

我们通过在你作为参数接收的 `set`、`get` 和 `store` 的类型中稍微撒谎来实现推断。谎言是它们被类型化为好像状态是第一个参数，而实际上状态是第一个参数和第二个参数返回的浅合并（`{ ...a, ...b }`）。例如，来自第二个参数的 `get` 具有类型 `() => { bears: number }`，这是一个谎言，因为它应该是 `() => { bears: number, increase: (by: number) => void }`。而 `useBearStore` 仍然具有正确的类型；例如，`useBearStore.getState` 被类型化为 `() => { bears: number, increase: (by: number) => void }`。

这实际上不是谎言，因为 `{ bears: number }` 仍然是 `{ bears: number, increase: (by: number) => void }` 的子类型。因此，在大多数情况下不会有问题。你只需要在使用替换时小心。例如，`set({ bears: 0 }, true)` 会编译但会不健全，因为它会删除 `increase` 函数。

`combine` 为了不必为状态编写类型的便利性而牺牲了一点类型安全性。因此，你应该相应地使用 `combine`。在大多数情况下都很好，你可以方便地使用它。

</details>

注意，当使用 `combine` 时我们不使用柯里化版本，因为 `combine`"创建"状态。当使用创建状态的中间件时，不需要使用柯里化版本，因为现在可以推断状态。另一个创建状态的中间件是 `redux`。所以当使用 `combine`、`redux` 或任何其他创建状态的自定义中间件时，我们不建议使用柯里化版本。

如果你想在状态声明之外也推断状态类型，你可以使用 `ExtractState` 类型助手：

```ts
import { create, ExtractState } from 'zustand'
import { combine } from 'zustand/middleware'

type BearState = ExtractState<typeof useBearStore>

const useBearStore = create(
  combine({ bears: 0 }, (set) => ({
    increase: (by: number) => set((state) => ({ bears: state.bears + by })),
  })),
)
```

## 使用中间件

在 TypeScript 中使用中间件不需要做任何特殊的事情。

```ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        bears: 0,
        increase: (by) => set((state) => ({ bears: state.bears + by })),
      }),
      { name: 'bearStore' },
    ),
  ),
)
```

只要确保你在 `create` 内部立即使用它们，以便使上下文推断工作。做一些甚至稍微花哨的事情，如下面的 `myMiddlewares` 将需要更高级的类型。

另外，我们建议尽可能最后使用 `devtools` 中间件。例如，当你将它与 `immer` 作为中间件一起使用时，它应该是 `devtools(immer(...))` 而不是 `immer(devtools(...))`。这是因为 `devtools` 改变了 `setState` 并在其上添加了一个类型参数，如果其他中间件（如 `immer`）也在 `devtools` 之前改变 `setState`，这可能会丢失。因此在最后使用 `devtools` 确保没有中间件在它之前改变 `setState`。

## 编写中间件和高级用法

想象你必须编写这个假设的中间件。

```ts
import { create } from 'zustand'

const foo = (f, bar) => (set, get, store) => {
  store.foo = bar
  return f(set, get, store)
}

const useBearStore = create(foo(() => ({ bears: 0 }), 'hello'))
console.log(useBearStore.foo.toUpperCase())
```

Zustand 中间件可以改变 store。但我们如何在类型级别上编码这种改变呢？也就是说，我们如何为 `foo` 添加类型，使这段代码能够编译？

对于通常的静态类型语言，这是不可能的。但多亏了 TypeScript，Zustand 有一个叫做"高阶变异器"的东西，使这成为可能。如果你正在处理复杂的类型问题，比如为中间件添加类型或使用 `StateCreator` 类型，你将必须理解这个实现细节。为此，你可以[查看 #710](https://github.com/pmndrs/zustand/issues/710)。

如果你急于知道这个特定问题的答案，那么你可以[在这里看到它](#改变-store-类型的中间件)。

### 处理动态 `replace` 标志

如果 `replace` 标志的值在编译时不知道并且是动态确定的，你可能会遇到问题。为了处理这个问题，你可以使用一个解决方案，通过用 `setState` 函数的参数注释 `replace` 参数：

```ts
const replaceFlag = Math.random() > 0.5
const args = [{ bears: 5 }, replaceFlag] as Parameters<
  typeof useBearStore.setState
>
store.setState(...args)
```

#### 使用 `as Parameters` 解决方案的示例

```ts
import { create } from 'zustand'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))

const replaceFlag = Math.random() > 0.5
const args = [{ bears: 5 }, replaceFlag] as Parameters<
  typeof useBearStore.setState
>
useBearStore.setState(...args) // 使用解决方案
```

通过遵循这种方法，你可以确保你的代码处理动态 `replace` 标志而不会遇到类型问题。

## 常见配方

### 不改变 store 类型的中间件

```ts
import { create, StateCreator, StoreMutatorIdentifier } from 'zustand'

type Logger = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string,
) => StateCreator<T, Mps, Mcs>

type LoggerImpl = <T>(
  f: StateCreator<T, [], []>,
  name?: string,
) => StateCreator<T, [], []>

const loggerImpl: LoggerImpl = (f, name) => (set, get, store) => {
  const loggedSet: typeof set = (...a) => {
    set(...(a as Parameters<typeof set>))
    console.log(...(name ? [`${name}:`] : []), get())
  }
  const setState = store.setState
  store.setState = (...a) => {
    setState(...(a as Parameters<typeof setState>))
    console.log(...(name ? [`${name}:`] : []), store.getState())
  }

  return f(loggedSet, get, store)
}

export const logger = loggerImpl as unknown as Logger

// ---

const useBearStore = create<BearState>()(
  logger(
    (set) => ({
      bears: 0,
      increase: (by) => set((state) => ({ bears: state.bears + by })),
    }),
    'bear-store',
  ),
)
```

### 改变 store 类型的中间件

```ts
import {
  create,
  StateCreator,
  StoreMutatorIdentifier,
  Mutate,
  StoreApi,
} from 'zustand'

type Foo = <
  T,
  A,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<T, [...Mps, ['foo', A]], Mcs>,
  bar: A,
) => StateCreator<T, Mps, [['foo', A], ...Mcs]>

declare module 'zustand' {
  interface StoreMutators<S, A> {
    foo: Write<Cast<S, object>, { foo: A }>
  }
}

type FooImpl = <T, A>(
  f: StateCreator<T, [], []>,
  bar: A,
) => StateCreator<T, [], []>

const fooImpl: FooImpl = (f, bar) => (set, get, _store) => {
  type T = ReturnType<typeof f>
  type A = typeof bar

  const store = _store as Mutate<StoreApi<T>, [['foo', A]]>
  store.foo = bar
  return f(set, get, _store)
}

export const foo = fooImpl as unknown as Foo

type Write<T extends object, U extends object> = Omit<T, keyof U> & U

type Cast<T, U> = T extends U ? T : U

// ---

const useBearStore = create(foo(() => ({ bears: 0 }), 'hello'))
console.log(useBearStore.foo.toUpperCase())
```

### 不使用柯里化解决方案的 `create`

使用 `create` 的推荐方法是使用柯里化解决方案，如：`create<T>()(...)` 。这是因为它使你能够推断 store 类型。但如果由于某种原因你不想使用解决方案，你可以像下面这样传递类型参数。注意，在某些情况下，这充当断言而不是注释，所以我们不推荐它。

```ts
import { create } from "zustand"

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<
  BearState,
  [
    ['zustand/persist', BearState],
    ['zustand/devtools', never]
  ]
>(devtools(persist((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}), { name: 'bearStore' }))
```

### 切片模式

```ts
import { create, StateCreator } from 'zustand'

interface BearSlice {
  bears: number
  addBear: () => void
  eatFish: () => void
}

interface FishSlice {
  fishes: number
  addFish: () => void
}

interface SharedSlice {
  addBoth: () => void
  getBoth: () => void
}

const createBearSlice: StateCreator<
  BearSlice & FishSlice,
  [],
  [],
  BearSlice
> = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
})

const createFishSlice: StateCreator<
  BearSlice & FishSlice,
  [],
  [],
  FishSlice
> = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
})

const createSharedSlice: StateCreator<
  BearSlice & FishSlice,
  [],
  [],
  SharedSlice
> = (set, get) => ({
  addBoth: () => {
    // 你可以重用之前的方法
    get().addBear()
    get().addFish()
    // 或者从头开始做
    // set((state) => ({ bears: state.bears + 1, fishes: state.fishes + 1 })
  },
  getBoth: () => get().bears + get().fishes,
})

const useBoundStore = create<BearSlice & FishSlice & SharedSlice>()((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
  ...createSharedSlice(...a),
}))
```

关于切片模式的详细解释可以在[这里](./slices-pattern.md)找到。

如果你有一些中间件，那么将 `StateCreator<MyState, [], [], MySlice>` 替换为 `StateCreator<MyState, Mutators, [], MySlice>`。例如，如果你使用 `devtools`，那么它将是 `StateCreator<MyState, [["zustand/devtools", never]], [], MySlice>`。请参阅["中间件及其变异器参考"](#中间件及其变异器参考)部分以获取所有变异器的列表。

### vanilla stores 的绑定 `useStore` hook

```ts
import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const bearStore = createStore<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))

function useBearStore(): BearState
function useBearStore<T>(selector: (state: BearState) => T): T
function useBearStore<T>(selector?: (state: BearState) => T) {
  return useStore(bearStore, selector!)
}
```

### 为 vanilla stores 绑定 `useStore` hook

```ts
import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const bearStore = createStore<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))

function useBearStore(): BearState
function useBearStore<T>(selector: (state: BearState) => T): T
function useBearStore<T>(selector?: (state: BearState) => T) {
  return useStore(bearStore, selector!)
}
```

如果你需要经常创建绑定的 `useStore` hooks 并想要保持 DRY，你也可以创建一个抽象的 `createBoundedUseStore` 函数...

```ts
import { useStore, StoreApi } from 'zustand'
import { createStore } from 'zustand/vanilla'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const bearStore = createStore<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))

const createBoundedUseStore = ((store) => (selector) =>
  useStore(store, selector)) as <S extends StoreApi<unknown>>(
  store: S,
) => {
  (): ExtractState<S>
  <T>(selector: (state: ExtractState<S>) => T): T
}

type ExtractState<S> = S extends { getState: () => infer X } ? X : never

const useBearStore = createBoundedUseStore(bearStore)
```

## 中间件及其变异器参考

- `devtools` — `["zustand/devtools", never]`
- `persist` — `["zustand/persist", YourPersistedState]`<br/>
  `YourPersistedState` 是你要持久化的状态类型，即 `options.partialize` 的返回类型，如果你没有传递 `partialize` 选项，`YourPersistedState` 变成 `Partial<YourState>`。另外[有时](https://github.com/pmndrs/zustand/issues/980#issuecomment-1162289836)传递实际的 `PersistedState` 不会工作。在这些情况下，尝试传递 `unknown`。
- `immer` — `["zustand/immer", never]`
- `subscribeWithSelector` — `["zustand/subscribeWithSelector", never]`
- `redux` — `["zustand/redux", YourAction]`
- `combine` — 没有变异器，因为 `combine` 不会改变 store
