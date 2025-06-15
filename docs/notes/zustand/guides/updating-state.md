---
title: 更新状态
createTime: 2025/06/15 17:52:18
permalink: /zustand/ti9ceorx/
---

## 扁平更新

使用 Zustand 更新状态很简单！使用新状态调用提供的 `set` 函数，它将与 store 中的现有状态进行浅合并。**注意** 有关嵌套状态，请参见下一节。

```tsx
import { create } from 'zustand'

type State = {
  firstName: string
  lastName: string
}

type Action = {
  updateFirstName: (firstName: State['firstName']) => void
  updateLastName: (lastName: State['lastName']) => void
}

// 创建你的 store，包括状态和（可选的）actions
const usePersonStore = create<State & Action>((set) => ({
  firstName: '',
  lastName: '',
  updateFirstName: (firstName) => set(() => ({ firstName: firstName })),
  updateLastName: (lastName) => set(() => ({ lastName: lastName })),
}))

// 在消费应用中
function App() {
  // "选择" 所需的状态和 actions，在这种情况下是 firstName 值
  // 和 action updateFirstName
  const firstName = usePersonStore((state) => state.firstName)
  const updateFirstName = usePersonStore((state) => state.updateFirstName)

  return (
    <main>
      <label>
        名字
        <input
          // 更新 "firstName" 状态
          onChange={(e) => updateFirstName(e.currentTarget.value)}
          value={firstName}
        />
      </label>

      <p>
        你好，<strong>{firstName}!</strong>
      </p>
    </main>
  )
}
```

## 深度嵌套对象

如果你有这样的深度状态对象：

```ts
type State = {
  deep: {
    nested: {
      obj: { count: number }
    }
  }
}
```

更新嵌套状态需要一些努力来确保过程以不可变的方式完成。

### 常规方法

类似于 React 或 Redux，常规方法是复制状态对象的每一层。这通过展开运算符 `...` 完成，并手动将其与新状态值合并。如下所示：

```ts
  normalInc: () =>
    set((state) => ({
      deep: {
        ...state.deep,
        nested: {
          ...state.deep.nested,
          obj: {
            ...state.deep.nested.obj,
            count: state.deep.nested.obj.count + 1
          }
        }
      }
    })),
```

这非常冗长！让我们探索一些能让你的生活更轻松的替代方案。

### 使用 Immer

许多人使用 [Immer](https://github.com/immerjs/immer) 来更新嵌套值。Immer 可以在任何需要更新嵌套状态的时候使用，比如在 React、Redux 中，当然还有 Zustand！

你可以使用 Immer 来缩短深度嵌套对象的状态更新。让我们看一个例子：

```ts
  immerInc: () =>
    set(produce((state: State) => { ++state.deep.nested.obj.count })),
```

多么简洁！请注意 [这里列出的注意事项](../integrations/immer-middleware.md)。

### 使用 optics-ts

还有另一个选择是使用 [optics-ts](https://github.com/akheron/optics-ts/)：

```ts
  opticsInc: () =>
    set(O.modify(O.optic<State>().path("deep.nested.obj.count"))((c) => c + 1)),
```

与 Immer 不同，optics-ts 不使用代理或变异语法。

### 使用 Ramda

你也可以使用 [Ramda](https://ramdajs.com/)：

```ts
  ramdaInc: () =>
    set(R.modifyPath(["deep", "nested", "obj", "count"], (c) => c + 1)),
```

ramda 和 optics-ts 都支持类型。

### CodeSandbox 演示

https://codesandbox.io/s/zustand-normal-immer-optics-ramda-updating-ynn3o?file=/src/App.tsx
