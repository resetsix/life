---
title: 介绍
description: 如何使用 Zustand
createTime: 2025/06/15 17:52:18
permalink: /zustand/3glnmffq/
---

<div class="flex justify-center mb-4">
  <img src="/notes/zustand/bear.jpg" alt="Logo Zustand" />
</div>

一个小巧、快速且可扩展的轻量级状态管理解决方案。
Zustand 拥有基于 hooks 的舒适 API。
它不繁琐，不固执己见，
但有足够的约定来保持明确和类似 flux 的特性。

不要因为它看起来可爱就小看它，它有爪子！
花费了大量时间来处理常见的陷阱，
比如可怕的 [zombie child 问题]，
[React 并发] 和混合渲染器之间的 [context 丢失]。
它可能是 React 生态系统中唯一能正确处理所有这些问题的状态管理器。

你可以在 [这里](https://codesandbox.io/s/dazzling-moon-itop4) 尝试在线演示。

[zombie child 问题]: https://react-redux.js.org/api/hooks#stale-props-and-zombie-children
[react 并发]: https://github.com/bvaughn/rfcs/blob/useMutableSource/text/0000-use-mutable-source.md
[context 丢失]: https://github.com/facebook/react/issues/13332

## 安装

Zustand 在 NPM 上作为包提供使用：

```bash
# NPM
npm install zustand
# 或者，使用你选择的任何包管理器。
```

## 首先创建一个 store

你的 store 就是一个 hook！
你可以在其中放入任何内容：原始值、对象、函数。
`set` 函数 _合并_ 状态。

```js
import { create } from 'zustand'

const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}))
```

## 然后绑定你的组件，就这样！

你可以在任何地方使用这个 hook，无需 providers。
选择你的状态，消费组件
将在该状态变化时重新渲染。

```jsx
function BearCounter() {
  const bears = useStore((state) => state.bears)
  return <h1>{bears} bears around here...</h1>
}

function Controls() {
  const increasePopulation = useStore((state) => state.increasePopulation)
  return <button onClick={increasePopulation}>one up</button>
}
```
