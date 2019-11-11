import React from "react";
import dagre from "dagre";
import Connections from "../connections/index";
import { Flex, Box } from "@chakra-ui/core";
import Node from "./node";
import { DocumentSymbol } from "../../store/models/DocumentSymbol";
import { Instance } from "mobx-state-tree";
import File from "./node/file";
import { observer } from "mobx-react-lite";

interface Props {
  documentSymbol: Instance<typeof DocumentSymbol> | null;
  references: Instance<typeof DocumentSymbol>[];
}

function Graph({ documentSymbol, references }: Props) {
  if (!documentSymbol) {
    return null;
  }

  const filePathNodes = new Set();

  const g = new dagre.graphlib.Graph({ compound: true });

  g.setGraph({
    rankdir: "LR",
    edgesep: 25,
    nodesep: 10
  });
  console.log(g);
  g.setDefaultEdgeLabel(function() {
    return {};
  });

  const NodeHeight = 40;
  const NodeWidth = 200;

  g.setNode(documentSymbol.id, {
    label: documentSymbol.name,
    width: NodeWidth,
    height: NodeHeight
  });
  g.setNode(documentSymbol.filePath, {
    width: 0,
    height: 0,
    type: "file",
    label: documentSymbol.filePath
  });
  g.setParent(documentSymbol.id, documentSymbol.filePath);
  filePathNodes.add(documentSymbol.filePath);

  references.forEach(reference => {
    g.setNode(reference.id, {
      label: reference.name,
      width: NodeWidth,
      height: NodeHeight,
      path: reference.filePath,
      location: reference.location
    });
    g.setEdge(reference.id, documentSymbol.id);

    if (!filePathNodes.has(reference.filePath)) {
      g.setNode(reference.filePath, {
        width: 0,
        height: 0,
        type: "file",
        label: reference.filePath
      });
    }
    g.setParent(reference.id, reference.filePath);
  });

  dagre.layout(g);

  return (
    <Flex flexGrow={1} pt="4" overflow="auto" position="relative">
      <Connections
        connections={g
          .edges()
          .map((edge: any) => ({ points: g.edge(edge).points, label: "" }))}
        size={g.graph()}
      />
      <Box position="relative" zIndex={2}>
        {g
          .nodes()
          .filter((node: any) => g.node(node))
          .filter((node: any) => g.node(node).type !== "file")
          .map((node: any) => g.node(node))
          .map((node: any) => (
            <Node
              height={node.height}
              width={node.width}
              x={node.x}
              y={node.y}
              name={node.label}
              path={node.path}
              location={node.location}
            />
          ))}
        {g
          .nodes()
          .filter((node: any) => g.node(node))
          .filter((node: any) => g.node(node).type === "file")
          .map((node: any) => g.node(node))
          .map((node: any) => (
            <File
              height={node.height}
              width={node.width}
              x={node.x}
              y={node.y}
              name={node.label}
            />
          ))}
      </Box>
    </Flex>
  );
}

export default observer(Graph);
