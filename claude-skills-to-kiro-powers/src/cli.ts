#!/usr/bin/env bun

import { parseArgs } from "util";
import { SkillsConverter } from "./converter";
import { SkillsDownloader } from "./downloader";

const args = process.argv.slice(2);

const options = {
  help: { type: "boolean" as const, short: "h" },
  install: { type: "string" as const, short: "i" },
  convert: { type: "string" as const, short: "c" },
  output: { type: "string" as const, short: "o" },
};

const parsed = parseArgs({ args, options, allowPositionals: true });

async function main() {
  if (parsed.values.help || args.length === 0) {
    showHelp();
    return;
  }

  try {
    if (parsed.values.install) {
      // skillsmp.com からスキルをインストール
      const skillName = parsed.values.install;
      console.log(`📥 スキル "${skillName}" をインストール中...`);

      const downloader = new SkillsDownloader();
      const skillPath = await downloader.downloadSkill(skillName);

      console.log(`✅ インストール完了: ${skillPath}`);

      // インストール後、自動的に変換
      const converter = new SkillsConverter();
      const outputDir =
        parsed.values.output || `~/.kiro/powers/${skillName}`;
      await converter.convert(skillPath, outputDir);

      console.log(`✅ 変換完了: ${outputDir}`);
    } else if (parsed.values.convert) {
      // ローカルの SKILL.md を変換
      const skillPath = parsed.values.convert;
      const outputDir =
        parsed.values.output || `~/.kiro/powers/${skillPath.split("/").pop()}`;

      console.log(`🔄 スキルを変換中: ${skillPath}`);

      const converter = new SkillsConverter();
      await converter.convert(skillPath, outputDir);

      console.log(`✅ 変換完了: ${outputDir}`);
    }
  } catch (error) {
    console.error(`❌ エラー: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
Claude Code Skills を Kiro Powers に変換する CLI ツール

使用方法:
  skills-to-powers [オプション]

オプション:
  -i, --install <skill-name>    skillsmp.com からスキルをインストール・変換
  -c, --convert <path>          ローカルのスキルディレクトリを変換
  -o, --output <path>           出力先ディレクトリ（デフォルト: ~/.kiro/powers/<name>）
  -h, --help                    このヘルプを表示

例:
  # skillsmp.com からスキルをインストール・変換
  skills-to-powers --install database-query-helper

  # ローカルのスキルを変換
  skills-to-powers --convert ./my-skill

  # 出力先を指定して変換
  skills-to-powers --convert ./my-skill --output ./output/my-power
  `);
}

main();
