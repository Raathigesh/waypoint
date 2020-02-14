import React, { useRef, useState, useEffect } from "react";
import { Flex, Button } from "@chakra-ui/core";
import { X, Minimize2, Maximize2 } from "react-feather";
import { Resizable } from "re-resizable";

interface Props {
  title: any;
  headerColor: string;
  setPosition: (x: number, y: number) => void;
  setRef: (ref: any) => void;
  x: number | undefined;
  y: number | undefined;
  height?: number;
  width?: number;
  children: any;
  onEnd: any;
  onStart: any;
  onRemove: any;
  scroll?: boolean;
  zIndex?: number;
  headerAction?: any;
}

function Frame({
  title,
  headerColor,
  setPosition,
  setRef,
  x,
  y,
  height,
  width,
  onEnd,
  onStart,
  onRemove,
  children,
  scroll,
  zIndex,
  headerAction
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const handle: any = useRef(null);
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
    if (handle.current) {
      handle.current.addEventListener("mousedown", onMouseDown);
    }

    return () =>
      handle.current &&
      handle.current.removeEventListener("mousedown", onMouseDown);
  }, [x, y, collapsed]);

  const content = (
    <Flex
      position="relative"
      backgroundColor="white"
      borderRadius="10px"
      flexDirection="column"
      height="100%"
      boxShadow="
0 0px 1.5px rgba(0, 0, 0, 0.028),
0 0px 5.1px rgba(0, 0, 0, 0.042),
0 0px 23px rgba(0, 0, 0, 0.07)
"
    >
      <Flex
        cursor="grab"
        alignItems="center"
        backgroundColor={headerColor || "rgba(0, 0, 0, 0.028)"}
        justifyContent="flex-end"
        borderRadius="5px 5px 0px 0px"
        padding="3px"
      >
        <Flex
          ref={handle}
          cursor="grab"
          className="handle"
          width="100%"
          marginLeft="5px"
          fontSize="13px"
        >
          {title}
        </Flex>
        <Flex>
          {headerAction}
          {!collapsed && (
            <Button
              size="xs"
              variant="outline"
              padding="3px"
              marginLeft="3px"
              onClick={e => {
                setCollapsed(true);
                e.stopPropagation();
              }}
            >
              <Minimize2 cursor="pointer" size="12px" />
            </Button>
          )}
          {collapsed && (
            <Button
              size="xs"
              variant="outline"
              padding="3px"
              marginLeft="3px"
              onClick={e => {
                setCollapsed(false);
                e.stopPropagation();
              }}
            >
              <Maximize2 cursor="pointer" size="12px" />
            </Button>
          )}
          <Button
            size="xs"
            variant="outline"
            padding="3px"
            marginLeft="3px"
            onClick={e => {
              onRemove();
              e.stopPropagation();
            }}
          >
            <X cursor="pointer" size="12px" />
          </Button>
        </Flex>
      </Flex>
      {!collapsed && (
        <Flex overflowY={scroll ? "auto" : "hidden"}>{children}</Flex>
      )}
    </Flex>
  );

  return (
    <div
      style={{
        display: "inline-block",
        position: "absolute",
        transform: `translate(${x}px, ${y}px)`,
        zIndex: zIndex || 3,
        borderRadius: "10px"
      }}
      ref={container}
      onClick={e => e.stopPropagation()}
    >
      {collapsed ? (
        content
      ) : (
        <Resizable
          style={{ background: "white", borderRadius: "10px" }}
          defaultSize={{
            width: `${width || 300}px`,
            height: `${height || 400}px`
          }}
        >
          {content}
        </Resizable>
      )}
    </div>
  );
}

export default Frame;
