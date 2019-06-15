import React from "react";
import { Flex } from "rebass";

interface Props {
  options: {
    Icon: any;
    onClick: () => void;
  }[];
}

export default function BlockOptions({ options }: Props) {
  return (
    <Flex>
      {options.map(({ Icon, onClick }) => (
        <Flex onClick={onClick}>
          <Icon size={12} />
        </Flex>
      ))}
    </Flex>
  );
}
