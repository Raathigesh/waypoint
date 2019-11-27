import React from "react";
import { Flex } from "@chakra-ui/core";
import { Instance } from "mobx-state-tree";
import { DocumentSymbol } from "ui/store/models/DocumentSymbol";
import { observer } from "mobx-react-lite";
import { constructTree } from "./util";
import { ChevronRight } from "react-feather";

interface Props {
  references: Instance<typeof DocumentSymbol>[];
}

function TreeNode({ item }: any): any {
  return (
    <Flex flexDirection="column" marginLeft="15px">
      <Flex alignItems="center">
        {item.type === "directory" && <ChevronRight size={12} />}
        {item.label}
      </Flex>
      {(item.children || []).map((child: any) => (
        <TreeNode item={child} />
      ))}
    </Flex>
  );
}

function UsageTree({ references }: Props) {
  const tree = constructTree(references);

  return (
    <Flex flexDirection="column" overflow="auto" height="calc(100vh - 75px)">
      <TreeNode item={tree} />
    </Flex>
  );
}

export default observer(UsageTree);
