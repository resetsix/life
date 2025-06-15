---
title: SSR 和水合
createTime: 2025/06/15 17:52:18
permalink: /zustand/qjs873c4/
---

## 服务端渲染 (SSR)

服务端渲染 (SSR) 是一种技术，帮助我们在服务器上将组件渲染为 HTML 字符串，直接发送到浏览器，最后在客户端将静态标记"水合"为完全交互式的应用程序。

### React

假设我们想要使用 React 渲染一个无状态应用程序。为了做到这一点，我们需要使用 `express`、`react` 和 `react-dom/server`。我们不需要 `react-dom/client`，因为这是一个无状态应用程序。

让我们深入了解：

- `express` 帮助我们构建一个可以使用 Node 运行的 web 应用程序，
- `react` 帮助我们构建在应用程序中使用的 UI 组件，
- `react-dom/server` 帮助我们在服务器上渲染组件。

```json
// tsconfig.json
{
  "compilerOptions": {
    "noImplicitAny": false,
    "noEmitOnError": true,
    "removeComments": false,
    "sourceMap": true,
    "target": "esnext"
  },
  "include": ["**/*"]
}
```

> **注意**：不要忘记从你的 `tsconfig.json` 文件中删除所有注释。

```tsx
// app.tsx
export const App = () => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>静态服务端渲染应用</title>
      </head>
      <body>
        <div>Hello World!</div>
      </body>
    </html>
  )
}
```

```tsx
// server.tsx
import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

import { App } from './app.tsx'

const port = Number.parseInt(process.env.PORT || '3000', 10)
const app = express()

app.get('/', (_, res) => {
  const { pipe } = ReactDOMServer.renderToPipeableStream(<App />, {
    onShellReady() {
      res.setHeader('content-type', 'text/html')
      pipe(res)
    },
  })
})

app.listen(port, () => {
  console.log(`服务器正在端口 ${port} 上监听`)
})
```

```sh
tsc --build
```

```sh
node server.js
```

## 水合

水合将来自服务器的初始 HTML 快照转换为在浏览器中运行的完全交互式应用程序。"水合"组件的正确方法是使用 `hydrateRoot`。

### React

假设我们想要使用 React 渲染一个有状态应用程序。为了做到这一点，我们需要使用 `express`、`react`、`react-dom/server` 和 `react-dom/client`。

让我们深入了解：

- `express` 帮助我们构建一个可以使用 Node 运行的 web 应用程序，
- `react` 帮助我们构建在应用程序中使用的 UI 组件，
- `react-dom/server` 帮助我们在服务器上渲染组件，
- `react-dom/client` 帮助我们在客户端水合组件。

> **注意**：不要忘记，即使我们可以在服务器上渲染组件，在客户端"水合"它们以使其具有交互性也很重要。

```json
// tsconfig.json
{
  "compilerOptions": {
    "noImplicitAny": false,
    "noEmitOnError": true,
    "removeComments": false,
    "sourceMap": true,
    "target": "esnext"
  },
  "include": ["**/*"]
}
```

> **注意**：不要忘记删除你的 `tsconfig.json` 文件中的所有注释。

```tsx
// app.tsx
export const App = () => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>静态服务端渲染应用</title>
      </head>
      <body>
        <div>Hello World!</div>
      </body>
    </html>
  )
}
```

```tsx
// main.tsx
import ReactDOMClient from 'react-dom/client'

import { App } from './app.tsx'

ReactDOMClient.hydrateRoot(document, <App />)
```

```tsx
// server.tsx
import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

import { App } from './app.tsx'

const port = Number.parseInt(process.env.PORT || '3000', 10)
const app = express()

app.use('/', (_, res) => {
  const { pipe } = ReactDOMServer.renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      res.setHeader('content-type', 'text/html')
      pipe(res)
    },
  })
})

app.listen(port, () => {
  console.log(`服务器正在端口 ${port} 上监听`)
})
```

```sh
tsc --build
```

```sh
node server.js
```

> **警告**：你传递给 `hydrateRoot` 的 React 树需要产生与在服务器上相同的输出。
> 导致水合错误的最常见原因包括：
>
> - 根节点内 React 生成的 HTML 周围的额外空白（如换行符）。
> - 在渲染逻辑中使用像 `typeof window !== 'undefined'` 这样的检查。
> - 在渲染逻辑中使用仅限浏览器的 API，如 `window.matchMedia`。
> - 在服务器和客户端上渲染不同的数据。
>
> React 会从一些水合错误中恢复，但你必须像修复其他 bug 一样修复它们。在最好的情况下，它们会导致性能下降；在最坏的情况下，事件处理程序可能会附加到错误的元素上。

你可以在这里阅读更多关于注意事项和陷阱的信息：[hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)
