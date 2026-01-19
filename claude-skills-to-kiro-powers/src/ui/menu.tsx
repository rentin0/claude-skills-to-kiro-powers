import React, { useState, useEffect } from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";

interface MenuOption {
  label: string;
  value: string;
}

interface MenuProps {
  title: string;
  options: MenuOption[];
  onSelect: (value: string) => void;
}

export const Menu: React.FC<MenuProps> = ({ title, options, onSelect }) => {
  return (
    <Box flexDirection="column" marginY={1}>
      <Text bold color="cyan">
        {title}
      </Text>
      <Box marginTop={1}>
        <SelectInput items={options} onSelect={(item) => onSelect(item.value)} />
      </Box>
    </Box>
  );
};
