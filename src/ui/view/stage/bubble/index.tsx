import React, { useContext } from "react";
import { Flex } from "@chakra-ui/core";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow";
import { observer } from "mobx-react-lite";
import { dependencyGraphStore } from "ui/store";

const getHeightFromCode = (code: string) => code.split("\n").length * 15 + 15;

function Bubble() {
  const dependencyGraph = useContext(dependencyGraphStore);
  const currentSymbol = dependencyGraph.currentSymbol;

  const editors: any = [];

  {
    dependencyGraph.otherSymbols.forEach(sym =>
      editors.push(
        <AceEditor
          readOnly
          mode="javascript"
          highlightActiveLine={false}
          showGutter={false}
          theme="tomorrow"
          style={{
            marginBottom: "10px",
            marginLeft: "20px",
            borderRadius: "5px"
          }}
          onChange={() => {}}
          value={(sym && sym?.code) || ""}
          height={`${getHeightFromCode((sym && sym.code) || "")}px`}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
          markers={sym?.markers.map(marker => ({
            startRow: marker.location?.start.line || 0,
            startCol: marker.location?.start.column || 0,
            endRow: marker.location?.end.line || 0,
            endCol: marker.location?.end.column || 0,
            className: "error-marker",
            type: "background"
          }))}
          onCursorChange={(selection, e) =>
            dependencyGraph.getMethod(
              selection.cursor.row,
              selection.cursor.column
            )
          }
        />
      )
    );
  }

  return (
    <Flex marginTop="15px">
      {currentSymbol && (
        <AceEditor
          wrapEnabled
          readOnly
          mode="javascript"
          highlightActiveLine={false}
          showGutter={false}
          style={{ borderRadius: "5px" }}
          theme="tomorrow"
          onChange={() => {}}
          value={(currentSymbol && currentSymbol?.code) || ""}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
          height={`${getHeightFromCode(
            (currentSymbol && currentSymbol?.code) || ""
          )}px`}
          markers={currentSymbol?.markers.map(marker => ({
            startRow: marker.location?.start.line || 0,
            startCol: marker.location?.start.column || 0,
            endRow: marker.location?.end.line || 0,
            endCol: marker.location?.end.column || 0,
            className: "error-marker",
            type: "background"
          }))}
          onCursorChange={(selection, e) =>
            dependencyGraph.getMethod(
              selection.cursor.row,
              selection.cursor.column
            )
          }
        />
      )}
      <Flex flexDirection="column">{editors}</Flex>
    </Flex>
  );
}

export default observer(Bubble);
