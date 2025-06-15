---
title: Map 和 Set 的使用
createTime: 2025/06/15 17:52:18
permalink: /zustand/ff53b14y/
---

你需要将 Maps 和 Sets 包装在对象内。当你希望其更新得到反映时（例如在 React 中），你通过调用 `setState` 来实现：

**你可以在这里查看 codesandbox：https://codesandbox.io/s/late-https-bxz9qy**

```js
import { create } from 'zustand'

const useFooBar = create(() => ({ foo: new Map(), bar: new Set() }))

function doSomething() {
  // 做一些事情...

  // 如果你想要更新一些使用 `useFooBar` 的 React 组件，你必须调用 setState
  // 来让 React 知道发生了更新。
  // 遵循 React 的最佳实践，你应该在更新时创建新的 Map/Set：
  useFooBar.setState((prev) => ({
    foo: new Map(prev.foo).set('newKey', 'newValue'),
    bar: new Set(prev.bar).add('newKey'),
  }))
}
```
