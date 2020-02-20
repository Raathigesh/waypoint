import React, { useContext, useState, Fragment } from "react";
import { dependencyGraphStore, appStore } from "ui/store";

import { observer } from "mobx-react-lite";
import { Instance } from "mobx-state-tree";
import { DocumentSymbol } from "ui/store/models/DocumentSymbol";
import Frame from "./Frame";
import Symbol from "./symbol";
import { getCharWidth } from "ui/util/view";
import { Flex, Box, Link, Button } from "@chakra-ui/core";
import { List, File } from "react-feather";
import ReferenceDialog from "ui/view/references";
import { openFile } from "ui/store/services/file";
import { ArcherElement } from "react-archer";

const getMaxLineLength = (code: string) =>
  Math.max(...code.split("\n").map(line => line.length));

interface Props {
  symbol: Instance<typeof DocumentSymbol>;
}

function Code({ symbol }: Props) {
  const projectInfo = useContext(appStore);
  const charWidth = getCharWidth(projectInfo.fontSize, projectInfo.fontFamily);
  const dependencyGraph = useContext(dependencyGraphStore);
  const width =
    (charWidth + 2) * getMaxLineLength((symbol && symbol?.code) || "");
  const height = (symbol.code || "").split("\n").length * 20;

  const [isReferenceOpen, setIsReferenceOpen] = useState(false);

  return (
    <Frame
      title={
        <Flex
          alignItems="center"
          onClick={(e: any) => {
            e.stopPropagation();
          }}
        >
          {symbol.name}
          <Box fontSize="10px" marginLeft="10px">
            {symbol.filePath.replace(projectInfo.root, "")}
          </Box>
        </Flex>
      }
      x={symbol.x || 0}
      y={symbol.y || 0}
      headerColor={symbol.color || "rgba(0, 0, 0, 0.028)"}
      onEnd={() => {
        dependencyGraph.setIsBubbleDragging(false);
      }}
      onStart={() => dependencyGraph.setIsBubbleDragging(true)}
      onRemove={() => {
        dependencyGraph.removeNode(symbol.id);
      }}
      onUpdate={() => dependencyGraph.refreshArrows()}
      setPosition={symbol.setPosition}
      setRef={symbol.setRef}
      width={width + 10}
      height={Math.min(900, height + 50)}
      headerAction={
        <Fragment>
          <Button
            size="xs"
            variant="outline"
            marginLeft="3px"
            padding="3px"
            onClick={e => {
              e.stopPropagation();
              setIsReferenceOpen(true);
              symbol.fetchReferences();
            }}
          >
            <List cursor="pointer" size="12px" />
          </Button>
          <Button
            size="xs"
            variant="outline"
            marginLeft="3px"
            padding="3px"
            onClick={e => {
              e.stopPropagation();
              openFile(symbol.filePath, symbol.location as any);
            }}
          >
            <File cursor="pointer" size="12px" />
          </Button>
        </Fragment>
      }
    >
      <ArcherElement
        id={symbol.id}
        relations={symbol.connections.map(con => ({
          targetId: con,
          targetAnchor: "top",
          sourceAnchor: "bottom",
          time: Date.now()
        }))}
      >
        <Symbol symbol={symbol} />
      </ArcherElement>
      {isReferenceOpen && (
        <ReferenceDialog
          symbol={symbol}
          onClose={() => setIsReferenceOpen(false)}
        />
      )}
    </Frame>
  );
}

export default observer(Code);
