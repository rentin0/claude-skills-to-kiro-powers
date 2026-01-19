import React from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";

interface StatusProps {
  status: "pending" | "success" | "error" | "info";
  message: string;
}

export const Status: React.FC<StatusProps> = ({ status, message }) => {
  const spinnerTypes = {
    pending: "dots",
    success: "dots",
    error: "dots",
    info: "dots",
  };

  const colors = {
    pending: "yellow",
    success: "green",
    error: "red",
    info: "blue",
  } as const;

  const icons = {
    pending: <Spinner type={spinnerTypes.pending} />,
    success: "✅",
    error: "❌",
    info: "ℹ️",
  };

  return (
    <Box marginY={1}>
      <Box marginRight={1}>
        {status === "pending" ? (
          <Text color={colors[status]}>{icons.pending}</Text>
        ) : (
          <Text color={colors[status]}>{icons[status]}</Text>
        )}
      </Box>
      <Text>{message}</Text>
    </Box>
  );
};
