import { homedir } from "os";

/**
 * ~ をホームディレクトリに展開
 */
export function expandHome(path: string): string {
  if (path.startsWith("~")) {
    return path.replace("~", homedir());
  }
  return path;
}

/**
 * パスを正規化
 */
export function normalizePath(path: string): string {
  return expandHome(path).replace(/\/$/, "");
}
