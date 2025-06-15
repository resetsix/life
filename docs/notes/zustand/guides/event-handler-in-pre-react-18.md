---
title: 在 React 18 之前的版本中在 React 事件处理程序外调用 actions
createTime: 2025/06/15 17:52:18
permalink: /zustand/l621ci20/
---

因为如果在事件处理程序外调用 `setState`，React 会同步处理它，所以在事件处理程序外更新状态会强制 React 同步更新组件。因此，存在遇到僵尸子组件效应的风险。

为了解决这个问题，action 需要像这样包装在 `unstable_batchedUpdates` 中：

```jsx
import { unstable_batchedUpdates } from 'react-dom' // 或 'react-native'

const useFishStore = create((set) => ({
  fishes: 0,
  increaseFishes: () => set((prev) => ({ fishes: prev.fishes + 1 })),
}))

const nonReactCallback = () => {
  unstable_batchedUpdates(() => {
    useFishStore.getState().increaseFishes()
  })
}
```

更多详情：https://github.com/pmndrs/zustand/issues/302
