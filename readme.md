### 安装 TypeScript 和相关工具

```bash
npm install typescript --save-dev
npm install @types/node --save-dev
```

### 编译 TypeScript 文件

您可以使用 `TypeScript` 编译器（`tsc`）来编译您的 `TypeScript` 代码。使用以下命令：

```bash
 npx tsc
```

这将根据 `tsconfig.json` 的配置将 `src` 目录中的 `TypeScript` 文件编译到 `dist` 目录中。

### 使用 ts-node

为了避免每次手动编译 TypeScript，您可以使用`ts-node`来直接运行 TypeScript 文件。

首先安装 `ts-node`：

```bash
npm install ts-node --save-dev
```

然后直接使用 `ts-node` 来运行 TypeScript 文件：

```bash
npx ts-node src/index.ts
```

这将直接执行 TypeScript 文件，而无需先编译成 JavaScript。

### 配置 nodemon 自动重启

如果您希望在修改代码后自动重新启动 Node.js 应用程序，可以使用 `nodemon` 配合`ts-node`。

首先安装 `nodemon` 和 `ts-node`：

```bash
npm install nodemon --save-dev
```

然后在 `package.json` 中添加一个 `start` 脚本，使用 `nodemon` 来运行 `TypeScript` 文件：

```json
"scripts": {
    "start": "nodemon --exec ts-node src/index.ts"
}
```

现在，您可以通过运行以下命令来启动项目：

```bash
npm start
```

nodemon 会监听文件更改并自动重启应用程序。

### ES6 模块和 CommonJS 的差异

Node.js 默认使用 CommonJS 模块系统，而 TypeScript 的模块可以是 ES6 或 CommonJS，可以通过配置 tsconfig.json 来控制。使用 `esModuleInterop: true` 可以帮助解决两者之间的兼容性问题。

### Node Version

- Node.js@20+
