---
title: create ⚛️
description: 如何创建 stores
createTime: 2025/06/15 17:52:18
permalink: /zustand/wh6kxz91/
---

`create` 让你创建一个附带 API 工具的 React Hook。

```js
const useSomeStore = create(stateCreatorFn)
```

- [类型](#类型)
  - [签名](#create-签名)
- [参考](#参考)
- [用法](#用法)
  - [基于先前状态更新状态](#基于先前状态更新状态)
  - [更新状态中的原始值](#更新状态中的原始值)
  - [更新状态中的对象](#更新状态中的对象)
  - [更新状态中的数组](#更新状态中的数组)
  - [不使用 store actions 更新状态](#不使用-store-actions-更新状态)
  - [订阅状态更新](#订阅状态更新)
- [故障排除](#故障排除)
  - [我已经更新了状态，但屏幕没有更新](#我已经更新了状态但屏幕没有更新)

## 类型

### 签名

```ts
create<T>()(stateCreatorFn: StateCreator<T, [], []>): UseBoundStore<StoreApi<T>>
```

## 参考

### `create(stateCreatorFn)`

#### 参数

- `stateCreatorFn`: 一个接受 `set` 函数、`get` 函数和 `store` 作为参数的函数。通常，你会返回一个包含你想要暴露的方法的对象。

#### 返回值

`create` 返回一个附带 API 工具的 React Hook，包括 `setState`、`getState`、`getInitialState` 和 `subscribe`。它让你使用选择器函数返回基于当前状态的数据。它应该接受一个选择器函数作为其唯一参数。

## 用法

### 基于先前状态更新状态

要基于先前状态更新状态，我们应该使用 **更新函数**。在 [这里](https://react.dev/learn/queueing-a-series-of-state-updates) 阅读更多相关内容。

这个示例展示了如何在 **actions** 中支持 **更新函数**。

```tsx
import { create } from 'zustand'

type AgeStoreState = { age: number }

type AgeStoreActions = {
  setAge: (
    nextAge:
      | AgeStoreState['age']
      | ((currentAge: AgeStoreState['age']) => AgeStoreState['age']),
  ) => void
}

type AgeStore = AgeStoreState & AgeStoreActions

const useAgeStore = create<AgeStore>()((set) => ({
  age: 42,
  setAge: (nextAge) => {
    set((state) => ({
      age: typeof nextAge === 'function' ? nextAge(state.age) : nextAge,
    }))
  },
}))

export default function App() {
  const age = useAgeStore((state) => state.age)
  const setAge = useAgeStore((state) => state.setAge)

  function increment() {
    setAge((currentAge) => currentAge + 1)
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button
        onClick={() => {
          increment()
          increment()
          increment()
        }}
      >
        +3
      </button>
      <button
        onClick={() => {
          increment()
        }}
      >
        +1
      </button>
    </>
  )
}
```

### 更新状态中的原始值

状态可以保存任何类型的 JavaScript 值。当你想要更新内置原始值如数字、字符串、布尔值等时，你应该直接分配新值以确保更新正确应用，并避免意外行为。

> [!NOTE]
> 默认情况下，`set` 函数执行浅合并。如果你需要完全用新状态替换状态，请将 `replace` 参数设置为 `true`

```tsx
import { create } from 'zustand'

type XStore = number

const useXStore = create<XStore>()(() => 0)

export default function MovingDot() {
  const x = useXStore()
  const setX = (nextX: number) => {
    useXStore.setState(nextX, true)
  }
  const position = { y: 0, x }

  return (
    <div
      onPointerMove={(e) => {
        setX(e.clientX)
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
      />
    </div>
  )
}
```

### 更新状态中的对象

对象在 JavaScript 中是 **可变的**，但当你将它们存储在状态中时，你应该将它们视为 **不可变的**。相反，当你想要更新一个对象时，你需要创建一个新的对象（或复制现有的对象），然后设置状态以使用新对象。

默认情况下，`set` 函数执行浅合并。对于大多数只需要修改特定属性的更新，默认的浅合并是首选的，因为它更高效。要完全用新状态替换状态，请谨慎使用设置为 `true` 的 `replace` 参数，因为它会丢弃状态中任何现有的嵌套数据。

```tsx
import { create } from 'zustand'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const usePositionStore = create<PositionStore>()((set) => ({
  position: { x: 0, y: 0 },
  setPosition: (nextPosition) => set({ position: nextPosition }),
}))

export default function MovingDot() {
  const position = usePositionStore((state) => state.position)
  const setPosition = usePositionStore((state) => state.setPosition)

  return (
    <div
      onPointerMove={(e) => {
        setPosition({
          x: e.clientX,
          y: e.clientY,
        })
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
      />
    </div>
  )
}
```

### 更新状态中的数组

数组在 JavaScript 中是可变的，但当你将它们存储在状态中时，你应该将它们视为不可变的。就像对象一样，当你想要更新存储在状态中的数组时，你需要创建一个新的数组（或复制现有的数组），然后设置状态以使用新数组。

默认情况下，`set` 函数执行浅合并。要更新数组值，我们应该分配新值以确保更新正确应用，并避免意外行为。要完全用新状态替换状态，请使用设置为 `true` 的 `replace` 参数。

> [!IMPORTANT]
> 我们应该优先使用不可变操作如：`[...array]`、`concat(...)`、`filter(...)`、`slice(...)`、`map(...)`、`toSpliced(...)`、`toSorted(...)` 和 `toReversed(...)`，并避免可变操作如 `array[arrayIndex] = ...`、`push(...)`、`unshift(...)`、`pop(...)`、`shift(...)`、`splice(...)`、`reverse(...)` 和 `sort(...)`。

### 不使用 store actions 更新状态

在模块级别定义 actions，在 store 外部有一些优势，比如：它不需要 hook 来调用 action，并且它促进代码分割。

> [!NOTE]
> 推荐的方式是将 actions 和状态放在 store 内（让你的 actions 与你的状态位于一起）。

### 订阅状态更新

通过订阅状态更新，你注册一个回调，该回调在 store 的状态更新时触发。我们可以使用 `subscribe` 进行外部状态管理。

## 故障排除

### 我已经更新了状态，但屏幕没有更新

在前面的示例中，`position` 对象总是从当前光标位置新创建的。但通常，你会希望将现有数据作为你正在创建的新对象的一部分包含进来。例如，你可能只想更新表单中的一个字段，但保留所有其他字段的先前值。

这些输入字段不起作用，因为 `onChange` 处理程序改变了状态：

```tsx
// ❌ 错误：直接改变状态
function handleFirstNameChange(e: ChangeEvent<HTMLInputElement>) {
  person.firstName = e.target.value
}
```

获得你想要的行为的可靠方法是创建一个新对象并将其传递给 `setPerson`。但在这里你还想将现有数据复制到其中，因为只有一个字段发生了变化：

```ts
// ✅ 正确：创建新对象
setPerson({ ...person, firstName: e.target.value }) // 来自输入的新名字
```

> [!NOTE]
> 由于 `set` 函数默认执行浅合并，我们不需要单独复制每个属性。

现在表单工作了！

注意你没有为每个输入字段声明单独的状态变量。对于大型表单，将所有数据分组在一个对象中非常方便——只要你正确更新它！

### 不使用 store actions 更新状态

在模块级别定义 actions，在 store 外部有几个优点，如：不需要 hook 来调用 action，并且便于代码分割。

> [!NOTE]
> 推荐的方法是将 actions 和状态共同放置在 store 内（让你的 actions 与状态位于一起）。

```tsx
import { create } from 'zustand'

const usePositionStore = create<{
  x: number
  y: number
}>()(() => ({ x: 0, y: 0 }))

const setPosition: typeof usePositionStore.setState = (nextPosition) => {
  usePositionStore.setState(nextPosition)
}

export default function MovingDot() {
  const position = usePositionStore()

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
        onMouseEnter={(event) => {
          const parent = event.currentTarget.parentElement
          const parentWidth = parent.clientWidth
          const parentHeight = parent.clientHeight

          setPosition({
            x: Math.ceil(Math.random() * parentWidth),
            y: Math.ceil(Math.random() * parentHeight),
          })
        }}
      />
    </div>
  )
}
```

### 订阅状态更新

通过订阅状态更新，你注册一个回调函数，该函数在 store 的状态更新时触发。我们可以使用 `subscribe` 进行外部状态管理。

```tsx
import { useEffect } from 'react'
import { create } from 'zustand'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const usePositionStore = create<PositionStore>()((set) => ({
  position: { x: 0, y: 0 },
  setPosition: (nextPosition) => set({ position: nextPosition }),
}))

export default function MovingDot() {
  const position = usePositionStore((state) => state.position)
  const setPosition = usePositionStore((state) => state.setPosition)

  useEffect(() => {
    const unsubscribePositionStore = usePositionStore.subscribe(
      ({ position }) => {
        console.log('新位置', { position })
      },
    )

    return () => {
      unsubscribePositionStore()
    }
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
        onMouseEnter={(event) => {
          const parent = event.currentTarget.parentElement
          const parentWidth = parent.clientWidth
          const parentHeight = parent.clientHeight

          setPosition({
            x: Math.ceil(Math.random() * parentWidth),
            y: Math.ceil(Math.random() * parentHeight),
          })
        }}
      />
    </div>
  )
}
```

## 故障排除

### 我已经更新了状态，但屏幕没有更新

在前面的示例中，`position` 对象总是从当前光标位置重新创建。但通常，你会希望将现有数据作为你正在创建的新对象的一部分包含进来。例如，你可能只想更新表单中的一个字段，但保留所有其他字段的先前值。

这些输入字段不起作用，因为 `onChange` 处理程序改变了状态：

```tsx
import { create } from 'zustand'

type PersonStoreState = {
  firstName: string
  lastName: string
  email: string
}

type PersonStoreActions = {
  setPerson: (nextPerson: Partial<PersonStoreState>) => void
}

type PersonStore = PersonStoreState & PersonStoreActions

const usePersonStore = create<PersonStore>()((set) => ({
  firstName: 'Barbara',
  lastName: 'Hepworth',
  email: 'bhepworth@sculpture.com',
  setPerson: (nextPerson) => set(nextPerson),
}))

export default function Form() {
  const person = usePersonStore((state) => state)
  const setPerson = usePersonStore((state) => state.setPerson)

  function handleFirstNameChange(e: ChangeEvent<HTMLInputElement>) {
    person.firstName = e.target.value
  }

  function handleLastNameChange(e: ChangeEvent<HTMLInputElement>) {
    person.lastName = e.target.value
  }

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    person.email = e.target.value
  }

  return (
    <>
      <label style={{ display: 'block' }}>
        名字:
        <input value={person.firstName} onChange={handleFirstNameChange} />
      </label>
      <label style={{ display: 'block' }}>
        姓氏:
        <input value={person.lastName} onChange={handleLastNameChange} />
      </label>
      <label style={{ display: 'block' }}>
        邮箱:
        <input value={person.email} onChange={handleEmailChange} />
      </label>
      <p>
        {person.firstName} {person.lastName} ({person.email})
      </p>
    </>
  )
}
```

例如，这行代码改变了过去渲染的状态：

```tsx
person.firstName = e.target.value
```

获得你想要的行为的可靠方法是创建一个新对象并将其传递给 `setPerson`。但在这里你还想将现有数据复制到其中，因为只有一个字段发生了变化：

```ts
setPerson({ ...person, firstName: e.target.value }) // 来自输入的新名字
```

> [!NOTE]
> 由于 `set` 函数默认执行浅合并，我们不需要单独复制每个属性。

现在表单工作了！

注意你没有为每个输入字段声明单独的状态变量。对于大型表单，将所有数据分组在一个对象中非常方便——只要你正确更新它！

```tsx {27,31,35}
import { create } from 'zustand'

type PersonStoreState = {
  person: { firstName: string; lastName: string; email: string }
}

type PersonStoreActions = {
  setPerson: (nextPerson: PersonStoreState['person']) => void
}

type PersonStore = PersonStoreState & PersonStoreActions

const usePersonStore = create<PersonStore>()((set) => ({
  person: {
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  },
  setPerson: (nextPerson) => set(nextPerson),
}))

export default function Form() {
  const person = usePersonStore((state) => state.person)
  const setPerson = usePersonStore((state) => state.setPerson)

  function handleFirstNameChange(e: ChangeEvent<HTMLInputElement>) {
    setPerson({ ...person, firstName: e.target.value })
  }

  function handleLastNameChange(e: ChangeEvent<HTMLInputElement>) {
    setPerson({ ...person, lastName: e.target.value })
  }

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    setPerson({ ...person, email: e.target.value })
  }

  return (
    <>
      <label style={{ display: 'block' }}>
        名字:
        <input value={person.firstName} onChange={handleFirstNameChange} />
      </label>
      <label style={{ display: 'block' }}>
        姓氏:
        <input value={person.lastName} onChange={handleLastNameChange} />
      </label>
      <label style={{ display: 'block' }}>
        邮箱:
        <input value={person.email} onChange={handleEmailChange} />
      </label>
      <p>
        {person.firstName} {person.lastName} ({person.email})
      </p>
    </>
  )
}
```
