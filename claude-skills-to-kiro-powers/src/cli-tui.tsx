#!/usr/bin/env bun

import React, { useState, useEffect } from "react";
import { render, Box, Text } from "ink";
import { parseArgs } from "util";
import { SkillsConverter } from "./converter";
import { SkillsDownloader } from "./downloader";
import { Header, Status, Progress, ResultTable } from "./ui";

interface ConversionResult {
  name: string;
  status: "成功" | "失敗";
  message: string;
}

interface AppProps {
  skillPath?: string;
  skillName?: string;
  outputDir?: string;
  isInstall?: boolean;
}

const App: React.FC<AppProps> = ({
  skillPath,
  skillName,
  outputDir,
  isInstall,
}) => {
  const [step, setStep] = useState<
    "初期化" | "ダウンロード" | "パース" | "変換" | "コピー" | "完了"
  >("初期化");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runConversion = async () => {
      try {
        const converter = new SkillsConverter();
        let actualSkillPath = skillPath;

        // ダウンロード処理
        if (isInstall && skillName) {
          setStep("ダウンロード");
          setProgress(0);

          const downloader = new SkillsDownloader();
          actualSkillPath = await downloader.downloadSkill(skillName);

          setProgress(100);
        }

        // パース処理
        setStep("パース");
        setProgress(0);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setProgress(100);

        // 変換処理
        setStep("変換");
        setProgress(0);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setProgress(100);

        // コピー処理
        setStep("コピー");
        setProgress(0);

        const finalOutputDir =
          outputDir || `~/.kiro/powers/${skillName || "skill"}`;
        await converter.convert(actualSkillPath!, finalOutputDir);

        setProgress(100);

        // 完了
        setStep("完了");
        const result: ConversionResult = {
          name: skillName || skillPath || "スキル",
          status: "成功",
          message: `${finalOutputDir} に変換完了`,
        };
        setResults([result]);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setStep("完了");
        const result: ConversionResult = {
          name: skillName || skillPath || "スキル",
          status: "失敗",
          message: err instanceof Error ? err.message : String(err),
        };
        setResults([result]);
      }
    };

    runConversion();
  }, [skillPath, skillName, outputDir, isInstall]);

  const stepLabels = {
    初期化: "初期化中...",
    ダウンロード: "skillsmp.com からダウンロード中...",
    パース: "frontmatter をパース中...",
    変換: "POWER.md に変換中...",
    コピー: "補助ファイルをコピー中...",
    完了: "完了！",
  };

  return (
    <Box flexDirection="column">
      <Header />

      {error ? (
        <Status status="error" message={error} />
      ) : (
        <>
          <Status
            status={step === "完了" ? "success" : "info"}
            message={`${stepLabels[step]}`}
          />

          {step !== "完了" && (
            <Progress
              current={progress}
              total={100}
              label={`${step}`}
            />
          )}

          {step === "完了" && results.length > 0 && (
            <ResultTable results={results} />
          )}
        </>
      )}
    </Box>
  );
};

// CLI 引数をパース
const args = process.argv.slice(2);
const options = {
  help: { type: "boolean" as const, short: "h" },
  install: { type: "string" as const, short: "i" },
  convert: { type: "string" as const, short: "c" },
  output: { type: "string" as const, short: "o" },
};

const parsed = parseArgs({ args, options, allowPositionals: true });

if (parsed.values.help || args.length === 0) {
  console.log(`
Claude Code Skills を Kiro Powers に変換する CLI ツール（TUI 版）

使用方法:
  skills-to-powers-tui [オプション]

オプション:
  -i, --install <skill-name>    skillsmp.com からスキルをインストール・変換
  -c, --convert <path>          ローカルのスキルディレクトリを変換
  -o, --output <path>           出力先ディレクトリ（デフォルト: ~/.kiro/powers/<name>）
  -h, --help                    このヘルプを表示

例:
  # skillsmp.com からスキルをインストール・変換
  skills-to-powers-tui --install database-query-helper

  # ローカルのスキルを変換
  skills-to-powers-tui --convert ./my-skill

  # 出力先を指定して変換
  skills-to-powers-tui --convert ./my-skill --output ./output/my-power
  `);
  process.exit(0);
}

const { unmount } = render(
  <App
    skillPath={parsed.values.convert as string | undefined}
    skillName={parsed.values.install as string | undefined}
    outputDir={parsed.values.output as string | undefined}
    isInstall={!!parsed.values.install}
  />
);
