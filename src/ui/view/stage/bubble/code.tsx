import React, { useContext, useRef, useLayoutEffect, useState } from "react";
import { Flex, IconButton, Link, Text, Tooltip } from "@chakra-ui/core";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow";
import { dependencyGraphStore, connectionStore, appStore } from "ui/store";
import { observer } from "mobx-react-lite";
import { Instance } from "mobx-state-tree";
import { Rnd } from "react-rnd";
import { DocumentSymbol } from "ui/store/models/DocumentSymbol";
import { css, Global } from "@emotion/core";
import { X } from "react-feather";
import { openFile } from "ui/EventBus";

const getMaxLineLength = (code: string) =>
  Math.max(...code.split("\n").map(line => line.length));

interface Props {
  symbol: Instance<typeof DocumentSymbol>;
  charWidth: number;
}

function Code({ symbol, charWidth }: Props) {
  const dependencyGraph = useContext(dependencyGraphStore);
  const projectInfo = useContext(appStore);
  const ref: any = useRef(null);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const markers = symbol?.markers.map(marker => ({
    startRow: marker.location?.start.line || 0,
    startCol: marker.location?.start.column || 0,
    endRow: marker.location?.end.line || 0,
    endCol: marker.location?.end.column || 0,
    className: `marker-${symbol.id}-${marker.location?.start.line || 0}-${marker
      .location?.start.column || 0}-${marker.location?.end.line || 0}-${marker
      .location?.end.column || 0}`,
    type: "background",
    color: marker.color
  }));

  const cssString = markers.reduce((str, marker) => {
    return `${str}

    .${marker.className} {
      background-color: ${marker.color};
      pointer-events: all;
      position: absolute;
      cursor: pointer;
    }

    .${marker.className}:hover {
      background-color: #c2c2c2;
    }
    `;
  }, "");

  return (
    <Rnd
      default={
        {
          x: 0,
          y: 0
        } as any
      }
      dragGrid={[5, 5]}
    >
      <Flex
        position="relative"
        marginRight="55px"
        marginBottom="25px"
        ref={ref}
        zIndex={1}
        padding="10px"
        backgroundColor="white"
        flexDirection="column"
        borderRadius="5px"
        border={`1px solid ${symbol.color}`}
        boxShadow="box-shadow:
      0 0px 1.5px rgba(0, 0, 0, 0.028),
      0 0px 5.1px rgba(0, 0, 0, 0.042),
      0 0px 23px rgba(0, 0, 0, 0.07)
    "
        onMouseEnter={() => setIsMouseOver(true)}
        onMouseLeave={() => setIsMouseOver(false)}
      >
        <Flex flexDirection="column">
          <Global
            styles={css`
              ${cssString}
            `}
          />
          <AceEditor
            readOnly
            mode="javascript"
            highlightActiveLine={false}
            showGutter={false}
            style={{ padding: "5px" }}
            theme="tomorrow"
            width={`${(charWidth + 2) *
              getMaxLineLength((symbol && symbol?.code) || "")}px`}
            onChange={() => {}}
            value={(symbol && symbol?.code) || ""}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            maxLines={Infinity}
            markers={markers}
            onCursorChange={(selection, e) => {
              const row = selection.cursor.row;
              const column = selection.cursor.column;
              const clickedMaker = markers.find(
                marker =>
                  marker.startRow >= row &&
                  marker.endRow <= row &&
                  marker.startCol <= column &&
                  marker.endCol >= column
              );

              const markerElement = document.getElementsByClassName(
                clickedMaker?.className || ""
              );

              if (markerElement[0]) {
                dependencyGraph.addBubble(
                  symbol.id,
                  row,
                  column,
                  markerElement[0].getBoundingClientRect().top
                );
              }
            }}
          />
          {isMouseOver && (
            <Flex position="absolute" right="10px" cursor="pointer">
              <X
                size="10px"
                onClick={() => dependencyGraph.removeNode(symbol.id)}
              />
            </Flex>
          )}
        </Flex>
        <Flex>
          <Link
            fontSize={11}
            whiteSpace="nowrap"
            onClick={() => {
              console.log(symbol);
              openFile(symbol.filePath, symbol.location as any);
            }}
          >
            <Text
              isTruncated
              style={{ direction: "rtl" }}
              width={`${(charWidth + 2) *
                getMaxLineLength((symbol && symbol?.code) || "")}px`}
            >
              <Tooltip
                aria-label="file path"
                fontSize={11}
                label={symbol.filePath.replace(projectInfo.root, "")}
              >
                {symbol.filePath.replace(projectInfo.root, "")}
              </Tooltip>
            </Text>
          </Link>
        </Flex>
      </Flex>
    </Rnd>
  );
}

export default observer(Code);
