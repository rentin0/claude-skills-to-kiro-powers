import React from "react";
import { Box, Text } from "ink";

export const Header: React.FC = () => {
  return (
    <Box
      flexDirection="column"
      marginBottom={1}
      borderStyle="round"
      borderColor="cyan"
      paddingX={2}
      paddingY={1}
    >
      <Text bold color="cyan">
        Claude Code Skills → Kiro Powers 変換ツール
      </Text>
    </Box>
  );
};
