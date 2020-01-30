import React, { useContext, useRef, Fragment } from "react";
import { Flex, Link, Text, Tooltip } from "@chakra-ui/core";
import { editor } from "monaco-editor";
import MonacoEditor from "react-monaco-editor";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import "monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution";
import { dependencyGraphStore, appStore } from "ui/store";
import { observer } from "mobx-react-lite";
import { Instance } from "mobx-state-tree";
import { DocumentSymbol } from "ui/store/models/DocumentSymbol";
import { css, Global } from "@emotion/core";
import LazyTheme from "monaco-themes/themes/LAZY.json";
import { openFile } from "ui/store/services/file";
import { getCharWidth } from "ui/util/view";

const getMaxLineLength = (code: string) =>
  Math.max(...code.split("\n").map(line => line.length));

interface Props {
  symbol: Instance<typeof DocumentSymbol>;
}

function Symbol({ symbol }: Props) {
  const dependencyGraph = useContext(dependencyGraphStore);
  const projectInfo = useContext(appStore);
  const charWidth = getCharWidth(projectInfo.fontSize, projectInfo.fontFamily);
  const editorRef: any = useRef(null);

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
      border: 1px solid ${marker.color || "#eaeaea"};
      border-radius: 2px;
      cursor: pointer;
    }

    .${marker.className}:hover {
      background-color: #c2c2c2;
    }
    `;
  }, "");

  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme("lazy", LazyTheme);
    monaco.editor.setTheme("lazy");
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
        inlineClassName: `marker-${symbol.id}-${marker.location?.start.line ||
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

  const width =
    (charWidth + 2) * getMaxLineLength((symbol && symbol?.code) || "");
  const height = (symbol.code || "").split("\n").length * 20;

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
        <Global
          styles={css`
            ${cssString}
          `}
        />
        <MonacoEditor
          ref={editorRef}
          width={width}
          height={height}
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
      <Flex>
        <Link
          fontSize={11}
          whiteSpace="nowrap"
          padding="3px"
          onClick={() => {
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
  );
}

export default observer(Symbol);