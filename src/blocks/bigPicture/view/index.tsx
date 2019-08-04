import React, { useEffect, useState } from "react";
import { Flex } from "rebass";
import { ArcherContainer, ArcherElement } from "react-archer";
import Node from "./Node";
import { useSubscription } from "urql";
import SubscribeForActiveSymbol from "./gql/SubscribeForActiveSymbol.gql";

export default function ActiveSymbol() {
  const [{ data }] = useSubscription({
    query: SubscribeForActiveSymbol
  });

  return (
    <ArcherContainer strokeColor="red">
      {data && data.activeSymbol.name}
      <Flex>
        <Flex flexDirection="column" mr={5}>
          <Node
            id="root"
            label="Hello"
            targetIds={["node1", "node2", "node3"]}
          />
        </Flex>
        <Flex flexDirection="column">
          <Node id="node1" label="Hello" />
          <Node id="node2" label="Hello" />
          <Node id="node3" label="Hello" />
        </Flex>
      </Flex>
    </ArcherContainer>
  );
}
