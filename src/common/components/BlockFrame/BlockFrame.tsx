import React from "react";
import { Card, Flex } from "rebass";
import BlockOptions from "./BlockOptions";

interface Props {
  children: any;
  options: {
    Icon: any;
    tooltip: string;
    onClick: () => void;
  }[];
}

export default function BlockFrame({ children, options }: Props) {
  return (
    <Card m="4" borderRadius="2px">
      <BlockOptions options={options} />
      <Flex>{children}</Flex>
    </Card>
  );
}
