#!/usr/bin/env bun

/**
 * 複数のスキルを一括変換するスクリプト
 * 
 * 使用方法:
 *   bun run scripts/batch-convert.ts <スキル名1> <スキル名2> ...
 * 
 * 例:
 *   bun run scripts/batch-convert.ts database-query-helper code-review-assistant
 */

import { SkillsConverter } from "../src/converter";
import { SkillsDownloader } from "../src/downloader";

async function main() {
  const skillNames = process.argv.slice(2);

  if (skillNames.length === 0) {
    console.log("使用方法: bun run scripts/batch-convert.ts <スキル名1> <スキル名2> ...");
    process.exit(1);
  }

  const downloader = new SkillsDownloader();
  const converter = new SkillsConverter();
  const results: { name: string; status: "成功" | "失敗"; message: string }[] =
    [];

  for (const skillName of skillNames) {
    try {
      console.log(`\n📦 ${skillName} を処理中...`);

      // ダウンロード
      const skillPath = await downloader.downloadSkill(skillName);

      // 変換
      const outputDir = `~/.kiro/powers/${skillName}`;
      await converter.convert(skillPath, outputDir);

      results.push({
        name: skillName,
        status: "成功",
        message: `${outputDir} に変換完了`,
      });
    } catch (error) {
      results.push({
        name: skillName,
        status: "失敗",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // 結果を表示
  console.log("\n\n📊 変換結果:");
  console.log("=".repeat(60));

  for (const result of results) {
    const icon = result.status === "成功" ? "✅" : "❌";
    console.log(`${icon} ${result.name}: ${result.status}`);
    console.log(`   ${result.message}`);
  }

  const successCount = results.filter((r) => r.status === "成功").length;
  const failureCount = results.filter((r) => r.status === "失敗").length;

  console.log("=".repeat(60));
  console.log(`合計: ${successCount} 成功, ${failureCount} 失敗`);

  process.exit(failureCount > 0 ? 1 : 0);
}

main();
