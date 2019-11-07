import React from "react";
import dagre from "dagre";
import Connections from "../connections/index";
import { Flex, Box } from "@chakra-ui/core";
import Node from "./node";

export default function Graph() {
  const g = new dagre.graphlib.Graph();
  g.setGraph({});
  g.setDefaultEdgeLabel(function() {
    return {};
  });

  g.setNode("kspacey", { label: "Kevin Spacey", width: 144, height: 100 });
  g.setNode("swilliams", { label: "Saul Williams", width: 160, height: 100 });
  g.setNode("bpitt", { label: "Brad Pitt", width: 108, height: 100 });
  g.setNode("hford", { label: "Harrison Ford", width: 168, height: 100 });
  g.setNode("lwilson", { label: "Luke Wilson", width: 144, height: 100 });
  g.setNode("kbacon", { label: "Kevin Bacon", width: 121, height: 100 });

  g.setEdge("kspacey", "swilliams");
  g.setEdge("swilliams", "kbacon");
  g.setEdge("bpitt", "kbacon");
  g.setEdge("hford", "lwilson");
  g.setEdge("lwilson", "kbacon");

  const result = dagre.layout(g);

  console.log(g.nodes());

  return (
    <Flex flexGrow={1}>
      <Connections
        connections={g
          .edges()
          .map(edge => ({ points: g.edge(edge).points, label: "" }))}
        size={g.graph()}
      />
      <Box position="relative">
        {g
          .nodes()
          .map(node => g.node(node))
          .map(node => (
            <Node
              height={node.height}
              width={node.width}
              x={node.x}
              y={node.y}
            />
          ))}
      </Box>
    </Flex>
  );
}
