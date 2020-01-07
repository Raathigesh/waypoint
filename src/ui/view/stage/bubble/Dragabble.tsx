import React, { useRef, useEffect, useContext } from "react";
import { dependencyGraphStore } from "ui/store";
import { Instance } from "mobx-state-tree";
import { DocumentSymbol } from "ui/store/models/DocumentSymbol";

interface Props {
  symbol: Instance<typeof DocumentSymbol>;
  handle: any;
  children: any;
  onEnd: any;
  onStart: any;
}

export default function Draggable({
  symbol,
  children,
  handle,
  onStart,
  onEnd
}: Props) {
  const dependencyGraph = useContext(dependencyGraphStore);
  const container = useRef(null);
  let positionOnMouseDown = { x: 0, y: 0 };
  let intermediatePosition = { x: 0, y: 0 };

  const getPositionFromEvent = (event: any) => {
    return {
      x: event.clientX,
      y: event.clientY
    };
  };

  const onMouseDown = (event: any) => {
    onStart();
    positionOnMouseDown = getPositionFromEvent(event);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    event.stopPropagation();
  };

  const onMouseMove = (event: any) => {
    const position = getPositionFromEvent(event);
    update(position.x, position.y);
    event.preventDefault();
  };

  const onMouseUp = (event: any) => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    const position = getPositionFromEvent(event);
    onEnd(position.x, position.y);
    symbol.setPosition(intermediatePosition.x, intermediatePosition.y);
    event.preventDefault();
  };

  const update = (x: number, y: number) => {
    const relX = x - positionOnMouseDown.x;
    const relY = y - positionOnMouseDown.y;
    const finalX = (symbol.x || 0) + relX;
    const finalY = (symbol.y || 0) + relY;
    if (container.current) {
      (container.current as any).style.transform = `translate(${finalX}px, ${finalY}px)`;
    }
    intermediatePosition = { x: finalX, y: finalY };
  };

  useEffect(() => {
    symbol.setRef(container);
    handle.current.addEventListener("mousedown", onMouseDown);
    return () => handle.current.removeEventListener("mousedown", onMouseDown);
  }, []);

  return (
    <div
      style={{
        display: "inline-block",
        position: "absolute",
        transform: `translate(${symbol.x}px, ${symbol.y}px)`
      }}
      ref={container}
      onClick={e => e.stopPropagation()}
    >
      {children}
    </div>
  );
}
