## 关于本项目的说明

使用 [Node.js](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs) 和 [Express](https://expressjs.com/en/starter/installing.html) + [Typescript](https://www.typescriptlang.org/docs/handbook/intro.html) 编写服务代码；

使用 [Jest](https://jestjs.io/docs/getting-started) 编写测试代码；

使用 [Prettier](https://prettier.io/docs/en/) + [ESlint](https://eslint.org/docs/latest/use/getting-started) 来规范代码。

尝试使用 [React SSR](https://zh-hans.react.dev/reference/rsc/server-components) 来实现服务端渲染；

尝试使用 [Webpack](https://webpack.docschina.org/concepts/) 来构建应用；

### 主要功能包括：

- [x] 登录功能：JWT 验证、登录 Code 码验证
- [x] 彩票数据（保存本地 json 格式）：获取彩票数据（所有数据和更新最新数据），
- [ ] SSR Implementation.
- [ ] 彩票数据支持通知，支持数据导出，
- [ ] websocket 实现实时通知
- [ ] Chart 图表功能：使用 `ECharts` 实现图表功能
- [ ] 文件操作：文件上传、文件下载、大文件操作、多文件操作等

### 其它关键词

`React Portals` `React Error Boundaries` `React Suspense` `React Redux` `React Context` `React Hooks` `React Router`

## Client Code

### 目录结构

```bash
├── src/client
│ ├── views/
│ │ ├── home.ts
│ │ ├── about.ts
│ │ ├── contact.ts
│ │ └── ...
│ ├── components/
│ ├── utils/
│ ├── App.tsx
│ └── index.tsx
├── package.json
└── tsconfig.json
```

## Server Code

### 目录结构

```bash
├── src/server
│ ├── controllers/      # 控制器层
│ │ └── userController.ts
│ ├── models/           # 模型层
│ │ └── userModel.ts
│ ├── views/            # 视图层(如果需要)
│ │ └── user/
│ ├── routes/           # 路由配置
│ │ └── userRoutes.ts
│ ├── services/         # 业务逻辑层
│ │ └── userService.ts
│ ├── config/           # 配置文件
│ │ └── database.ts
│ ├── middlewares/      # 中间件
│ │ └── auth.ts
│ ├── utils/            # 工具函数
│ │ └── jwt.ts
│ └── index.ts          # 入口文件
├── package.json
└── tsconfig.json
```

### 项目架构

1. 控制器(Controllers)：
   - 处理 HTTP **请求和响应**
   - 调用相应的 Service 层方法
   - 返回响应给客户端
2. 服务层(Services)：
   - 包含业务逻辑
   - 调用 Model 层进行数据操作
   - 处理数据转换和验证
3. 模型层(Models)：
   - 定义数据结构
   - 处理数据库操作
   - 提供数据访问方法
4. 路由(Routes)：
   - 定义 API 端点
   - 将请求映射到对应的控制器方法
5. 中间件(Middlewares)：
   - 处理认证授权
   - 请求日志
   - 错误处理等

### 这种结构的优势：

- 代码组织清晰
- 职责分离
- 便于维护和测试
- 提高代码复用性
- 便于团队协作

## ES6 模块和 CommonJS 的差异

Node.js 默认使用 CommonJS 模块系统，而 TypeScript 的模块可以是 ES6 或 CommonJS，可以通过配置 tsconfig.json 来控制。使用 `esModuleInterop: true` 可以帮助解决两者之间的兼容性问题。

## Node Version

- Node.js@20+
