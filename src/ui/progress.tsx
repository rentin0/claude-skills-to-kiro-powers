import React from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";

interface ProgressProps {
  current: number;
  total: number;
  label: string;
}

export const Progress: React.FC<ProgressProps> = ({
  current,
  total,
  label,
}) => {
  const percentage = Math.round((current / total) * 100);
  const barLength = 30;
  const filledLength = Math.round((percentage / 100) * barLength);
  const emptyLength = barLength - filledLength;

  const bar =
    "█".repeat(filledLength) + "░".repeat(emptyLength);

  return (
    <Box flexDirection="column" marginY={1}>
      <Box>
        <Box width={4}>
          <Text color="yellow">
            <Spinner type="dots" />
          </Text>
        </Box>
        <Text>{label}</Text>
      </Box>
      <Box marginTop={1}>
        <Text color="green">[{bar}]</Text>
        <Text marginLeft={2}>
          {percentage}% ({current}/{total})
        </Text>
      </Box>
    </Box>
  );
};
