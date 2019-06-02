import React from "react";
import Rule from "./Rule";
import { Flex } from "rebass";
import GetRules from "./GetRules.gql";
import { useQuery } from "urql";

export default function ConfigureRules() {
  const [res] = useQuery({
    query: GetRules
  });
  console.log("Rules ", res);
  return (
    <Flex p={3} flexDirection="column">
      Configure rules
      <Rule />
    </Flex>
  );
}
