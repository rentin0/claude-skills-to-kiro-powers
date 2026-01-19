/**
 * ZIP ファイル処理モジュール
 * 
 * skill.zip ファイルを解凍し、MCP サーバーに処理を委譲します。
 */

import { mkdir, rm } from "fs/promises";
import { join } from "path";
import AdmZip from "adm-zip";
import { expandHome } from "./utils";

export class ZipHandler {
  /**
   * ZIP ファイルを解凍
   */
  async extractZip(zipPath: string, extractDir: string): Promise<string> {
    const expandedZipPath = expandHome(zipPath);
    const expandedExtractDir = expandHome(extractDir);

    // 抽出ディレクトリを作成
    await mkdir(expandedExtractDir, { recursive: true });

    try {
      const zip = new AdmZip(expandedZipPath);
      zip.extractAllTo(expandedExtractDir, true);
      return expandedExtractDir;
    } catch (error) {
      throw new Error(`ZIP 解凍エラー: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 一時ディレクトリをクリーンアップ
   */
  async cleanup(tempDir: string): Promise<void> {
    try {
      await rm(expandHome(tempDir), { recursive: true, force: true });
    } catch (error) {
      console.error(`クリーンアップエラー: ${error}`);
    }
  }
}
