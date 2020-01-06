import React, { useRef, useEffect, useContext } from "react";
import { dependencyGraphStore } from "ui/store";

interface Props {
  x: number;
  y: number;
  id: string;
  handle: any;
  children: any;
  onEnd: any;
  onStart: any;
}

export default function Draggable({
  id,
  x,
  y,
  children,
  handle,
  onStart,
  onEnd
}: Props) {
  const dependencyGraph = useContext(dependencyGraphStore);
  const container = useRef(null);

  let initialPos = { x: 0, y: 0 };
  let position = { x: 0, y: 0 };

  const getPosition = (event: any) => {
    return {
      x: event.clientX, //- this.initialPos.left,
      y: event.clientY //- this.initialPos.top
    };
  };

  const onMouseUp = (event: any) => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    const pos = getPosition(event);
    onEnd(pos.x, pos.y);
    dependencyGraph.setRefPosition(id, pos.x, pos.y);
    event.preventDefault();
  };

  const onMouseDown = (event: any) => {
    onStart();
    initialPos = getPosition(event);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    event.stopPropagation();
  };

  const onMouseMove = (event: any) => {
    const pos = getPosition(event);
    update(pos.x, pos.y);
    initialPos = {
      x: pos.x,
      y: pos.y
    };
    event.preventDefault();
  };

  const update = (x: number, y: number) => {
    const relX = x - initialPos.x;
    const relY = y - initialPos.y;
    const finalX = position.x + relX;
    const finalY = position.y + relY;
    if (container.current) {
      (container.current as any).style.transform = `translate(${finalX}px, ${finalY}px)`;
    }
    position = { x: finalX, y: finalY };
  };

  useEffect(() => {
    dependencyGraph.setSymbolRef(id, container, x, y);
    update(x, y);
    handle.current.addEventListener("mousedown", onMouseDown);

    return () => handle.current.removeEventListener("mousedown", onMouseDown);
  }, [x, y]);

  return (
    <div
      style={{
        display: "inline-block",
        position: "absolute",
        transform: `translate(${x}px, ${y}px)`
      }}
      ref={container}
      onClick={e => e.stopPropagation()}
    >
      {children}
    </div>
  );
}
