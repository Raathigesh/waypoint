import React, { useContext } from "react";
import { Flex } from "@chakra-ui/core";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow";
import { observer } from "mobx-react-lite";
import { dependencyGraphStore } from "ui/store";
import { Instance, IMapType } from "mobx-state-tree";
import { DocumentSymbol } from "ui/store/models/DocumentSymbol";

const getHeightFromCode = (code: string) => code.split("\n").length * 15 + 15;

function Bubble() {
  const dependencyGraph = useContext(dependencyGraphStore);
  const currentSymbol = dependencyGraph.currentSymbol;
  console.log();
  if (!currentSymbol) {
    return null;
  }

  return (
    <Flex marginTop="15px">
      {currentSymbol && (
        <AceEditor
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
            dependencyGraph.addBubble(
              currentSymbol.id,
              selection.cursor.row,
              selection.cursor.column
            )
          }
        />
      )}

      {dependencyGraph.getGraphColumns()?.map(bubbles => (
        <Flex flexDirection="column">
          {bubbles.map(sym => (
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
                dependencyGraph.addBubble(
                  sym.id,
                  selection.cursor.row,
                  selection.cursor.column
                )
              }
            />
          ))}
        </Flex>
      ))}
    </Flex>
  );
}

export default observer(Bubble);
