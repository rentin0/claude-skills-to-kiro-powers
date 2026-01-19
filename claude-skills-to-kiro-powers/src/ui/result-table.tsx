import React from "react";
import { Box, Text } from "ink";

interface ResultItem {
  name: string;
  status: "成功" | "失敗";
  message: string;
}

interface ResultTableProps {
  results: ResultItem[];
}

export const ResultTable: React.FC<ResultTableProps> = ({ results }) => {
  return (
    <Box
      flexDirection="column"
      marginY={1}
      borderStyle="round"
      borderColor="cyan"
      paddingX={2}
      paddingY={1}
    >
      {/* ヘッダー */}
      <Box marginBottom={1}>
        <Box width={20}>
          <Text bold color="cyan">
            スキル名
          </Text>
        </Box>
        <Box width={10}>
          <Text bold color="cyan">
            状態
          </Text>
        </Box>
        <Box>
          <Text bold color="cyan">
            メッセージ
          </Text>
        </Box>
      </Box>

      {/* セパレータ */}
      <Text color="cyan">
        {"-".repeat(70)}
      </Text>

      {/* データ行 */}
      {results.map((result, index) => (
        <Box key={index} marginTop={1}>
          <Box width={20}>
            <Text color={result.status === "成功" ? "green" : "red"}>
              {result.name}
            </Text>
          </Box>
          <Box width={10}>
            <Text color={result.status === "成功" ? "green" : "red"}>
              {result.status}
            </Text>
          </Box>
          <Box>
            <Text color={result.status === "成功" ? "green" : "red"}>
              {result.message}
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
