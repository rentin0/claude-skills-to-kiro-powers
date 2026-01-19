import React from "react";
import { Box, Text } from "ink";

interface SummaryProps {
  successCount: number;
  failureCount: number;
  totalTime: number;
}

export const Summary: React.FC<SummaryProps> = ({
  successCount,
  failureCount,
  totalTime,
}) => {
  const total = successCount + failureCount;

  return (
    <Box flexDirection="column" marginY={1} borderStyle="round" borderColor="cyan" paddingX={1}>
      <Text bold color="cyan">
        ╔════════════════════════════════════════╗
      </Text>
      <Text bold color="cyan">
        ║          変換完了サマリー              ║
      </Text>
      <Text bold color="cyan">
        ╚════════════════════════════════════════╝
      </Text>

      <Box marginY={1} flexDirection="column">
        <Box>
          <Text color="green">✅ </Text>
          <Text>成功: </Text>
          <Text bold color="green">
            {successCount}/{total}
          </Text>
        </Box>
        <Box marginTop={1}>
          <Text color="red">❌ </Text>
          <Text>失敗: </Text>
          <Text bold color="red">
            {failureCount}/{total}
          </Text>
        </Box>
        <Box marginTop={1}>
          <Text color="yellow">⏱️  </Text>
          <Text>処理時間: </Text>
          <Text bold color="yellow">
            {(totalTime / 1000).toFixed(2)}秒
          </Text>
        </Box>
      </Box>

      <Box marginTop={1}>
        <Text color="cyan">
          {successCount === total
            ? "🎉 全てのスキルが正常に変換されました！"
            : failureCount === total
              ? "⚠️  全てのスキルの変換に失敗しました"
              : "⚠️  一部のスキルの変換に失敗しました"}
        </Text>
      </Box>
    </Box>
  );
};
