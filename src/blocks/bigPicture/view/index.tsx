import React, { useEffect, useState } from "react";
import BlockFrame from "common/components/BlockFrame/BlockFrame";
import { Flex } from "rebass";
import { ArcherContainer, ArcherElement } from "react-archer";
import Node from "./Node";

export default function Search() {
  return (
    <BlockFrame options={[]}>
      <ArcherContainer strokeColor="red">
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
    </BlockFrame>
  );
}
