import React, { useContext, useRef, useLayoutEffect, useState } from "react";
import { Flex, IconButton } from "@chakra-ui/core";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow";
import { dependencyGraphStore, connectionStore } from "ui/store";
import { observer } from "mobx-react-lite";
import { Instance } from "mobx-state-tree";
import { DocumentSymbol } from "ui/store/models/DocumentSymbol";
import { css, Global } from "@emotion/core";
import { X } from "react-feather";

const getHeightFromCode = (code: string) => code.split("\n").length * 15 + 15;

interface Props {
  symbol: Instance<typeof DocumentSymbol>;
}

function Code({ symbol }: Props) {
  const dependencyGraph = useContext(dependencyGraphStore);
  const ref: any = useRef(null);
  const connections = useContext(connectionStore);

  const [isMouseOver, setIsMouseOver] = useState(false);

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    connections.addPosition(
      symbol.id,
      rect.width,
      rect.height,
      rect.top,
      rect.right,
      rect.bottom,
      rect.left
    );
  }, []);

  const markers = symbol?.markers.map(marker => ({
    startRow: marker.location?.start.line || 0,
    startCol: marker.location?.start.column || 0,
    endRow: marker.location?.end.line || 0,
    endCol: marker.location?.end.column || 0,
    className: `marker-${marker.location?.start.line || 0}-${marker.location
      ?.start.column || 0}-${marker.location?.end.line || 0}-${marker.location
      ?.end.column || 0}`,
    type: "background"
  }));

  const cssString = markers.reduce((str, marker) => {
    return `${str}

    .${marker.className} {
      background-color: wheat;
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
    <Flex
      position="relative"
      marginRight="55px"
      marginBottom="25px"
      ref={ref}
      zIndex={1}
      padding="10px"
      backgroundColor="white"
      borderRadius="5px"
      boxShadow="box-shadow:
      0 0px 1.5px rgba(0, 0, 0, 0.028),
      0 0px 5.1px rgba(0, 0, 0, 0.042),
      0 0px 23px rgba(0, 0, 0, 0.07)
    "
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
    >
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
        width="450px"
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

          console.log(clickedMaker, markerElement);
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
  );
}

export default observer(Code);