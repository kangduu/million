## 关于本项目的说明

主要功能包括：

1. 登录功能：JWT 验证、登录 Code 码验证
2. 彩票数据（保存本地 json 格式）：获取彩票数据（所有数据和更新最新数据），支持通知，支持数据导出，
3. websocket 实现实时通知
4. Chart 图表功能：使用 `ECharts` 实现图表功能
5. 文件操作：文件上传、文件下载、大文件操作、多文件操作等s
6. ......
7.

~~使用 `Webpack@5` + `React@19` + `Typescript@5` + `Node.js@20` + `Express@4` 技术，实现 React SSR 。~~

主要学习以下知识点：

1. 使用 `Express` 搭建 `Node.js` 服务
2. 使用 `Typescript` 编写 `Node.js` 项目
3. ~~使用 `Webpack` 打包 `React SSR` 项目~~
4. ~~使用 `React Router` 实现前端路由~~
5. ~~使用 `React Hooks` 实现组件逻辑~~
6. ~~使用 `React Context` 实现组件状态管理~~
7. ~~使用 `React Redux` 实现全局状态管理~~
8. ~~使用 `React Suspense` 实现组件懒加载~~
9. ~~使用 `React Error Boundaries` 实现组件错误处理~~
10. ~~使用 `React Portals` 实现组件弹出层~~

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
