import React from "react";
import Rule from "./Rule";
import { Flex } from "rebass";
import GetRules from "./GetRules.gql";
import { useQuery } from "react-apollo-hooks";

export default function ConfigureRules() {
  const { data } = useQuery(GetRules);
  console.log("Rules ", data);
  return (
    <Flex p={3} flexDirection="column">
      Configure rules
      <Rule />
    </Flex>
  );
}
