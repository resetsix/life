---
title: 使用 useShallow 防止重新渲染
createTime: 2025/06/15 17:52:18
permalink: /zustand/q4cs40wt/
---

当你需要订阅 store 中的计算状态时，推荐的方法是使用选择器。

如果输出根据 [Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is?retiredLocale=it) 发生了变化，计算选择器将导致重新渲染。

在这种情况下，如果计算值总是与前一个值浅相等，你可能想要使用 `useShallow` 来避免重新渲染。

## 示例

我们有一个 store，它将每只熊与一顿饭关联起来，我们想要渲染它们的名字。

```js
import { create } from 'zustand'

const useMeals = create(() => ({
  papaBear: 'large porridge-pot',
  mamaBear: 'middle-size porridge pot',
  littleBear: 'A little, small, wee pot',
}))

export const BearNames = () => {
  const names = useMeals((state) => Object.keys(state))

  return <div>{names.join(', ')}</div>
}
```

现在熊爸爸想要一个披萨：

```js
useMeals.setState({
  papaBear: 'a large pizza',
})
```

这个变化导致 `BearNames` 重新渲染，即使 `names` 的实际输出根据浅比较没有改变。

我们可以使用 `useShallow` 来修复这个问题！

```js
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

const useMeals = create(() => ({
  papaBear: 'large porridge-pot',
  mamaBear: 'middle-size porridge pot',
  littleBear: 'A little, small, wee pot',
}))

export const BearNames = () => {
  const names = useMeals(useShallow((state) => Object.keys(state)))

  return <div>{names.join(', ')}</div>
}
```

现在他们都可以点其他餐点，而不会导致我们的 `BearNames` 组件不必要的重新渲染。
