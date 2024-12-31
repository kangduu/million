### 认证中间件 (authMiddleware):

- 从请求头获取 JWT token
- 验证 token 的有效性
- 解析 token 中的用户信息
- 将用户信息添加到请求对象中

### 角色验证中间件 (checkRole):

- 检查用户是否具有所需角色
- 支持多角色验证
- 防止未授权访问

### 使用说明：

- 首先需要安装必要的依赖：

  ```bash
  npm install jsonwebtoken
  npm install @types/jsonwebtoken --save-dev
  ```

- 在实际应用中，建议：

  - 将 JWT_SECRET 存储在环境变量中
  - 添加 token 过期时间验证
  - 实现 token 刷新机制
  - 添加更详细的错误处理
  - 考虑使用 Redis 存储黑名单 token

- 可以根据需求扩展功能：
  - 添加权限级别验证
  - 实现 API 频率限制
  - 添加日志记录
  - 实现多因素认证
