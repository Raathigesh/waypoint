import React from "react";
import { Card, Flex } from "rebass";
import BlockOptions from "./BlockOptions";

interface Props {
  children: any;
  options: {
    Icon: any;
    onClick: () => void;
  }[];
}

export default function BlockFrame({ children, options }: Props) {
  return (
    <Card m="4" borderRadius="2px">
      <Flex>{children}</Flex>
      <BlockOptions options={options} />
    </Card>
  );
}
