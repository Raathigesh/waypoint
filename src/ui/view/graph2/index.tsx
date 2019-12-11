import React, {
  Fragment,
  useRef,
  useEffect,
  useState,
  useContext,
  useLayoutEffect
} from "react";
import { Flex, Text, Grid } from "@chakra-ui/core";
import { observer } from "mobx-react-lite";
import { Instance } from "mobx-state-tree";

import { DocumentSymbol } from "ui/store/models/DocumentSymbol";
import Column from "./column";
import Connections from "./connections";
import { connectionStore } from "ui/store";

interface Props {
  documentSymbol: Instance<typeof DocumentSymbol> | null;
  references: Instance<typeof DocumentSymbol>[];
}

export interface File {
  path: string;
  symbols: Instance<typeof DocumentSymbol>[];
}

function calculateHeight(columns: File[]) {
  return columns.reduce((acc, c) => {
    return acc + c.symbols.length;
  }, 0);
}

function distribute(symbols: Instance<typeof DocumentSymbol>[]) {
  const symbolByFile = symbols.reduce((acc: any, symbol) => {
    if (!acc[symbol.filePath]) {
      acc[symbol.filePath] = [];
    }
    acc[symbol.filePath].push(symbol);
    return acc;
  }, {});

  const columns: Array<File[]> = [];
  let files: File[] = [];
  columns.push(files);

  Object.entries(symbolByFile).forEach(([path, symbols]: [string, any]) => {
    const reachLimit = calculateHeight(files) < 10;
    if (reachLimit) {
      files.push({
        path,
        symbols
      });
    } else {
      columns.push(files);
      files = [];
    }
  });

  return columns;
}

function Graph2({ documentSymbol, references }: Props) {
  const columns = distribute(references);
  const mainNode: any = useRef(null);
  const container: any = useRef(null);
  const connections = useContext(connectionStore);

  useLayoutEffect(() => {
    if (!mainNode.current) {
      return;
    }

    const rect = mainNode.current.getBoundingClientRect();
    // connections.addTarget(rect.x - 15, rect.y + rect.height / 2);

    if (!container.current) {
      return;
    }
    const containerRect = container.current.getBoundingClientRect();
    // connections.setRelative(containerRect.x, containerRect.y);
  });

  return (
    <Fragment>
      <Flex
        position="relative"
        overflow="auto"
        zIndex={5}
        ref={container}
        marginTop="20px"
        height="calc(100vh - 75px)"
      >
        <Grid
          gap={6}
          templateColumns="1fr 100px"
          zIndex={5}
          ref={container}
          position="relative"
          paddingRight="30%"
        >
          <Flex alignItems="flex-end" justifyContent="flex-end" zIndex={99}>
            {columns.map(column => {
              return (
                <Flex flexDirection="column" justifyContent="center">
                  <Column column={column} side="top" />
                </Flex>
              );
            })}
          </Flex>
          <Flex />
          <Flex />
          <Flex alignItems="flex-end" justifyContent="flex-end" zIndex={99}>
            {documentSymbol && (
              <Flex
                flexDirection="column"
                width="200px"
                marginRight="50px"
                marginBottom="10px"
                padding="5px"
                borderRadius="3px"
                color="gray.50"
                bg="blue.900"
                fontSize={12}
              >
                <Flex ref={mainNode}>{documentSymbol.name}</Flex>
              </Flex>
            )}
          </Flex>
          <Flex alignItems="flex-start" justifyContent="flex-end" zIndex={99}>
            {columns.map(column => {
              return (
                <Flex flexDirection="column" justifyContent="center">
                  <Column column={column} side="bottom" />
                </Flex>
              );
            })}
          </Flex>
          <Connections size={{ height: "100%", width: "100%" }} />
        </Grid>
      </Flex>
    </Fragment>
  );
}

export default observer(Graph2);
