import React from "react";
import dagre from "dagre";
import Connections from "../connections/index";
import { Flex, Box } from "@chakra-ui/core";
import Node from "./node";
import { DocumentSymbol } from "../../store/models/DocumentSymbol";
import { Instance } from "mobx-state-tree";
import File from "./node/file";

interface Props {
  documentSymbol: Instance<typeof DocumentSymbol> | null;
  references: Instance<typeof DocumentSymbol>[];
}

export default function Graph({ documentSymbol, references }: Props) {
  if (!documentSymbol) {
    return null;
  }

  const filePathNodes = new Set();

  const g = new dagre.graphlib.Graph({ compound: true });
  g.setGraph({
    rankdir: "LR",
    edgesep: 30,
    nodesep: 70
  });
  g.setDefaultEdgeLabel(function() {
    return {};
  });

  g.setNode(documentSymbol.id, {
    label: documentSymbol.name,
    width: 200,
    height: 30
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
    g.setNode(reference.id, { label: reference.name, width: 200, height: 30 });
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

  console.log(g.nodes().map(node => g.node(node)));

  return (
    <Flex flexGrow={1} pt="4">
      <Connections
        connections={g
          .edges()
          .map(edge => ({ points: g.edge(edge).points, label: "" }))}
        size={g.graph()}
      />
      <Box position="relative" zIndex={2}>
        {g
          .nodes()
          .filter(node => g.node(node))
          .filter(node => g.node(node).type !== "file")
          .map(node => g.node(node))
          .map(node => (
            <Node
              height={node.height}
              width={node.width}
              x={node.x}
              y={node.y}
              name={node.label}
            />
          ))}
        {g
          .nodes()
          .filter(node => g.node(node))
          .filter(node => g.node(node).type === "file")
          .map(node => g.node(node))
          .map(node => (
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
