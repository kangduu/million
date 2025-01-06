import jwt from "jsonwebtoken";
import { createClient } from "redis";

// 创建redis客户端
const redisClient = createClient();

interface TokenPayload {
  username: Account.UserBase["username"];
  tokenId: string; // 添加唯一标识
}

/**
 * 生成token
 * @param username 用户名
 * @returns token
 */
function generateToken(username: string) {
  const tokenId = Math.random().toString(36).substring(2); // 生成随机tokenId

  const token = jwt.sign(
    { username, tokenId } as TokenPayload,
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  // 将token信息存入redis，设置相同过期时间
  // redisClient.setEx(`token:${username}:${tokenId}`, 3600, "valid");

  return token;
}

/**
 * 登出/注销token
 * @param token token
 */
async function revokeToken(token: string) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  await redisClient.del(`token:${decoded.username}:${decoded.tokenId}`);
}

export { generateToken, revokeToken };
