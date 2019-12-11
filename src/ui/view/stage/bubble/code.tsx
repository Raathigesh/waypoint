import React, { useContext, useRef, useLayoutEffect } from "react";
import { Flex } from "@chakra-ui/core";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow";
import { dependencyGraphStore, connectionStore } from "ui/store";
import { observer } from "mobx-react-lite";
import { Instance } from "mobx-state-tree";
import { DocumentSymbol } from "ui/store/models/DocumentSymbol";

const getHeightFromCode = (code: string) => code.split("\n").length * 15 + 15;

interface Props {
  symbol: Instance<typeof DocumentSymbol>;
}

function Code({ symbol }: Props) {
  const dependencyGraph = useContext(dependencyGraphStore);
  const ref: any = useRef(null);
  const connections = useContext(connectionStore);

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
  });

  return (
    <Flex marginRight="55px" marginBottom="25px" ref={ref} zIndex={1}>
      <AceEditor
        readOnly
        mode="javascript"
        highlightActiveLine={false}
        showGutter={false}
        style={{ borderRadius: "5px" }}
        theme="tomorrow"
        onChange={() => {}}
        value={(symbol && symbol?.code) || ""}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        height={`${getHeightFromCode((symbol && symbol?.code) || "")}px`}
        markers={symbol?.markers.map(marker => ({
          startRow: marker.location?.start.line || 0,
          startCol: marker.location?.start.column || 0,
          endRow: marker.location?.end.line || 0,
          endCol: marker.location?.end.column || 0,
          className: "error-marker",
          type: "background"
        }))}
        onCursorChange={(selection, e) =>
          dependencyGraph.addBubble(
            symbol.id,
            selection.cursor.row,
            selection.cursor.column
          )
        }
      />
    </Flex>
  );
}

export default observer(Code);
