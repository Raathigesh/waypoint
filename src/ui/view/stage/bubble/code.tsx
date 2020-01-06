import React, { useContext, useRef, useState, useEffect } from "react";
import { Flex, Link, Text, Tooltip, Icon } from "@chakra-ui/core";
import { editor } from "monaco-editor";
import MonacoEditor from "react-monaco-editor";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import "monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution";
import { dependencyGraphStore, appStore } from "ui/store";
import { observer } from "mobx-react-lite";
import { Instance } from "mobx-state-tree";
import { Rnd } from "react-rnd";
import { DocumentSymbol } from "ui/store/models/DocumentSymbol";
import { css, Global } from "@emotion/core";
import { X } from "react-feather";
import { openFile } from "ui/store/services/file";
import LazyTheme from "monaco-themes/themes/LAZY.json";
import Draggable from "./Dragabble";

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
  const editorRef: any = useRef(null);
  const handle: any = useRef(null);

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
      background-color: ${marker.color || "#eaeaea"};
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
        console.log(
          "Marker loc",
          markerElement[0].getBoundingClientRect().x,
          markerElement[0].getBoundingClientRect().y
        );
        console.log(e.event.posx, e.event.posy);
        dependencyGraph.addBubble(
          symbol.id,
          row,
          column,
          markerElement[0].getBoundingClientRect().x,
          markerElement[0].getBoundingClientRect().y
        );
      }
    });
  };

  return (
    <Draggable
      x={symbol.x || 0}
      y={symbol.y || 0}
      handle={handle}
      id={symbol.id}
      onStart={() => dependencyGraph.setIsBubbleDragging(true)}
      onEnd={(x: number, y: number) => {
        dependencyGraph.setIsBubbleDragging(false);
      }}
    >
      <Flex
        position="relative"
        marginRight="55px"
        marginBottom="25px"
        ref={ref}
        zIndex={3}
        backgroundColor="white"
        flexDirection="column"
        borderRadius="5px"
        border={`1px solid ${symbol.color}`}
        boxShadow="
      0 0px 1.5px rgba(0, 0, 0, 0.028),
      0 0px 5.1px rgba(0, 0, 0, 0.042),
      0 0px 23px rgba(0, 0, 0, 0.07)
    "
      >
        <Flex
          cursor="pointer"
          alignItems="center"
          backgroundColor="gray.100"
          justifyContent="flex-end"
          borderRadius="5px 0px 0px 0px"
        >
          <Flex
            ref={handle}
            cursor="move"
            className="handle"
            width="100%"
            height="15px"
          />
          <X
            size="15px"
            onClick={e => {
              dependencyGraph.removeNode(symbol.id);
              e.stopPropagation();
            }}
          />
        </Flex>
        <Flex flexDirection="column">
          <Global
            styles={css`
              ${cssString}
            `}
          />
          <MonacoEditor
            ref={editorRef}
            width={`${(charWidth + 2) *
              getMaxLineLength((symbol && symbol?.code) || "")}px`}
            height={(symbol.code || "").split("\n").length * 20}
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
    </Draggable>
  );
}

export default observer(Code);
