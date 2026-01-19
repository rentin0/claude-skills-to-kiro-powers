#!/usr/bin/env bun

import React, { useState, useEffect } from "react";
import { render, Box, Text } from "ink";
import TextInput from "ink-text-input";
import { SkillsConverter } from "./converter";
import { SkillsDownloader } from "./downloader";
import { Header, Status, Progress, ResultTable, Summary } from "./ui";

interface ConversionResult {
  name: string;
  status: "成功" | "失敗";
  message: string;
}

type AppState =
  | "メニュー"
  | "入力"
  | "処理中"
  | "完了";

const App: React.FC = () => {
  const [state, setState] = useState<AppState>("メニュー");
  const [mode, setMode] = useState<"convert" | "install" | null>(null);
  const [skillPath, setSkillPath] = useState("");
  const [skillName, setSkillName] = useState("");
  const [outputDir, setOutputDir] = useState("");
  const [inputMode, setInputMode] = useState<"path" | "name" | "output">("path");
  const [step, setStep] = useState<
    "初期化" | "ダウンロード" | "パース" | "変換" | "コピー" | "完了"
  >("初期化");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);

  // 処理実行
  useEffect(() => {
    if (state !== "処理中") return;

    const runConversion = async () => {
      try {
        setStartTime(Date.now());
        const converter = new SkillsConverter();
        let actualSkillPath = skillPath;

        // ダウンロード処理
        if (mode === "install") {
          setStep("ダウンロード");
          setProgress(0);

          const downloader = new SkillsDownloader();
          actualSkillPath = await downloader.downloadSkill(skillName);

          setProgress(100);
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        // パース処理
        setStep("パース");
        setProgress(0);
        await new Promise((resolve) => setTimeout(resolve, 300));
        setProgress(100);

        // 変換処理
        setStep("変換");
        setProgress(0);
        await new Promise((resolve) => setTimeout(resolve, 300));
        setProgress(100);

        // コピー処理
        setStep("コピー");
        setProgress(0);

        const finalOutputDir =
          outputDir || `~/.kiro/powers/${skillName || "skill"}`;
        await converter.convert(actualSkillPath!, finalOutputDir);

        setProgress(100);
        await new Promise((resolve) => setTimeout(resolve, 300));

        // 完了
        setStep("完了");
        const result: ConversionResult = {
          name: skillName || skillPath || "スキル",
          status: "成功",
          message: `${finalOutputDir} に変換完了`,
        };
        setResults([result]);
        setTotalTime(Date.now() - startTime);
        setState("完了");
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setStep("完了");
        const result: ConversionResult = {
          name: skillName || skillPath || "スキル",
          status: "失敗",
          message: err instanceof Error ? err.message : String(err),
        };
        setResults([result]);
        setTotalTime(Date.now() - startTime);
        setState("完了");
      }
    };

    runConversion();
  }, [state, mode, skillPath, skillName, outputDir, startTime]);

  // メニュー画面
  if (state === "メニュー") {
    return (
      <Box flexDirection="column">
        <Header />

        <Box flexDirection="column" marginY={1}>
          <Text bold color="cyan">
            どの操作を実行しますか？
          </Text>
          <Box marginTop={1} flexDirection="column">
            <Box marginY={1}>
              <Text
                color={mode === "convert" ? "green" : "white"}
                backgroundColor={mode === "convert" ? "green" : undefined}
              >
                {mode === "convert" ? "▶ " : "  "}
                ローカルのスキルを変換
              </Text>
            </Box>
            <Box marginY={1}>
              <Text
                color={mode === "install" ? "green" : "white"}
                backgroundColor={mode === "install" ? "green" : undefined}
              >
                {mode === "install" ? "▶ " : "  "}
                skillsmp.com からインストール・変換
              </Text>
            </Box>
          </Box>

          {mode && (
            <Box marginTop={2}>
              <Text color="yellow">
                選択: {mode === "convert" ? "ローカル変換" : "インストール"}
              </Text>
              <Text marginLeft={2} color="cyan">
                (Enter キーで確定)
              </Text>
            </Box>
          )}
        </Box>

        <Box marginTop={2}>
          <Text color="gray">
            矢印キーで選択、Enter で確定、q で終了
          </Text>
        </Box>
      </Box>
    );
  }

  // 入力画面
  if (state === "入力") {
    const prompts = {
      path: "スキルのパスを入力してください: ",
      name: "スキル名を入力してください: ",
      output: "出力先ディレクトリを入力してください (オプション): ",
    };

    const currentValue =
      inputMode === "path"
        ? skillPath
        : inputMode === "name"
          ? skillName
          : outputDir;

    const handleSubmit = (value: string) => {
      if (inputMode === "path") {
        setSkillPath(value);
        setInputMode("output");
      } else if (inputMode === "name") {
        setSkillName(value);
        setInputMode("output");
      } else {
        setOutputDir(value);
        setState("処理中");
      }
    };

    return (
      <Box flexDirection="column">
        <Header />

        <Status
          status="info"
          message={`モード: ${mode === "convert" ? "ローカル変換" : "インストール"}`}
        />

        <Box marginY={1}>
          <TextInput
            value={currentValue}
            onChange={(value) => {
              if (inputMode === "path") setSkillPath(value);
              else if (inputMode === "name") setSkillName(value);
              else setOutputDir(value);
            }}
            onSubmit={handleSubmit}
            placeholder={prompts[inputMode]}
          />
        </Box>

        <Text color="gray" marginTop={1}>
          {prompts[inputMode]}
        </Text>
      </Box>
    );
  }

  // 処理中画面
  if (state === "処理中") {
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

            <Progress
              current={progress}
              total={100}
              label={`進捗: ${step}`}
            />
          </>
        )}
      </Box>
    );
  }

  // 完了画面
  if (state === "完了") {
    const successCount = results.filter((r) => r.status === "成功").length;
    const failureCount = results.filter((r) => r.status === "失敗").length;

    return (
      <Box flexDirection="column">
        <Header />

        {error ? (
          <Status status="error" message={error} />
        ) : (
          <>
            <Status status="success" message="変換が完了しました！" />
            <ResultTable results={results} />
            <Summary
              successCount={successCount}
              failureCount={failureCount}
              totalTime={totalTime}
            />
          </>
        )}

        <Box marginTop={2}>
          <Text color="gray">
            任意のキーを押して終了...
          </Text>
        </Box>
      </Box>
    );
  }

  return null;
};

// メイン処理
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
Claude Code Skills を Kiro Powers に変換する CLI ツール（インタラクティブ TUI 版）

使用方法:
  skills-to-powers-interactive [オプション]

オプション:
  -h, --help    このヘルプを表示

このツールはインタラクティブなメニューで操作します。
  `);
  process.exit(0);
}

const { unmount } = render(<App />);

// キーボード入力を処理
process.stdin.on("data", (key) => {
  if (key.toString() === "q") {
    unmount();
    process.exit(0);
  }
});
