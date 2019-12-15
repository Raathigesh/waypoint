// @flow
import React, { Fragment, useContext } from "react";
import { curveBasis as d3CurveBasis, line as d3Line } from "d3-shape";
import { useTheme } from "@chakra-ui/core";
import { observer } from "mobx-react-lite";
import { connectionStore } from "ui/store";

interface Position {
  x: number;
  y: number;
}

/** Create a Rectangle from a pair of its opposite vertices */
export function rectangleFromDiagonal(start: Position, end: Position) {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    w: Math.abs(end.x - start.x),
    h: Math.abs(end.y - start.y)
  };
}

interface Props {
  size: {
    height: string;
    width: string;
  };
}

function Connections({ size }: Props) {
  const connections = useContext(connectionStore);
  const theme = useTheme();
  const colors: any = theme?.colors;
  const fill = colors?.blue["600"];
  const paths = connections
    .enhancedViews()
    .map(connection => [
      connection.start,
      connection.firstBreak,
      connection.secondBreak,
      connection.end
    ])
    .map(points => {
      const line = d3Line()
        .x((d: any) => d.x)
        .y((d: any) => d.y)(points);

      return (
        <Fragment>
          <path
            d={line}
            style={{
              fill: "transparent",
              stroke: fill,
              strokeWidth: "1px"
            }}
            markerStart="url(#markerStart)"
            markerEnd="url(#markerArrow)"
            stroke-linejoin="round"
          />
        </Fragment>
      );
    });

  return (
    <svg
      width="100%"
      style={{
        height: size.height,
        width: size.width,
        position: "absolute",
        zIndex: 0,
        marginTop: "-49px",
        marginLeft: "-8px"
      }}
    >
      <defs>
        <marker
          id="markerArrow"
          markerWidth="23"
          markerHeight="23"
          refX="2"
          refY="6"
          orient="auto"
        >
          <path d="M2,2 L2,11 L10,6 L2,2" style={{ fill }} />
        </marker>
        <marker
          id="markerStart"
          markerWidth="33"
          markerHeight="33"
          refX="15"
          refY="10"
          orient="auto"
        >
          <circle cx="10" cy="10" r="5" stroke={fill} fill={fill} />
        </marker>
      </defs>
      <g>{paths}</g>
    </svg>
  );
}

export default observer(Connections);
