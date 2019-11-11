// @flow
import React, { Fragment } from "react";
import { curveBasis as d3CurveBasis, line as d3Line } from "d3-shape";
import { useTheme } from "@chakra-ui/core";

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
  connections: {
    points: Position[];
    label: string;
  }[];
  size: {
    height: number;
    width: number;
  };
}

export default function Connections({ connections, size }: Props) {
  const theme = useTheme();
  const colors: any = theme?.colors;
  const fill = colors?.blue["700"];
  const paths = connections.map(({ points, label }) => {
    const line = d3Line()
      .x((d: any) => d.x)
      .y((d: any) => d.y)
      .curve(d3CurveBasis)(points);

    const { x, y, w, h } = rectangleFromDiagonal(points[0], points[2]);

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
        />
        <foreignObject
          x={x}
          y={y}
          width={w}
          height={h}
          style={{ overflow: "visible" }}
        >
          <div
            style={{
              width: w,
              height: h,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              color: fill
            }}
          >
            <div style={{ marginBottom: "20px" }}>{label}</div>
          </div>
        </foreignObject>
      </Fragment>
    );
  });

  return (
    <svg
      style={{
        height: size.height + 30,
        width: size.width,
        position: "absolute",
        zIndex: 1
      }}
    >
      <defs>
        <marker
          id="markerArrow"
          markerWidth="33"
          markerHeight="33"
          refX="2"
          refY="6"
          orient="auto"
        >
          <path
            d="M2,2 L2,11 L10,6 L2,2"
            style={{ fill: colors.blue["400"] }}
          />
        </marker>
        <marker
          id="markerStart"
          markerWidth="33"
          markerHeight="33"
          refX="15"
          refY="10"
          orient="auto"
        >
          <circle
            cx="10"
            cy="10"
            r="5"
            stroke="black"
            stroke-width="1"
            fill="red"
          />
        </marker>
      </defs>
      <g>{paths}</g>
    </svg>
  );
}
