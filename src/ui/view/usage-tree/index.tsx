import React, { useContext, useState } from "react";
import { Flex, Link } from "@chakra-ui/core";
import { Instance } from "mobx-state-tree";
import { DocumentSymbol } from "ui/store/models/DocumentSymbol";
import { observer } from "mobx-react-lite";
import { constructTree } from "./util";
import { ChevronRight, ChevronDown, Folder, File, Circle } from "react-feather";
import { openFile } from "ui/EventBus";
import { appStore } from "ui/store";

interface Props {
  references: Instance<typeof DocumentSymbol>[];
}

function TreeNode({ item, collapsedNodes, onExpand, onCollapse }: any): any {
  const isCollapsed = collapsedNodes[item.id];
  return (
    <Flex flexDirection="column" marginLeft="15px">
      <Flex flexDirection="column">
        <Flex
          alignItems="center"
          cursor="pointer"
          marginLeft={item.type === "file" ? "10px" : "0px"}
          onClick={() => {
            if (item.type === "directory") {
              if (isCollapsed) {
                onExpand(item.id);
              } else {
                onCollapse(item.id);
              }
            }
          }}
        >
          {item.type === "directory" && !isCollapsed && (
            <ChevronDown size={12} />
          )}
          {item.type === "directory" && isCollapsed && (
            <ChevronRight size={12} />
          )}
          {item.type === "directory" && <Folder size={12} />}
          {item.type === "file" && <File size={12} />}
          <Flex marginLeft="5px" fontSize={13}>
            {item.label}
          </Flex>
        </Flex>
        {!isCollapsed && (item.symbols || []).length !== 0 && (
          <Flex flexDirection="column" marginLeft="30px" marginBottom="5px">
            {(item.symbols || []).map((symbol: any) => (
              <Flex fontSize={13} fontWeight={600} alignItems="center">
                <Circle size={10} />
                <Flex marginLeft="5px">
                  <Link
                    onClick={() =>
                      openFile(
                        symbol.filePath,
                        (symbol.location as any).toJSON()
                      )
                    }
                  >
                    {symbol.name}
                  </Link>
                </Flex>
              </Flex>
            ))}
          </Flex>
        )}
      </Flex>
      {!isCollapsed &&
        (item.children || []).map((child: any) => (
          <TreeNode
            item={child}
            collapsedNodes={collapsedNodes}
            onExpand={onExpand}
            onCollapse={onCollapse}
          />
        ))}
    </Flex>
  );
}

function UsageTree({ references }: Props) {
  const app = useContext(appStore);
  const tree = constructTree(references, app.separator);
  const [collapsedNodes, setCollapsedNodes] = useState({});

  const onExpand = (filePath: string) => {
    setCollapsedNodes({
      ...collapsedNodes,
      [filePath]: false
    });
  };

  const onCollapse = (filePath: string) => {
    setCollapsedNodes({
      ...collapsedNodes,
      [filePath]: true
    });
  };

  return (
    <Flex flexDirection="column" overflow="auto" height="calc(100vh - 75px)">
      <TreeNode
        item={tree}
        collapsedNodes={collapsedNodes}
        onExpand={onExpand}
        onCollapse={onCollapse}
      />
    </Flex>
  );
}

export default observer(UsageTree);
