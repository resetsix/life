---
title: useShallow ⚛️
description: 如何记忆化选择器函数
createTime: 2025/06/15 17:52:18
permalink: /zustand/rpubhe4t/
---

`useShallow` 是一个 React Hook，让你优化重新渲染。

```js
const memoizedSelector = useShallow(selector)
```

- [类型](#类型)
  - [签名](#签名)
- [参考](#参考)
- [用法](#用法)
  - [编写记忆化选择器](#编写记忆化选择器)
- [故障排除](#故障排除)

### 签名

```ts
useShallow<T, U = T>(selectorFn: (state: T) => U): (state: T) => U
```

## 参考

### `useShallow(selectorFn)`

#### 参数

- `selectorFn`: 一个让你返回基于当前状态的数据的函数。

#### 返回值

`useShallow` 返回一个使用浅比较进行记忆化的选择器函数的记忆化版本。

## 用法

### 编写记忆化选择器

首先，我们需要设置一个 store 来保存熊家族的状态。在这个 store 中，我们定义三个属性：`papaBear`、`mamaBear` 和 `babyBear`，每个都代表熊家族的不同成员及其各自的燕麦粥锅大小。

```tsx
import { create } from 'zustand'

type BearFamilyMealsStore = {
  [key: string]: string
}

const useBearFamilyMealsStore = create<BearFamilyMealsStore>()(() => ({
  papaBear: 'large porridge-pot',
  mamaBear: 'middle-size porridge pot',
  babyBear: 'A little, small, wee pot',
}))
```

接下来，我们将创建一个 `BearNames` 组件，它检索我们状态的键（熊家族成员）并显示它们。

```tsx
function BearNames() {
  const names = useBearFamilyMealsStore((state) => Object.keys(state))

  return <div>{names.join(', ')}</div>
}
```

接下来，我们将创建一个 `UpdateBabyBearMeal` 组件，它定期更新小熊的餐食选择。

```tsx
const meals = [
  'A tiny, little, wee bowl',
  'A small, petite, tiny pot',
  'A wee, itty-bitty, small bowl',
  'A little, petite, tiny dish',
  'A tiny, small, wee vessel',
  'A small, little, wee cauldron',
  'A little, tiny, small cup',
  'A wee, small, little jar',
  'A tiny, wee, small pan',
  'A small, wee, little crock',
]

function UpdateBabyBearMeal() {
  useEffect(() => {
    const timer = setInterval(() => {
      useBearFamilyMealsStore.setState({
        babyBear: meals[Math.floor(Math.random() * (meals.length - 1))],
      })
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return null
}
```

最后，我们在 `App` 组件中组合两个组件以查看它们的运行情况。

```tsx
export default function App() {
  return (
    <>
      <UpdateBabyBearMeal />
      <BearNames />
    </>
  )
}
```

代码应该看起来像这样：

```tsx
import { useEffect } from 'react'
import { create } from 'zustand'

type BearFamilyMealsStore = {
  [key: string]: string
}

const useBearFamilyMealsStore = create<BearFamilyMealsStore>()(() => ({
  papaBear: 'large porridge-pot',
  mamaBear: 'middle-size porridge pot',
  babyBear: 'A little, small, wee pot',
}))

const meals = [
  'A tiny, little, wee bowl',
  'A small, petite, tiny pot',
  'A wee, itty-bitty, small bowl',
  'A little, petite, tiny dish',
  'A tiny, small, wee vessel',
  'A small, little, wee cauldron',
  'A little, tiny, small cup',
  'A wee, small, little jar',
  'A tiny, wee, small pan',
  'A small, wee, little crock',
]

function UpdateBabyBearMeal() {
  useEffect(() => {
    const timer = setInterval(() => {
      useBearFamilyMealsStore.setState({
        babyBear: meals[Math.floor(Math.random() * (meals.length - 1))],
      })
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return null
}

function BearNames() {
  const names = useBearFamilyMealsStore((state) => Object.keys(state))

  return <div>{names.join(', ')}</div>
}

export default function App() {
  return (
    <>
      <UpdateBabyBearMeal />
      <BearNames />
    </>
  )
}
```

一切可能看起来都很好，但有一个小问题：即使名称没有改变，`BearNames` 组件也会不断重新渲染。这是因为每当状态的任何部分发生变化时，组件都会重新渲染，即使我们关心的特定部分（名称列表）没有改变。

为了解决这个问题，我们使用 `useShallow` 来确保组件只在状态的实际键发生变化时才重新渲染：

```tsx
function BearNames() {
  const names = useBearFamilyMealsStore(
    useShallow((state) => Object.keys(state)),
  )

  return <div>{names.join(', ')}</div>
}
```

代码应该看起来像这样：

```tsx
import { useEffect } from 'react'
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

type BearFamilyMealsStore = {
  [key: string]: string
}

const useBearFamilyMealsStore = create<BearFamilyMealsStore>()(() => ({
  papaBear: 'large porridge-pot',
  mamaBear: 'middle-size porridge pot',
  babyBear: 'A little, small, wee pot',
}))

const meals = [
  'A tiny, little, wee bowl',
  'A small, petite, tiny pot',
  'A wee, itty-bitty, small bowl',
  'A little, petite, tiny dish',
  'A tiny, small, wee vessel',
  'A small, little, wee cauldron',
  'A little, tiny, small cup',
  'A wee, small, little jar',
  'A tiny, wee, small pan',
  'A small, wee, little crock',
]

function UpdateBabyBearMeal() {
  useEffect(() => {
    const timer = setInterval(() => {
      useBearFamilyMealsStore.setState({
        babyBear: meals[Math.floor(Math.random() * (meals.length - 1))],
      })
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return null
}

function BearNames() {
  const names = useBearFamilyMealsStore(
    useShallow((state) => Object.keys(state)),
  )

  return <div>{names.join(', ')}</div>
}

export default function App() {
  return (
    <>
      <UpdateBabyBearMeal />
      <BearNames />
    </>
  )
}
```

通过使用 `useShallow`，我们优化了渲染过程，确保组件只在必要时重新渲染，这提高了整体性能。

## 故障排除

此部分正在完善中。如果遇到问题，请参考 [Zustand 官方文档](https://github.com/pmndrs/zustand) 或在 GitHub 上提交 issue。
