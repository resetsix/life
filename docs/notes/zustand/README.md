---
title: Zustand 文档
description: Zustand 状态管理库完整文档
createTime: 2025/06/15 18:00:00
permalink: /zustand/
---

# Zustand 文档

<div class="flex justify-center mb-8">
  <img src="/notes/zustand/bear.jpg" alt="Zustand Logo" style="max-width: 200px;" />
</div>

欢迎来到 Zustand 中文文档！

Zustand 是一个小巧、快速且可扩展的轻量级状态管理解决方案。它拥有基于 hooks 的舒适 API，不繁琐，不固执己见，但有足够的约定来保持明确和类似 flux 的特性。

## 快速开始

如果你是第一次使用 Zustand，建议从以下内容开始：

- [介绍](./getting-started/introduction.md) - 了解 Zustand 的基本概念和优势
- [对比](./getting-started/comparison.md) - 与其他状态管理库的对比

## 文档结构

### 📚 入门指南
- **介绍** - Zustand 的基本概念和安装
- **对比** - 与其他状态管理库的对比分析

### 🔧 API 文档
- **create** - 创建 store 的核心 API
- **create-store** - 创建独立 store 实例
- **create-with-equality-fn** - 带自定义比较函数的创建方法
- **shallow** - 浅比较工具函数

### 📖 使用指南
- **TypeScript** - TypeScript 类型定义和最佳实践
- **更新状态** - 状态更新的各种方式
- **不可变状态与合并** - 状态不可变性处理
- **重置状态** - 如何重置 store 状态
- **切片模式** - 大型应用的状态切片管理
- **自动生成选择器** - 提高性能的选择器模式
- **防止重渲染** - 使用 useShallow 优化性能
- **Flux 风格实践** - Flux 架构模式的实现
- **无 store actions 实践** - 替代 actions 的模式
- **使用 props 初始化状态** - 组件 props 初始化 store
- **Maps 和 Sets 使用** - 复杂数据结构的处理
- **测试** - 单元测试和集成测试
- **Next.js** - Next.js 项目中的使用
- **SSR 和水合** - 服务端渲染的处理
- **URL Hash 状态连接** - 与 URL 状态同步
- **React 18 前的事件处理** - 兼容性处理
- **井字棋教程** - 完整的实战教程

### 🎣 Hooks
- **useStore** - 基础 store hook
- **useStoreWithEqualityFn** - 带比较函数的 store hook
- **useShallow** - 浅比较 hook

### 🔌 中间件
- **persist** - 持久化中间件
- **immer** - Immer 集成中间件
- **devtools** - Redux DevTools 集成
- **redux** - Redux 风格中间件
- **combine** - 组合多个 store
- **subscribeWithSelector** - 选择器订阅中间件

### 🔗 集成
- **持久化存储数据** - 数据持久化方案
- **Immer 中间件** - 不可变状态更新
- **第三方库** - 与其他库的集成

### 🚀 迁移指南
- **迁移到 v5** - 从 v4 升级到 v5 的指南
- **迁移到 v4** - 从 v3 升级到 v4 的指南

### 📜 历史版本
- **Zustand v3 createContext** - v3 版本的 createContext API

## 贡献

如果你发现文档中的错误或想要改进内容，欢迎提交 Issue 或 Pull Request。

## 许可证

本文档基于 MIT 许可证开源。
