import React, { useContext, useState, Fragment } from "react";
import { dependencyGraphStore, appStore } from "ui/store";

import { observer } from "mobx-react-lite";
import { Instance } from "mobx-state-tree";
import { DocumentSymbol } from "ui/store/models/DocumentSymbol";
import Frame from "./Frame";
import Symbol from "./symbol";
import { getCharWidth, getDimensions } from "ui/util/view";
import { Flex, Box, Link, Button } from "@chakra-ui/core";
import { List, File } from "react-feather";
import ReferenceDialog from "ui/view/references";
import { openFile } from "ui/store/services/file";
import { ArcherElement, Relation, AnchorPosition } from "react-archer";
import { Tooltip } from "react-tippy";

const getAnchorSide = (
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  sourceHeight: number,
  targetHeight: number
): {
  targetAnchor: AnchorPosition;
  sourceAnchor: AnchorPosition;
} => {
  let targetAnchor: AnchorPosition = "middle";
  let sourceAnchor: AnchorPosition = "middle";

  const isTargetBelowSource = targetY > sourceY + sourceHeight;
  const isTargetAboveSource = targetY + targetHeight < sourceY;

  if (isTargetBelowSource) {
    sourceAnchor = "bottom";
    targetAnchor = "top";
  } else if (isTargetAboveSource) {
    sourceAnchor = "top";
    targetAnchor = "bottom";
  } else if (sourceX < targetX) {
    sourceAnchor = "right";
    targetAnchor = "left";
  } else if (sourceX > targetX) {
    sourceAnchor = "left";
    targetAnchor = "right";
  }
  return {
    targetAnchor,
    sourceAnchor
  };
};

interface Props {
  symbol: Instance<typeof DocumentSymbol>;
}

function Code({ symbol }: Props) {
  const projectInfo = useContext(appStore);
  const dependencyGraph = useContext(dependencyGraphStore);
  const dimensions = getDimensions(
    projectInfo.fontSize,
    projectInfo.fontFamily,
    symbol.code || "",
    symbol.width,
    symbol.height
  );

  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const relativePath = symbol.filePath.replace(projectInfo.root, "");
  const trimmedPath = relativePath.startsWith(projectInfo.separator)
    ? relativePath.substr(1)
    : relativePath;

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
          <Box
            fontSize="10px"
            marginLeft="10px"
            overflow="hidden"
            style={{ textOverflow: "ellipsis" }}
          >
            {trimmedPath.split(projectInfo.separator).join(" > ")}
          </Box>
        </Flex>
      }
      x={symbol.x || 0}
      y={symbol.y || 0}
      onResize={(resizedHeight, resizedWidth) =>
        symbol.setDimensions(resizedHeight, resizedWidth)
      }
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
      width={dimensions.width}
      height={dimensions.height}
      headerAction={
        <Fragment>
          <Button
            size="xs"
            variant="ghost"
            marginLeft="3px"
            padding="3px"
            onClick={e => {
              e.stopPropagation();
              setIsReferenceOpen(true);
              symbol.fetchReferences();
            }}
          >
            <Tooltip size="small" title="Show references" position="bottom">
              <List cursor="pointer" size="12px" />
            </Tooltip>
          </Button>
          <Button
            size="xs"
            variant="ghost"
            marginLeft="3px"
            padding="3px"
            onClick={e => {
              e.stopPropagation();
              openFile(symbol.filePath, symbol.location as any);
            }}
          >
            <Tooltip size="small" title="Open file" position="bottom">
              <File cursor="pointer" size="12px" />
            </Tooltip>
          </Button>
        </Fragment>
      }
    >
      <ArcherElement
        id={symbol.id}
        relations={symbol.connections.map(con => {
          const targetSymbol = dependencyGraph.symbols.get(con);

          const targetDimension = getDimensions(
            projectInfo.fontSize,
            projectInfo.fontFamily,
            (targetSymbol && targetSymbol.code) || "",
            (targetSymbol && targetSymbol.width) || 0,
            (targetSymbol && targetSymbol.height) || 0
          );
          const anchor = getAnchorSide(
            symbol.x || 0,
            symbol.y || 0,
            (targetSymbol && targetSymbol.x) || 0,
            (targetSymbol && targetSymbol.y) || 0,
            dimensions.height || 0,
            targetDimension.height || 0
          );

          return {
            targetId: con,
            targetAnchor: anchor.targetAnchor,
            sourceAnchor: anchor.sourceAnchor,
            style: {
              strokeColor: targetSymbol?.color,
              strokeWidth: 1
            }
          };
        })}
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
