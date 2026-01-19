#!/usr/bin/env bun

/**
 * Claude Code Skills to Kiro Powers MCP サーバー
 * 
 * このサーバーは、Claude Code Skills を Kiro Powers に変換するための
 * MCP（Model Context Protocol）インターフェースを提供します。
 */

import {
  Server,
  Tool,
  TextContent,
  ErrorContent,
} from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SkillsConverter } from "./converter";
import { SkillsDownloader } from "./downloader";
import { ZipHandler } from "./zip-handler";
import { JpDescriptionGenerator } from "./jp-description-generator";
import { join } from "path";
import { expandHome } from "./utils";
import { writeFileSync } from "fs";

// MCP サーバーのインスタンスを作成
const server = new Server({
  name: "claude-skills-to-kiro-powers",
  version: "0.1.0",
});

// ツール定義
const tools: Tool[] = [
  {
    name: "convert_skill",
    description:
      "Claude Code Skill を Kiro Power に変換します。ローカルのスキルファイルを指定して変換を実行します。",
    inputSchema: {
      type: "object",
      properties: {
        skill_path: {
          type: "string",
          description: "変換するスキルのディレクトリパス（例: ./my-skill）",
        },
        output_dir: {
          type: "string",
          description:
            "出力先ディレクトリ（オプション、デフォルト: ~/.kiro/powers/<skill-name>）",
        },
      },
      required: ["skill_path"],
    },
  },
  {
    name: "convert_skill_from_zip",
    description:
      "skill.zip ファイルを解凍して、Kiro Power に変換します。自動的に日本語説明ファイルも生成します。",
    inputSchema: {
      type: "object",
      properties: {
        zip_path: {
          type: "string",
          description: "skill.zip ファイルのパス",
        },
        output_dir: {
          type: "string",
          description:
            "出力先ディレクトリ（オプション、デフォルト: ~/.kiro/powers/<skill-name>）",
        },
      },
      required: ["zip_path"],
    },
  },
  {
    name: "download_and_convert_skill",
    description:
      "skillsmp.com からスキルをダウンロードして、Kiro Power に変換します。",
    inputSchema: {
      type: "object",
      properties: {
        skill_name: {
          type: "string",
          description: "ダウンロードするスキルの名前（例: database-query-helper）",
        },
        output_dir: {
          type: "string",
          description:
            "出力先ディレクトリ（オプション、デフォルト: ~/.kiro/powers/<skill-name>）",
        },
      },
      required: ["skill_name"],
    },
  },
  {
    name: "translate_to_japanese",
    description:
      "POWER.md の内容を日本語に翻訳して、.jp-description.md ファイルを生成します。Claude に翻訳を依頼してください。",
    inputSchema: {
      type: "object",
      properties: {
        power_path: {
          type: "string",
          description: "POWER.md が配置されているディレクトリパス",
        },
        translated_content: {
          type: "string",
          description: "Claude が翻訳した日本語の内容",
        },
      },
      required: ["power_path", "translated_content"],
    },
  },
  {
    name: "list_available_skills",
    description:
      "skillsmp.com で利用可能なスキルの一覧を取得します（API 実装待ち）。",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "検索クエリ（オプション）",
        },
      },
    },
  },
];

// ツール実行ハンドラー
server.setRequestHandler(
  "tools/call",
  async (request: { name: string; arguments: Record<string, unknown> }) => {
    try {
      const { name, arguments: args } = request;

      if (name === "convert_skill") {
        const skillPath = args.skill_path as string;
        const outputDir = (args.output_dir as string) || undefined;

        const converter = new SkillsConverter();
        const finalOutputDir = outputDir || `~/.kiro/powers/${skillPath.split("/").pop()}`;
        await converter.convert(skillPath, finalOutputDir);

        // 日本語説明ファイルを生成
        const jpGenerator = new JpDescriptionGenerator();
        jpGenerator.generateJpDescription(expandHome(finalOutputDir));

        return {
          content: [
            {
              type: "text",
              text: `✅ スキルを正常に変換しました。\n出力先: ${finalOutputDir}\n日本語説明: ${finalOutputDir}/${skillPath.split("/").pop()}.jp-description.md`,
            } as TextContent,
          ],
        };
      } else if (name === "convert_skill_from_zip") {
        const zipPath = args.zip_path as string;
        const outputDir = (args.output_dir as string) || undefined;

        // ZIP ファイルを解凍
        const zipHandler = new ZipHandler();
        const tempDir = `/tmp/skill-extract-${Date.now()}`;
        const extractedPath = await zipHandler.extractZip(zipPath, tempDir);

        // 抽出されたスキルを変換
        const converter = new SkillsConverter();
        const skillName = extractedPath.split("/").pop() || "skill";
        const finalOutputDir = outputDir || `~/.kiro/powers/${skillName}`;
        await converter.convert(extractedPath, finalOutputDir);

        // 日本語説明ファイルを生成
        const jpGenerator = new JpDescriptionGenerator();
        jpGenerator.generateJpDescription(expandHome(finalOutputDir));

        // 一時ディレクトリをクリーンアップ
        await zipHandler.cleanup(tempDir);

        return {
          content: [
            {
              type: "text",
              text: `✅ ZIP ファイルを解凍・変換しました。\n出力先: ${finalOutputDir}\n日本語説明: ${finalOutputDir}/${skillName}.jp-description.md`,
            } as TextContent,
          ],
        };
      } else if (name === "download_and_convert_skill") {
        const skillName = args.skill_name as string;
        const outputDir = (args.output_dir as string) || undefined;

        const downloader = new SkillsDownloader();
        const skillPath = await downloader.downloadSkill(skillName);

        const converter = new SkillsConverter();
        const finalOutputDir = outputDir || `~/.kiro/powers/${skillName}`;
        await converter.convert(skillPath, finalOutputDir);

        // 日本語説明ファイルを生成
        const jpGenerator = new JpDescriptionGenerator();
        jpGenerator.generateJpDescription(expandHome(finalOutputDir));

        return {
          content: [
            {
              type: "text",
              text: `✅ スキルをダウンロード・変換しました。\n出力先: ${finalOutputDir}\n日本語説明: ${finalOutputDir}/${skillName}.jp-description.md`,
            } as TextContent,
          ],
        };
      } else if (name === "translate_to_japanese") {
        const powerPath = args.power_path as string;
        const translatedContent = args.translated_content as string;

        const expandedPowerPath = expandHome(powerPath);
        const skillName = expandedPowerPath.split("/").pop() || "skill";
        const jpDescriptionPath = join(expandedPowerPath, `${skillName}.jp-description.md`);

        // 翻訳済みコンテンツを保存
        writeFileSync(jpDescriptionPath, translatedContent);

        return {
          content: [
            {
              type: "text",
              text: `✅ 日本語説明ファイルを生成しました。\n保存先: ${jpDescriptionPath}`,
            } as TextContent,
          ],
        };
      } else if (name === "list_available_skills") {
        return {
          content: [
            {
              type: "text",
              text: "⚠️  skillsmp.com API の実装がまだ完了していません。\n現在はローカルのスキルファイルからの変換に対応しています。",
            } as TextContent,
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `❌ 不明なツール: ${name}`,
          } as TextContent,
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
          } as TextContent,
        ],
      };
    }
  }
);

// ツール一覧を返すハンドラー
server.setRequestHandler("tools/list", async () => {
  return { tools };
});

// サーバーを起動
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Claude Code Skills to Kiro Powers MCP サーバーが起動しました");
}

main().catch((error) => {
  console.error("サーバー起動エラー:", error);
  process.exit(1);
});
