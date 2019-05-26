import React from "react";
import Rule from "./Rule";
import { Flex } from "rebass";

export default function ConfigureRules() {
  return (
    <Flex p={3} flexDirection="column">
      Configure rules
      <Rule />
    </Flex>
  );
}
