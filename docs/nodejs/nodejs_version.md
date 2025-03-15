---
title: 自动切换Nodejs版本
createTime: 2025/03/15 19:56:27
permalink: /article/j7z98t3n/
tags:
  - Nodejs
  - nvm
  - fnm
---

本教程将介绍如何使用 nvm（Node Version Manager）和 fnm（Fast Node Manager）实现 Node.js 版本的自动切换。这两个工具都能帮助开发者轻松管理多个 Node.js 版本，并在不同项目间快速切换。

## nvm 自动切换版本
nvm 通过 `.nvmrc` 文件实现自动切换 Node.js 版本。

### 步骤 1: 创建 .nvmrc 文件
在项目根目录创建 `.nvmrc` 文件，并指定所需的 Node.js 版本：

```json
v20.12.2
```

### 步骤 2: 配置自动切换
在 shell 配置文件（如 `.bashrc` 或 `.zshrc`）中添加以下代码：

```json
cd() {
  builtin cd "$@"
  if [[ -f .nvmrc && -r .nvmrc ]]; then
  nvm use
  elif [[ $(nvm version) != $(nvm version default)  ]]; then
  echo "Reverting to nvm default version"
  nvm use default
  fi
}
```

### 步骤 3: 重新加载 shell 配置
运行以下命令使配置生效：

```shell
source ~/.bashrc  # 或 source ~/.zshrc
```

现在，每次进入包含 `.nvmrc` 文件的目录时，nvm 将自动切换到指定的 Node.js 版本。

## fnm 自动切换版本
fnm 通过 `.node-version` 文件实现自动切换 Node.js 版本，配置更为简单。

### 步骤 1: 创建 .node-version 文件
在项目根目录创建 `.node-version` 文件，并指定所需的 Node.js 版本：

```json
20.12.2
```

### 步骤 2: 配置自动切换
在 shell 配置文件（如 `.bashrc` 或 `.zshrc`）中添加以下行：

```shell
eval "$(fnm env --use-on-cd)"
```

### 步骤 3: 重新加载 shell 配置
运行以下命令使配置生效：

```shell
source ~/.bashrc  # 或 source ~/.zshrc
```

现在，fnm 将在进入包含 `.node-version` 文件的目录时自动切换 Node.js 版本。

## 版本文件格式
+ `.nvmrc` 文件：推荐在版本号前加 "v"，例如 `v20.12.2`
+ `.node-version` 文件：通常不加 "v"，直接使用版本号，例如 `20.12.2`

## 最佳实践
1. 每个版本文件只指定一个版本号。
2. 将版本号放在文件的第一行。
3. 避免在版本文件中添加注释或其他内容。
4. 如果项目需要支持多个版本，考虑使用 `package.json` 的 `engines` 字段或 CI/CD 配置文件。
5. 为了最大兼容性，可以同时提供 `.nvmrc` 和 `.node-version` 文件。

通过遵循这些步骤和最佳实践，可以轻松实现 Node.js 版本的自动切换，提高开发效率并确保项目在正确的 Node.js 环境中运行。
