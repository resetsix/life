---
title: shallow
description: 如何有效比较简单数据
createTime: 2025/06/15 17:52:18
permalink: /zustand/9xq1zzre/
---

`shallow` 让你对简单数据结构进行快速检查。当你处理不包含嵌套对象或数组的数据结构时，它能有效识别**顶层**属性的变化。

> [!NOTE]
> Shallow 让你执行快速比较，但要记住它的限制。

```js
const equal = shallow(a, b)
```

- [类型](#类型)
  - [签名](#shallow-签名)
- [参考](#参考)
- [用法](#用法)
  - [比较原始值](#比较原始值)
  - [比较对象](#比较对象)
  - [比较 Sets](#比较-sets)
  - [比较 Maps](#比较-maps)
- [故障排除](#故障排除)
  - [比较对象返回 `false` 即使它们是相同的](#比较对象返回-false-即使它们是相同的)
  - [比较具有不同原型的对象](#比较具有不同原型的对象)

## 类型

### 签名

```ts
shallow<T>(a: T, b: T): boolean
```

## 参考

### `shallow(a, b)`

#### 参数

- `a`: 第一个值。
- `b`: 第二个值。

#### 返回值

当 `a` 和 `b` 基于其**顶层**属性的浅比较相等时，`shallow` 返回 `true`。否则，它应该返回 `false`。

## 用法

### 比较原始值

当比较原始值如 `string`、`number`、`boolean` 和 `BigInt` 时，`Object.is` 和 `shallow` 函数在值相同时都返回 `true`。这是因为原始值是按其实际值而不是按引用进行比较的。

```ts
const stringLeft = 'John Doe'
const stringRight = 'John Doe'

Object.is(stringLeft, stringRight) // -> true
shallow(stringLeft, stringRight) // -> true

const numberLeft = 10
const numberRight = 10

Object.is(numberLeft, numberRight) // -> true
shallow(numberLeft, numberRight) // -> true

const booleanLeft = true
const booleanRight = true

Object.is(booleanLeft, booleanRight) // -> true
shallow(booleanLeft, booleanRight) // -> true

const bigIntLeft = 1n
const bigIntRight = 1n

Object.is(bigIntLeft, bigIntRight) // -> true
shallow(bigIntLeft, bigIntRight) // -> true
```

### 比较对象

当比较对象时，理解 `Object.is` 和 `shallow` 函数如何操作很重要，因为它们处理比较的方式不同。

`shallow` 函数返回 `true`，因为 shallow 执行对象的浅比较。它检查顶层属性及其值是否相同。在这种情况下，顶层属性（`firstName`、`lastName` 和 `age`）及其值在 `objectLeft` 和 `objectRight` 之间是相同的，所以 shallow 认为它们相等。

```ts
const objectLeft = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
}
const objectRight = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
}

Object.is(objectLeft, objectRight) // -> false
shallow(objectLeft, objectRight) // -> true
```

### 比较 Sets

当比较 sets 时，理解 `Object.is` 和 `shallow` 函数如何操作很重要，因为它们处理比较的方式不同。

`shallow` 函数返回 `true`，因为 shallow 执行 sets 的浅比较。它检查顶层属性（在这种情况下是 sets 本身）是否相同。由于 `setLeft` 和 `setRight` 都是 Set 对象的实例并包含相同的元素，shallow 认为它们相等。

```ts
const setLeft = new Set([1, 2, 3])
const setRight = new Set([1, 2, 3])

Object.is(setLeft, setRight) // -> false
shallow(setLeft, setRight) // -> true
```

### 比较 Maps

当比较 maps 时，理解 `Object.is` 和 `shallow` 函数如何操作很重要，因为它们处理比较的方式不同。

`shallow` 返回 `true`，因为 shallow 执行 maps 的浅比较。它检查顶层属性（在这种情况下是 maps 本身）是否相同。由于 `mapLeft` 和 `mapRight` 都是 Map 对象的实例并包含相同的键值对，shallow 认为它们相等。

```ts
const mapLeft = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
])
const mapRight = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
])

Object.is(mapLeft, mapRight) // -> false
shallow(mapLeft, mapRight) // -> true
```

## 故障排除

### 比较对象返回 `false` 即使它们是相同的

`shallow` 函数执行浅比较。浅比较检查两个对象的顶层属性是否相等。它不检查嵌套对象或深度嵌套的属性。换句话说，它只比较属性的引用。

在以下示例中，shallow 函数返回 `false`，因为它只比较顶层属性及其引用。两个对象中的 address 属性都是嵌套对象，即使它们的内容相同，但它们的引用不同。因此，shallow 将它们视为不同，结果为 `false`。

```ts
const objectLeft = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
  address: {
    street: 'Kulas Light',
    suite: 'Apt. 556',
    city: 'Gwenborough',
    zipcode: '92998-3874',
    geo: {
      lat: '-37.3159',
      lng: '81.1496',
    },
  },
}
const objectRight = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
  address: {
    street: 'Kulas Light',
    suite: 'Apt. 556',
    city: 'Gwenborough',
    zipcode: '92998-3874',
    geo: {
      lat: '-37.3159',
      lng: '81.1496',
    },
  },
}

Object.is(objectLeft, objectRight) // -> false
shallow(objectLeft, objectRight) // -> false
```

如果我们删除 `address` 属性，浅比较将按预期工作，因为所有顶层属性都将是原始值或对相同值的引用：

```ts
const objectLeft = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
}
const objectRight = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
}

Object.is(objectLeft, objectRight) // -> false
shallow(objectLeft, objectRight) // -> true
```

在这个修改后的示例中，`objectLeft` 和 `objectRight` 具有相同的顶层属性和原始值。由于 `shallow` 函数只比较顶层属性，它将返回 `true`，因为原始值（`firstName`、`lastName` 和 `age`）在两个对象中都是相同的。

### 比较具有不同原型的对象

`shallow` 函数检查两个对象是否具有相同的原型。如果它们的原型在引用上不同，shallow 将返回 `false`。这种比较使用以下方式完成：

```ts
Object.getPrototypeOf(a) === Object.getPrototypeOf(b)
```

> [!IMPORTANT]
> 使用对象初始化器（`{}`）或 `new Object()` 创建的对象默认继承自 `Object.prototype`。但是，使用 `Object.create(proto)` 创建的对象继承自你传入的 proto——这可能不是 `Object.prototype`。

```ts
const a = Object.create({}) // -> 原型是 `{}`
const b = {} // -> 原型是 `Object.prototype`

shallow(a, b) // -> false
```
