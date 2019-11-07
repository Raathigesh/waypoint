// @flow
import React, { Fragment } from "react";
import { curveBasis as d3CurveBasis, line as d3Line } from "d3-shape";

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
  const paths = connections.map(({ points, label }) => {
    const line = d3Line()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3CurveBasis)(points);

    const { x, y, w, h } = rectangleFromDiagonal(points[0], points[2]);

    return (
      <Fragment>
        <path
          d={line}
          style={{ fill: "transparent", stroke: "wheat", strokeWidth: "1px" }}
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
              color: "wheat"
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
        zIndex: "99"
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
          <path d="M2,2 L2,11 L10,6 L2,2" style={{ fill: "wheat" }} />
        </marker>
      </defs>
      <g>{paths}</g>
    </svg>
  );
}
