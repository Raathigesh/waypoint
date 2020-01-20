import React, { useRef, useEffect, useContext } from "react";
import { observer } from "mobx-react-lite";

interface Props {
  setPosition: (x: number, y: number) => void;
  setRef: (ref: any) => void;
  x: number | undefined;
  y: number | undefined;
  handle: any;
  children: any;
  onEnd: any;
  onStart: any;
}

function Draggable({
  setPosition,
  setRef,
  x,
  y,
  children,
  handle,
  onStart,
  onEnd
}: Props) {
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
    setPosition(intermediatePosition.x, intermediatePosition.y);
    event.preventDefault();
  };

  const update = (mouseX: number, mouseY: number) => {
    const relX = mouseX - positionOnMouseDown.x;
    const relY = mouseY - positionOnMouseDown.y;
    const finalX = (x || 0) + relX;
    const finalY = (y || 0) + relY;
    if (container.current) {
      (container.current as any).style.transform = `translate(${finalX}px, ${finalY}px)`;
    }
    intermediatePosition = { x: finalX, y: finalY };
  };

  useEffect(() => {
    setRef(container);
    console.log(handle);
    if (handle) {
      handle.addEventListener("mousedown", onMouseDown);
    }

    return () => handle && handle.removeEventListener("mousedown", onMouseDown);
  }, [x, y, handle]);

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

export default Draggable;
