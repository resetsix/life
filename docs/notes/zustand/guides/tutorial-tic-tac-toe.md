---
title: 教程：井字棋
description: 构建一个游戏
createTime: 2025/06/15 17:52:18
permalink: /zustand/k9n96bmq/
---

# 教程：井字棋

## 构建一个游戏

在本教程中，你将构建一个小型井字棋游戏。本教程假设你已有 React 知识。你在教程中学到的技术是构建任何 React 应用程序的基础，完全理解它将让你对 React 和 Zustand 有深入的理解。

> [!NOTE]
> 本教程专为那些通过实践学习效果最佳并希望快速创建有形成果的人而设计。它从 React 的井字棋教程中汲取灵感。

教程分为几个部分：

- 教程设置将为你提供一个起点来跟随教程。
- 概述将教你 React 的基础知识：组件、props 和状态。
- 完成游戏将教你 React 开发中最常见的技术。
- 添加时间旅行将让你更深入地了解 React 的独特优势。

### 你在构建什么？

在本教程中，你将使用 React 和 Zustand 构建一个交互式井字棋游戏。

你可以在这里看到完成后的样子：

```jsx
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

const useGameStore = create(
  combine(
    {
      history: [Array(9).fill(null)],
      currentMove: 0,
    },
    (set, get) => {
      return {
        setHistory: (nextHistory) => {
          set((state) => ({
            history:
              typeof nextHistory === 'function'
                ? nextHistory(state.history)
                : nextHistory,
          }))
        },
        setCurrentMove: (nextCurrentMove) => {
          set((state) => ({
            currentMove:
              typeof nextCurrentMove === 'function'
                ? nextCurrentMove(state.currentMove)
                : nextCurrentMove,
          }))
        },
      }
    },
  ),
)

function Square({ value, onSquareClick }) {
  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        backgroundColor: '#fff',
        border: '1px solid #999',
        outline: 0,
        borderRadius: 0,
        fontSize: '1rem',
        fontWeight: 'bold',
      }}
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares)
  const turns = calculateTurns(squares)
  const player = xIsNext ? 'X' : 'O'
  const status = calculateStatus(winner, turns, player)

  function handleClick(i) {
    if (squares[i] || winner) return
    const nextSquares = squares.slice()
    nextSquares[i] = player
    onPlay(nextSquares)
  }

  return (
    <>
      <div style={{ marginBottom: '0.5rem' }}>{status}</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          width: 'calc(3 * 2.5rem)',
          height: 'calc(3 * 2.5rem)',
          border: '1px solid #999',
        }}
      >
        {squares.map((_, i) => (
          <Square
            key={`square-${i}`}
            value={squares[i]}
            onSquareClick={() => handleClick(i)}
          />
        ))}
      </div>
    </>
  )
}

export default function Game() {
  const history = useGameStore((state) => state.history)
  const setHistory = useGameStore((state) => state.setHistory)
  const currentMove = useGameStore((state) => state.currentMove)
  const setCurrentMove = useGameStore((state) => state.setCurrentMove)
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        fontFamily: 'monospace',
      }}
    >
      <div>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <ol>
          {history.map((_, historyIndex) => {
            const description =
              historyIndex > 0
                ? `跳转到第 ${historyIndex} 步`
                : '跳转到游戏开始'

            return (
              <li key={historyIndex}>
                <button onClick={() => jumpTo(historyIndex)}>
                  {description}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }

  return null
}

function calculateTurns(squares) {
  return squares.filter((square) => !square).length
}

function calculateStatus(winner, turns, player) {
  if (!winner && !turns) return '平局'
  if (winner) return `获胜者 ${winner}`
  return `下一位玩家: ${player}`
}
```

### 构建棋盘

让我们从创建 `Square` 组件开始，它将是我们 `Board` 组件的构建块。这个组件将代表游戏中的每个方格。

`Square` 组件应该接受 `value` 和 `onSquareClick` 作为 props。它应该返回一个 `<button>` 元素，样式看起来像一个方格。按钮显示 value prop，可以是 `'X'`、`'O'` 或 `null`，取决于游戏的状态。当按钮被点击时，它触发作为 prop 传入的 `onSquareClick` 函数，允许游戏响应用户输入。

这是 `Square` 组件的代码：

```jsx
function Square({ value, onSquareClick }) {
  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        backgroundColor: '#fff',
        border: '1px solid #999',
        outline: 0,
        borderRadius: 0,
        fontSize: '1rem',
        fontWeight: 'bold',
      }}
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}
```

让我们继续创建 Board 组件，它将由排列在网格中的 9 个方格组成。这个组件将作为我们游戏的主要游戏区域。

`Board` 组件应该返回一个样式为网格的 `<div>` 元素。网格布局使用 CSS Grid 实现，有三列三行，每个都占用可用空间的相等部分。网格的整体大小由宽度和高度属性确定，确保它是正方形并且大小合适。

在网格内，我们放置九个 Square 组件，每个都有一个代表其位置的 value prop。这些 Square 组件最终将保存游戏符号（`'X'` 或 `'O'`）并处理用户交互。

这是 `Board` 组件的代码：

```jsx
export default function Board() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        width: 'calc(3 * 2.5rem)',
        height: 'calc(3 * 2.5rem)',
        border: '1px solid #999',
      }}
    >
      <Square value="1" />
      <Square value="2" />
      <Square value="3" />
      <Square value="4" />
      <Square value="5" />
      <Square value="6" />
      <Square value="7" />
      <Square value="8" />
      <Square value="9" />
    </div>
  )
}
```

这个 Board 组件通过将九个方格排列在 3x3 网格中来设置我们游戏棋盘的基本结构。它整齐地定位方格，为将来添加更多功能和处理玩家交互提供基础。

### 状态提升

每个 `Square` 组件都可以维护游戏状态的一部分。要在井字棋游戏中检查获胜者，`Board` 组件需要以某种方式知道 9 个 `Square` 组件中每个的状态。

你会如何处理这个问题？起初，你可能猜测 `Board` 组件需要询问每个 `Square` 组件该 `Square` 的组件状态。虽然这种方法在 React 中技术上是可能的，但我们不鼓励这样做，因为代码变得难以理解、容易出错且难以重构。相反，最好的方法是将游戏状态存储在父 `Board` 组件中，而不是在每个 `Square` 组件中。`Board` 组件可以通过传递 prop 告诉每个 `Square` 组件要显示什么，就像你向每个 `Square` 组件传递数字时所做的那样。

> [!IMPORTANT]
> 要从多个子组件收集数据，或让两个或更多子组件相互通信，请在它们的父组件中声明共享状态。父组件可以通过 props 将该状态传递回子组件。这使子组件彼此同步并与其父组件同步。

让我们借此机会尝试一下。编辑 `Board` 组件，使其声明一个名为 squares 的状态变量，默认为对应 9 个方格的 9 个 null 的数组：

```jsx
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

const useGameStore = create(
  combine({ squares: Array(9).fill(null) }, (set) => {
    return {
      setSquares: (nextSquares) => {
        set((state) => ({
          squares:
            typeof nextSquares === 'function'
              ? nextSquares(state.squares)
              : nextSquares,
        }))
      },
    }
  }),
)

export default function Board() {
  const squares = useGameStore((state) => state.squares)
  const setSquares = useGameStore((state) => state.setSquares)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        width: 'calc(3 * 2.5rem)',
        height: 'calc(3 * 2.5rem)',
        border: '1px solid #999',
      }}
    >
      {squares.map((square, squareIndex) => (
        <Square key={squareIndex} value={square} />
      ))}
    </div>
  )
}
```

`Array(9).fill(null)` 创建一个有九个元素的数组，并将每个元素设置为 `null`。`useGameStore` 声明一个最初设置为该数组的 `squares` 状态。数组中的每个条目对应一个方格的值。当你稍后填充棋盘时，squares 数组将如下所示：

```js
const squares = ['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
```

每个 Square 现在将接收一个 `value` prop，对于空方格，它将是 `'X'`、`'O'` 或 `null`。

接下来，你需要更改当点击 Square 时发生的情况。Board 组件现在维护哪些方格被填充。你需要为 Square 创建一种更新 Board 状态的方法。由于状态对定义它的组件是私有的，你不能直接从 Square 更新 Board 的状态。

相反，你将从 Board 组件向下传递一个函数到 Square 组件，当点击方格时 Square 将调用该函数。你将从 Square 组件可以调用的函数开始。你将调用该函数 `onSquareClick`：

```jsx
function Square({ value, onSquareClick }) {
  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        backgroundColor: '#fff',
        border: '1px solid #999',
        outline: 0,
        borderRadius: 0,
        fontSize: '1rem',
        fontWeight: 'bold',
      }}
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}
```

接下来，你将向 Board 组件添加 `onSquareClick` 函数。现在，你将向 Board 组件添加 `handleClick` 函数来更新保存 Board 状态的 `squares` 数组：

```jsx
export default function Board() {
  const squares = useGameStore((state) => state.squares)
  const setSquares = useGameStore((state) => state.setSquares)

  function handleClick(i) {
    const nextSquares = squares.slice()
    nextSquares[i] = 'X'
    setSquares(nextSquares)
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        width: 'calc(3 * 2.5rem)',
        height: 'calc(3 * 2.5rem)',
        border: '1px solid #999',
      }}
    >
      {squares.map((square, squareIndex) => (
        <Square
          key={squareIndex}
          value={square}
          onSquareClick={() => handleClick(squareIndex)}
        />
      ))}
    </div>
  )
}
```

`handleClick` 函数可以更新 `squares` 数组。`squares.slice()` 调用创建 `squares` 数组的副本。接下来，`handleClick` 更新 `nextSquares` 数组，在索引 `i` 处添加 `X`。

调用 `setSquares` 函数让 React 知道组件的状态已经改变。这将触发使用该状态的组件（`Board`）及其子组件（构成棋盘的 `Square` 组件）的重新渲染。

> [!NOTE]
> JavaScript 支持闭包，这意味着内部函数（例如 `handleClick`）可以访问外部函数（例如 `Board`）中定义的变量和函数。`handleClick` 函数可以读取 `squares` 状态并调用 `setSquares` 方法，因为它们都在 `Board` 函数内部定义。

现在你可以向方格添加 X！但只能添加到左上角的方格。你的 `handleClick` 函数被硬编码为更新左上角方格（索引 `0`）的索引。让我们更新 `handleClick` 以便能够更新任何方格。向 `handleClick` 函数添加一个参数 `i`，该参数接受要更新的方格的索引：

```jsx {3,5}
export default function Board() {
  const squares = useGameStore((state) => state.squares)
  const setSquares = useGameStore((state) => state.setSquares)

  function handleClick(i) {
    const nextSquares = squares.slice()
    nextSquares[i] = 'X'
    setSquares(nextSquares)
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        width: 'calc(3 * 2.5rem)',
        height: 'calc(3 * 2.5rem)',
        border: '1px solid #999',
      }}
    >
      {squares.map((square, squareIndex) => (
        <Square
          key={squareIndex}
          value={square}
          onSquareClick={() => handleClick(squareIndex)}
        />
      ))}
    </div>
  )
}
```

现在你将能够向所有方格添加 X！但在这种情况下，所有状态管理都由 Board 组件处理。

### 轮流

现在是时候修复这个井字棋游戏的一个主要缺陷了：无法在棋盘上标记 "O"。

你将第一步设置为默认的 "X"。让我们通过向 Board 组件添加另一个状态来跟踪这一点：

```jsx
const useGameStore = create(
  combine({ squares: Array(9).fill(null), xIsNext: true }, (set) => {
    return {
      setSquares: (nextSquares) => {
        set((state) => ({
          squares:
            typeof nextSquares === 'function'
              ? nextSquares(state.squares)
              : nextSquares,
        }))
      },
      setXIsNext: (nextXIsNext) => {
        set((state) => ({
          xIsNext:
            typeof nextXIsNext === 'function'
              ? nextXIsNext(state.xIsNext)
              : nextXIsNext,
        }))
      },
    }
  }),
)
```

每次玩家移动时，`xIsNext`（一个布尔值）将被翻转以确定下一个玩家，游戏状态将被保存。你将更新 Board 的 `handleClick` 函数以翻转 `xIsNext` 的值：

```jsx {7,8,9}
export default function Board() {
  const xIsNext = useGameStore((state) => state.xIsNext)
  const setXIsNext = useGameStore((state) => state.setXIsNext)
  const squares = useGameStore((state) => state.squares)
  const setSquares = useGameStore((state) => state.setSquares)

  function handleClick(i) {
    const nextSquares = squares.slice()
    if (xIsNext) {
      nextSquares[i] = 'X'
    } else {
      nextSquares[i] = 'O'
    }
    setSquares(nextSquares)
    setXIsNext(!xIsNext)
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        width: 'calc(3 * 2.5rem)',
        height: 'calc(3 * 2.5rem)',
        border: '1px solid #999',
      }}
    >
      {squares.map((square, squareIndex) => (
        <Square
          key={squareIndex}
          value={square}
          onSquareClick={() => handleClick(squareIndex)}
        />
      ))}
    </div>
  )
}
```

现在你将能够向所有方格添加 X！但在这种情况下，所有状态管理都由 Board 组件处理。

### 声明获胜者或平局

现在玩家可以轮流进行，你会想要显示游戏何时获胜或平局，没有更多回合可以进行。为此，你将添加三个辅助函数。第一个辅助函数叫做 `calculateWinner`，它接受一个包含 9 个方格的数组，检查获胜者并适当地返回 `'X'`、`'O'` 或 `null`。第二个辅助函数叫做 `calculateTurns`，它接受相同的数组，通过过滤出只有 `null` 项来检查剩余回合，并返回它们的计数。最后一个辅助函数叫做 `calculateStatus`，它接受剩余回合、获胜者和当前玩家（`'X'` 或 `'O'`）：

```js
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }

  return null
}

function calculateTurns(squares) {
  return squares.filter((square) => !square).length
}

function calculateStatus(winner, turns, player) {
  if (!winner && !turns) return '平局'
  if (winner) return `获胜者 ${winner}`
  return `下一位玩家: ${player}`
}
```

你将在 Board 组件的 `handleClick` 函数中使用 `calculateWinner(squares)` 的结果来检查玩家是否获胜。你可以在检查用户是否点击了已经有 `'X'` 或 `'O'` 的方格的同时执行此检查。我们希望在两种情况下都提前返回：

```js {2}
function handleClick(i) {
  if (squares[i] || winner) return
  const nextSquares = squares.slice()
  nextSquares[i] = player
  setSquares(nextSquares)
  setXIsNext(!xIsNext)
}
```

为了让玩家知道游戏何时结束，你可以显示诸如 `'获胜者: X'` 或 `'获胜者: O'` 的文本。为此，你将向 `Board` 组件添加一个 `status` 部分。如果游戏结束，状态将显示获胜者或平局，如果游戏正在进行，你将显示下一个玩家的回合：

```jsx {6-7,9,21}
export default function Board() {
  const xIsNext = useGameStore((state) => state.xIsNext)
  const setXIsNext = useGameStore((state) => state.setXIsNext)
  const squares = useGameStore((state) => state.squares)
  const setSquares = useGameStore((state) => state.setSquares)
  const winner = calculateWinner(squares)
  const turns = calculateTurns(squares)
  const player = xIsNext ? 'X' : 'O'
  const status = calculateStatus(winner, turns, player)

  function handleClick(i) {
    if (squares[i] || winner) return
    const nextSquares = squares.slice()
    nextSquares[i] = player
    setSquares(nextSquares)
    setXIsNext(!xIsNext)
  }

  return (
    <>
      <div style={{ marginBottom: '0.5rem' }}>{status}</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          width: 'calc(3 * 2.5rem)',
          height: 'calc(3 * 2.5rem)',
          border: '1px solid #999',
        }}
      >
        {squares.map((square, squareIndex) => (
          <Square
            key={squareIndex}
            value={square}
            onSquareClick={() => handleClick(squareIndex)}
          />
        ))}
      </div>
    </>
  )
}
```

恭喜！你现在有一个可以工作的井字棋游戏。你也刚刚学会了 React 和 Zustand 的基础知识。所以你才是真正的赢家。以下是代码应该看起来的样子：

```jsx
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

const useGameStore = create(
  combine({ squares: Array(9).fill(null), xIsNext: true }, (set) => {
    return {
      setSquares: (nextSquares) => {
        set((state) => ({
          squares:
            typeof nextSquares === 'function'
              ? nextSquares(state.squares)
              : nextSquares,
        }))
      },
      setXIsNext: (nextXIsNext) => {
        set((state) => ({
          xIsNext:
            typeof nextXIsNext === 'function'
              ? nextXIsNext(state.xIsNext)
              : nextXIsNext,
        }))
      },
    }
  }),
)

function Square({ value, onSquareClick }) {
  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        backgroundColor: '#fff',
        border: '1px solid #999',
        outline: 0,
        borderRadius: 0,
        fontSize: '1rem',
        fontWeight: 'bold',
      }}
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}

export default function Board() {
  const xIsNext = useGameStore((state) => state.xIsNext)
  const setXIsNext = useGameStore((state) => state.setXIsNext)
  const squares = useGameStore((state) => state.squares)
  const setSquares = useGameStore((state) => state.setSquares)
  const winner = calculateWinner(squares)
  const turns = calculateTurns(squares)
  const player = xIsNext ? 'X' : 'O'
  const status = calculateStatus(winner, turns, player)

  function handleClick(i) {
    if (squares[i] || winner) return
    const nextSquares = squares.slice()
    nextSquares[i] = player
    setSquares(nextSquares)
    setXIsNext(!xIsNext)
  }

  return (
    <>
      <div style={{ marginBottom: '0.5rem' }}>{status}</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          width: 'calc(3 * 2.5rem)',
          height: 'calc(3 * 2.5rem)',
          border: '1px solid #999',
        }}
      >
        {squares.map((square, squareIndex) => (
          <Square
            key={squareIndex}
            value={square}
            onSquareClick={() => handleClick(squareIndex)}
          />
        ))}
      </div>
    </>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }

  return null
}

function calculateTurns(squares) {
  return squares.filter((square) => !square).length
}

function calculateStatus(winner, turns, player) {
  if (!winner && !turns) return '平局'
  if (winner) return `获胜者 ${winner}`
  return `下一位玩家: ${player}`
}
```

### 添加时间旅行

作为最后的练习，让我们使"回到过去"并重新访问游戏中的先前移动成为可能。

如果你直接修改了 squares 数组，实现这个时间旅行功能将非常困难。但是，由于你在每次移动后使用 `slice()` 创建 squares 数组的新副本，将其视为不可变的，你可以存储 squares 数组的每个过去版本并在它们之间导航。

你将在一个名为 `history` 的新状态变量中跟踪这些过去的 squares 数组。这个 `history` 数组将存储所有棋盘状态，从第一步到最新的一步，看起来像这样：

```js
const history = [
  // 第一步
  [null, null, null, null, null, null, null, null, null],
  // 第二步
  ['X', null, null, null, null, null, null, null, null],
  // 第三步
  ['X', 'O', null, null, null, null, null, null, null],
  // 等等...
]
```

这种方法允许你轻松地在不同的游戏状态之间导航并实现时间旅行功能。

### 再次状态提升

接下来，你将创建一个名为 `Game` 的新顶级组件来显示过去移动的列表。这是你将存储包含整个游戏历史的 `history` 状态的地方。

通过将 `history` 状态放在 `Game` 组件中，你可以从 `Board` 组件中删除 `squares` 状态。你现在将状态从 `Board` 组件提升到顶级 `Game` 组件。这种变化允许 `Game` 组件完全控制 `Board` 的组件数据，并指示 `Board` 组件从 `history` 渲染先前的回合。

首先，添加一个带有 `export default` 的 `Game` 组件，并从 `Board` 组件中删除它。代码应该如下所示：

```jsx {1,44-61}
function Board() {
  const xIsNext = useGameStore((state) => state.xIsNext)
  const setXIsNext = useGameStore((state) => state.setXIsNext)
  const squares = useGameStore((state) => state.squares)
  const setSquares = useGameStore((state) => state.setSquares)
  const winner = calculateWinner(squares)
  const turns = calculateTurns(squares)
  const player = xIsNext ? 'X' : 'O'
  const status = calculateStatus(winner, turns, player)

  function handleClick(i) {
    if (squares[i] || winner) return
    const nextSquares = squares.slice()
    nextSquares[i] = player
    setSquares(nextSquares)
    setXIsNext(!xIsNext)
  }

  return (
    <>
      <div style={{ marginBottom: '0.5rem' }}>{status}</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          width: 'calc(3 * 2.5rem)',
          height: 'calc(3 * 2.5rem)',
          border: '1px solid #999',
        }}
      >
        {squares.map((square, squareIndex) => (
          <Square
            key={squareIndex}
            value={square}
            onSquareClick={() => handleClick(squareIndex)}
          />
        ))}
      </div>
    </>
  )
}

export default function Game() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        fontFamily: 'monospace',
      }}
    >
      <div>
        <Board />
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <ol>{/* TODO */}</ol>
      </div>
    </div>
  )
}
```

向 `useGameStore` hook 添加一些状态来跟踪移动历史：

```js {2,4-11}
const useGameStore = create(
  combine({ history: [Array(9).fill(null)], xIsNext: true }, (set) => {
    return {
      setHistory: (nextHistory) => {
        set((state) => ({
          history:
            typeof nextHistory === 'function'
              ? nextHistory(state.history)
              : nextHistory,
        }))
      },
      setXIsNext: (nextXIsNext) => {
        set((state) => ({
          xIsNext:
            typeof nextXIsNext === 'function'
              ? nextXIsNext(state.xIsNext)
              : nextXIsNext,
        }))
      },
    }
  }),
)
```

注意 `[Array(9).fill(null)]` 如何创建一个包含单个项目的数组，该项目本身是一个包含 9 个 null 值的数组。

要为当前移动渲染方格，你需要从 `history` 状态中读取最新的 squares 数组。你不需要为此额外的状态，因为你已经有足够的信息在渲染期间计算它：

```jsx {2-6}
export default function Game() {
  const history = useGameStore((state) => state.history)
  const setHistory = useGameStore((state) => state.setHistory)
  const xIsNext = useGameStore((state) => state.xIsNext)
  const setXIsNext = useGameStore((state) => state.setXIsNext)
  const currentSquares = history[history.length - 1]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        fontFamily: 'monospace',
      }}
    >
      <div>
        <Board />
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  )
}
```

接下来，在 `Game` 组件内创建一个 `handlePlay` 函数，该函数将被 `Board` 组件调用以更新游戏。将 `xIsNext`、`currentSquares` 和 `handlePlay` 作为 props 传递给 `Board` 组件：

```jsx {8-10,21}
export default function Game() {
  const history = useGameStore((state) => state.history)
  const setHistory = useGameStore((state) => state.setHistory)
  const currentMove = useGameStore((state) => state.currentMove)
  const setCurrentMove = useGameStore((state) => state.setCurrentMove)
  const currentSquares = history[history.length - 1]

  function handlePlay(nextSquares) {
    // TODO
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        fontFamily: 'monospace',
      }}
    >
      <div>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  )
}
```

让我们使 `Board` 组件完全由它接收的 props 控制。为此，我们将修改 `Board` 组件以接受三个 props：`xIsNext`、`squares` 和一个新的 `onPlay` 函数，当玩家移动时 `Board` 组件可以调用更新的 squares 数组。

```jsx {1}
function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares)
  const turns = calculateTurns(squares)
  const player = xIsNext ? 'X' : 'O'
  const status = calculateStatus(winner, turns, player)

  function handleClick(i) {
    if (squares[i] || winner) return
    const nextSquares = squares.slice()
    nextSquares[i] = player
    onPlay(nextSquares)
  }

  return (
    <>
      <div style={{ marginBottom: '0.5rem' }}>{status}</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          width: 'calc(3 * 2.5rem)',
          height: 'calc(3 * 2.5rem)',
          border: '1px solid #999',
        }}
      >
        {squares.map((square, squareIndex) => (
          <Square
            key={squareIndex}
            value={square}
            onSquareClick={() => handleClick(squareIndex)}
          />
        ))}
      </div>
    </>
  )
}
```

`Board` 组件现在完全由传递给它的 props 控制。要让游戏再次工作，你需要在 `Game` 组件中实现 `handlePlay` 函数。

`handlePlay` 在被调用时应该做什么？记住，Board 之前用更新的数组调用 `setSquares`；现在它将更新的 squares 数组传递给 `onPlay`。

`handlePlay` 函数需要更新 `Game` 组件的状态以触发重新渲染。你将通过将更新的 squares 数组作为新的 `history` 条目附加来更新 `history` 状态变量，而不是使用 `setSquares`。你还需要切换 `xIsNext`，就像 `Board` 组件以前做的那样。

```js {2-3}
function handlePlay(nextSquares) {
  setHistory(history.concat([nextSquares]))
  setXIsNext(!xIsNext)
}
```

此时，你已经将状态移动到 `Game` 组件中，UI 应该完全正常工作，就像重构之前一样。以下是此时代码应该看起来的样子：

```jsx
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

const useGameStore = create(
  combine({ history: [Array(9).fill(null)], xIsNext: true }, (set) => {
    return {
      setHistory: (nextHistory) => {
        set((state) => ({
          history:
            typeof nextHistory === 'function'
              ? nextHistory(state.history)
              : nextHistory,
        }))
      },
      setXIsNext: (nextXIsNext) => {
        set((state) => ({
          xIsNext:
            typeof nextXIsNext === 'function'
              ? nextXIsNext(state.xIsNext)
              : nextXIsNext,
        }))
      },
    }
  }),
)

function Square({ value, onSquareClick }) {
  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        backgroundColor: '#fff',
        border: '1px solid #999',
        outline: 0,
        borderRadius: 0,
        fontSize: '1rem',
        fontWeight: 'bold',
      }}
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares)
  const turns = calculateTurns(squares)
  const player = xIsNext ? 'X' : 'O'
  const status = calculateStatus(winner, turns, player)

  function handleClick(i) {
    if (squares[i] || winner) return
    const nextSquares = squares.slice()
    nextSquares[i] = player
    onPlay(nextSquares)
  }

  return (
    <>
      <div style={{ marginBottom: '0.5rem' }}>{status}</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          width: 'calc(3 * 2.5rem)',
          height: 'calc(3 * 2.5rem)',
          border: '1px solid #999',
        }}
      >
        {squares.map((square, squareIndex) => (
          <Square
            key={squareIndex}
            value={square}
            onSquareClick={() => handleClick(squareIndex)}
          />
        ))}
      </div>
    </>
  )
}

export default function Game() {
  const history = useGameStore((state) => state.history)
  const setHistory = useGameStore((state) => state.setHistory)
  const xIsNext = useGameStore((state) => state.xIsNext)
  const setXIsNext = useGameStore((state) => state.setXIsNext)
  const currentSquares = history[history.length - 1]

  function handlePlay(nextSquares) {
    setHistory(history.concat([nextSquares]))
    setXIsNext(!xIsNext)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        fontFamily: 'monospace',
      }}
    >
      <div>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }

  return null
}

function calculateTurns(squares) {
  return squares.filter((square) => !square).length
}

function calculateStatus(winner, turns, player) {
  if (!winner && !turns) return '平局'
  if (winner) return `获胜者 ${winner}`
  return `下一位玩家: ${player}`
}
```

### 显示过去的移动

由于你正在记录井字棋游戏的历史，你现在可以向玩家显示过去移动的列表。

你已经在 store 中有一个 `history` 移动数组，所以现在你需要将其转换为 React 元素数组。在 JavaScript 中，要将一个数组转换为另一个数组，你可以使用数组的 `.map()` 方法：

你将使用 `map` 将你的移动 `history` 转换为屏幕上表示按钮的 React 元素，并显示一个按钮列表以**跳转**到过去的移动。让我们在 `Game` 组件中对 `history` 进行 `map`：

```jsx {29-44}
export default function Game() {
  const history = useGameStore((state) => state.history)
  const setHistory = useGameStore((state) => state.setHistory)
  const xIsNext = useGameStore((state) => state.xIsNext)
  const setXIsNext = useGameStore((state) => state.setXIsNext)
  const currentSquares = history[history.length - 1]

  function handlePlay(nextSquares) {
    setHistory(history.concat([nextSquares]))
    setXIsNext(!xIsNext)
  }

  function jumpTo(nextMove) {
    // TODO
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        fontFamily: 'monospace',
      }}
    >
      <div>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <ol>
          {history.map((_, historyIndex) => {
            const description =
              historyIndex > 0
                ? `跳转到第 ${historyIndex} 步`
                : '跳转到游戏开始'

            return (
              <li key={historyIndex}>
                <button onClick={() => jumpTo(historyIndex)}>
                  {description}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
```

在你可以实现 `jumpTo` 函数之前，你需要 `Game` 组件跟踪用户当前正在查看的步骤。为此，定义一个名为 `currentMove` 的新状态变量，从 `0` 开始：

现在你需要更新 store 来包含 `currentMove` 状态，并修改 `Game` 组件来使用它：

```js
const useGameStore = create(
  combine(
    {
      history: [Array(9).fill(null)],
      currentMove: 0,
    },
    (set) => {
      return {
        setHistory: (nextHistory) => {
          set((state) => ({
            history:
              typeof nextHistory === 'function'
                ? nextHistory(state.history)
                : nextHistory,
          }))
        },
        setCurrentMove: (nextCurrentMove) => {
          set((state) => ({
            currentMove:
              typeof nextCurrentMove === 'function'
                ? nextCurrentMove(state.currentMove)
                : nextCurrentMove,
          }))
        },
      }
    },
  ),
)
```

接下来，你将更新 `Game` 组件中的 `jumpTo` 函数来更新 `currentMove`。你还将设置 `xIsNext` 为 `true`，如果你要更改 `currentMove` 为偶数：

```jsx
export default function Game() {
  const history = useGameStore((state) => state.history)
  const setHistory = useGameStore((state) => state.setHistory)
  const currentMove = useGameStore((state) => state.currentMove)
  const setCurrentMove = useGameStore((state) => state.setCurrentMove)
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  const moves = history.map((_, move) => {
    const description = move > 0 ? `跳转到第 ${move} 步` : '跳转到游戏开始'
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        fontFamily: 'monospace',
      }}
    >
      <div>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}
```

### 最终清理

如果你查看代码，你可能会注意到 `xIsNext === true` 当 `currentMove` 为偶数时，`xIsNext === false` 当 `currentMove` 为奇数时。换句话说，如果你知道 `currentMove` 的值，那么你总是可以计算出 `xIsNext` 应该是什么。

没有理由将这两者都存储在状态中。实际上，总是尽量避免冗余状态。简化你在状态中存储的内容可以减少错误并使你的代码更容易理解。更改 `Game`，使其不存储 `xIsNext` 作为单独的状态变量，而是根据 `currentMove` 计算它：

```jsx {4}
export default function Game() {
  const history = useGameStore((state) => state.history)
  const setHistory = useGameStore((state) => state.setHistory)
  const currentMove = useGameStore((state) => state.currentMove)
  const setCurrentMove = useGameStore((state) => state.setCurrentMove)
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  const moves = history.map((_, move) => {
    const description = move > 0 ? `跳转到第 ${move} 步` : '跳转到游戏开始'
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        fontFamily: 'monospace',
      }}
    >
      <div>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}
```

你不再需要 `xIsNext` 状态声明或对 `setXIsNext` 的调用。现在，即使你在编写组件时犯了错误，也没有 `xIsNext` 与 `currentMove` 不同步的机会。

### 总结

恭喜！你已经创建了一个井字棋游戏，它：

- 让你玩井字棋
- 指示玩家何时获胜或平局
- 在游戏进行时存储游戏历史
- 允许玩家查看游戏历史并查看棋盘的先前版本

干得好！我们希望你现在感觉对 React 和 Zustand 的工作原理有了很好的理解。

这是最终代码：

```jsx
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

const useGameStore = create(
  combine(
    {
      history: [Array(9).fill(null)],
      currentMove: 0,
    },
    (set) => {
      return {
        setHistory: (nextHistory) => {
          set((state) => ({
            history:
              typeof nextHistory === 'function'
                ? nextHistory(state.history)
                : nextHistory,
          }))
        },
        setCurrentMove: (nextCurrentMove) => {
          set((state) => ({
            currentMove:
              typeof nextCurrentMove === 'function'
                ? nextCurrentMove(state.currentMove)
                : nextCurrentMove,
          }))
        },
      }
    },
  ),
)

function Square({ value, onSquareClick }) {
  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        backgroundColor: '#fff',
        border: '1px solid #999',
        outline: 0,
        borderRadius: 0,
        fontSize: '1rem',
        fontWeight: 'bold',
      }}
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares)
  const turns = calculateTurns(squares)
  const player = xIsNext ? 'X' : 'O'
  const status = calculateStatus(winner, turns, player)

  function handleClick(i) {
    if (squares[i] || winner) return
    const nextSquares = squares.slice()
    nextSquares[i] = player
    onPlay(nextSquares)
  }

  return (
    <>
      <div style={{ marginBottom: '0.5rem' }}>{status}</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          width: 'calc(3 * 2.5rem)',
          height: 'calc(3 * 2.5rem)',
          border: '1px solid #999',
        }}
      >
        {squares.map((_, i) => (
          <Square
            key={`square-${i}`}
            value={squares[i]}
            onSquareClick={() => handleClick(i)}
          />
        ))}
      </div>
    </>
  )
}

export default function Game() {
  const history = useGameStore((state) => state.history)
  const setHistory = useGameStore((state) => state.setHistory)
  const currentMove = useGameStore((state) => state.currentMove)
  const setCurrentMove = useGameStore((state) => state.setCurrentMove)
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  const moves = history.map((_, move) => {
    const description = move > 0 ? `跳转到第 ${move} 步` : '跳转到游戏开始'
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        fontFamily: 'monospace',
      }}
    >
      <div>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }

  return null
}

function calculateTurns(squares) {
  return squares.filter((square) => !square).length
}

function calculateStatus(winner, turns, player) {
  if (!winner && !turns) return '平局'
  if (winner) return `获胜者 ${winner}`
  return `下一位玩家: ${player}`
}
```

现在你已经完成了井字棋教程！在这个过程中，你学会了：

- **React 概念**：组件、props、状态
- **Zustand 概念**：创建 stores、状态管理、combine 中间件
- **JavaScript 概念**：数组、对象、函数、不可变性

我们希望你现在感觉对 React 和 Zustand 的工作原理有了很好的理解。查看最终结果：[最终结果](https://codesandbox.io/s/react-tic-tac-toe-zustand-final)

如果你有额外的时间或想练习你的新技能，这里有一些改进井字棋游戏的想法，按难度递增的顺序列出：

1. 仅对于当前移动，显示"你在移动 #..."而不是按钮。
2. 重写 Board 以使用两个循环来制作方格而不是硬编码它们。
3. 添加一个切换按钮，让你按升序或降序对移动进行排序。
4. 当有人获胜时，突出显示导致获胜的三个方格。
5. 当没有人获胜时，显示关于结果是平局的消息。

在整个教程中，你接触了 React 概念，包括组件、props 和状态。现在你已经看到了这些概念在构建游戏时是如何工作的，请查看[思考 React](https://react.dev/learn/thinking-in-react)，了解在构建应用程序的 UI 时相同的 React 概念是如何工作的。
