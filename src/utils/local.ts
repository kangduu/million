import { readLocalFile } from "./file";
import logger from "./logger";
import getPathCWD from "./path";

/**
 * 读取本地数据
 * @param url 文件路径
 * @returns 本地数据
 */
async function readLocalData<T>(url: string): Promise<T | null> {
  let local: T | null = null;
  try {
    let _local = await readLocalFile(getPathCWD(url));
    if (_local) _local = JSON.parse(_local as string);
    else _local = null;

    local = _local as T;
  } catch (error) {
    logger.error(error);
  }
  return local;
}

export default readLocalData;
