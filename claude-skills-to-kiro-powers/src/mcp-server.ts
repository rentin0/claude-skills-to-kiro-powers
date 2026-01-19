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
        await converter.convert(skillPath, outputDir || `~/.kiro/powers/${skillPath.split("/").pop()}`);

        return {
          content: [
            {
              type: "text",
              text: `✅ スキルを正常に変換しました。\n出力先: ${outputDir || `~/.kiro/powers/${skillPath.split("/").pop()}`}`,
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

        return {
          content: [
            {
              type: "text",
              text: `✅ スキルをダウンロード・変換しました。\n出力先: ${finalOutputDir}`,
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
