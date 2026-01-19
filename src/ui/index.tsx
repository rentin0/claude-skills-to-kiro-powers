import React, { useState, useEffect } from "react";
import { Box, Text } from "ink";
import { Header } from "./header";
import { Status } from "./status";
import { Progress } from "./progress";
import { ResultTable } from "./result-table";
import { Summary } from "./summary";

interface ConversionResult {
  name: string;
  status: "成功" | "失敗";
  message: string;
}

interface AppProps {
  skillName: string;
  onComplete: (results: ConversionResult[]) => void;
}

export const App: React.FC<AppProps> = ({ skillName, onComplete }) => {
  const [step, setStep] = useState<"parsing" | "converting" | "copying" | "complete">("parsing");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ConversionResult[]>([]);

  useEffect(() => {
    // シミュレーション用のタイムアウト
    const timer = setTimeout(() => {
      if (step === "parsing") {
        setProgress(100);
        setStep("converting");
      } else if (step === "converting") {
        setProgress(100);
        setStep("copying");
      } else if (step === "copying") {
        setProgress(100);
        setStep("complete");
        const result: ConversionResult = {
          name: skillName,
          status: "成功",
          message: `~/.kiro/powers/${skillName} に変換完了`,
        };
        setResults([result]);
        onComplete([result]);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [step, skillName, onComplete]);

  const stepLabels = {
    parsing: "frontmatter をパース中...",
    converting: "POWER.md に変換中...",
    copying: "補助ファイルをコピー中...",
    complete: "完了！",
  };

  return (
    <Box flexDirection="column">
      <Header />

      <Status status="info" message={`スキル: ${skillName}`} />

      {step !== "complete" && (
        <Progress
          current={progress}
          total={100}
          label={stepLabels[step]}
        />
      )}

      {step === "complete" && (
        <>
          <Status status="success" message="変換が完了しました！" />
          <ResultTable results={results} />
        </>
      )}
    </Box>
  );
};

export { Header, Status, Progress, ResultTable, Summary };
