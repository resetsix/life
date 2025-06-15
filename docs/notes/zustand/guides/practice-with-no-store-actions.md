---
title: 不使用 store actions 的实践
createTime: 2025/06/15 17:52:18
permalink: /zustand/57plci7e/
---

推荐的用法是将 actions 和状态共同放置在 store 内（让你的 actions 与状态位于一起）。

例如：

```js
export const useBoundStore = create((set) => ({
  count: 0,
  text: 'hello',
  inc: () => set((state) => ({ count: state.count + 1 })),
  setText: (text) => set({ text }),
}))
```

这创建了一个包含数据和 actions 的自包含 store。

---

另一种方法是在模块级别定义 actions，在 store 外部。

```js
export const useBoundStore = create(() => ({
  count: 0,
  text: 'hello',
}))

export const inc = () =>
  useBoundStore.setState((state) => ({ count: state.count + 1 }))

export const setText = (text) => useBoundStore.setState({ text })
```

这有几个优点：

- 不需要 hook 来调用 action；
- 便于代码分割。

虽然这种模式没有任何缺点，但有些人可能因为其封装性质而更喜欢共同放置。
