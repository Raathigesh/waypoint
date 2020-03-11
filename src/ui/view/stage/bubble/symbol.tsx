import React, { useContext, useRef, Fragment, useState } from "react";
import { Flex, Link, Text, Tooltip, Button } from "@chakra-ui/core";
import { editor } from "monaco-editor";
import MonacoEditor from "react-monaco-editor";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import "monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution";
import "monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching";
import "monaco-editor/esm/vs/editor/contrib/folding/folding";
import "monaco-editor/esm/vs/editor/contrib/wordHighlighter/wordHighlighter";
import { dependencyGraphStore, appStore } from "ui/store";
import { observer } from "mobx-react-lite";
import { Instance } from "mobx-state-tree";
import { DocumentSymbol } from "ui/store/models/DocumentSymbol";
import { css, Global } from "@emotion/core";
import DawnTheme from "monaco-themes/themes/Tomorrow.json";
import { openFile } from "ui/store/services/file";
import { getCharWidth, getDimensions } from "ui/util/view";

const getMaxLineLength = (code: string) =>
  Math.max(...code.split("\n").map(line => line.length));

interface Props {
  symbol: Instance<typeof DocumentSymbol>;
}

function Symbol({ symbol }: Props) {
  const dependencyGraph = useContext(dependencyGraphStore);
  const projectInfo = useContext(appStore);
  const editorRef: any = useRef(null);

  const markers = symbol?.markers.map(marker => ({
    startRow: marker.location?.start.line || 0,
    startCol: marker.location?.start.column || 0,
    endRow: marker.location?.end.line || 0,
    endCol: marker.location?.end.column || 0,
    className: `marker-${symbol.name}-${marker.location?.start.line ||
      0}-${marker.location?.start.column || 0}-${marker.location?.end.line ||
      0}-${marker.location?.end.column || 0}`,
    type: "background",
    color: marker.color
  }));

  const cssString = markers.reduce((str, marker) => {
    return `${str}

    .${marker.className} {
      background-color: ${
        marker.color ? "transparent" : "rgb(234,234,234, 0.6)"
      };
      border: 1.5px solid ${marker.color || "rgb(234,234,234, 0.3)"};
      border-radius: 3px;
      cursor: pointer;
    }

    .${marker.className}:hover {
      background-color: rgb(194,194,194, 0.3);
    }
    `;
  }, "");

  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme("dawn", DawnTheme);
    monaco.editor.setTheme("dawn");
  };

  const handleEditorDidMount = (editor: editor.ICodeEditor, monaco: any) => {
    const decorators = symbol?.markers.map(marker => ({
      range: new monaco.Range(
        (marker.location?.start.line || 0) + 1,
        (marker.location?.start.column || 0) + 1,
        (marker.location?.end.line || 0) + 1,
        (marker.location?.end.column || 0) + 1
      ),
      options: {
        inlineClassName: `marker-${symbol.name}-${marker.location?.start.line ||
          0}-${marker.location?.start.column || 0}-${marker.location?.end
          .line || 0}-${marker.location?.end.column || 0}`
      }
    }));

    editor.deltaDecorations([], decorators);

    editor.onMouseDown((e: any) => {
      const row = e.target.range.startLineNumber - 1;
      const column = e.target.range.startColumn - 1;

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
          symbol,
          row,
          column,
          markerElement[0].getBoundingClientRect().x,
          markerElement[0].getBoundingClientRect().y
        );
      }
    });
  };

  const dimensions = getDimensions(
    projectInfo.fontSize,
    projectInfo.fontFamily,
    symbol.code || "",
    symbol.width,
    symbol.height
  );

  return (
    <Flex flexDirection="column" flexGrow={1} justifyContent="space-between">
      <Flex flexDirection="column">
        <Global
          styles={css`
            ${cssString}
          `}
        />
        <MonacoEditor
          ref={editorRef}
          width={dimensions.width}
          height={dimensions.height - 50}
          language="javascript"
          editorWillMount={handleEditorWillMount}
          editorDidMount={handleEditorDidMount}
          value={symbol.code}
          options={{
            readOnly: true,
            lineNumbers: "off",
            fontFamily: projectInfo.fontFamily,
            fontSize: projectInfo.fontSize,
            minimap: {
              enabled: false
            }
          }}
        />
      </Flex>
    </Flex>
  );
}

export default observer(Symbol);
