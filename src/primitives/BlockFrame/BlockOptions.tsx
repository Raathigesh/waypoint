import React from "react";
import { Flex } from "rebass";
import { Tooltip } from "react-tippy";

interface Props {
  options: {
    Icon: any;
    tooltip: string;
    onClick: () => void;
  }[];
}

export default function BlockOptions({ options }: Props) {
  return (
    <Flex>
      {options.map(({ Icon, tooltip, onClick }) => (
        <Tooltip title={tooltip} size="small" animate="fade">
          <Flex
            onClick={onClick}
            padding={1}
            css={{
              cursor: "pointer"
            }}
          >
            <Icon size={12} />
          </Flex>
        </Tooltip>
      ))}
    </Flex>
  );
}
