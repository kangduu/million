import { readLocalFile } from "./file";
import logger from "./logger";
import getPathCWD from "./path";

/**
 * 读取本地数据
 * @param url 文件路径
 * @returns 本地数据
 */
async function readLocalData<T>(url: string): Promise<T[] | null> {
  let local: any = null;
  try {
    local = await readLocalFile(getPathCWD(url));
    if (local) local = JSON.parse(local as string);
    else local = null;
  } catch (error) {
    logger.error(error);
  }
  return local;
}

export default readLocalData;
