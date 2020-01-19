import React, { useRef, useState } from "react";
import { Flex } from "@chakra-ui/core";
import { observer } from "mobx-react-lite";
import { X, Minimize2, Maximize2 } from "react-feather";
import { Resizable } from "re-resizable";
import Draggable from "./Dragabble";

interface Props {
  title: string;
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
  children
}: Props) {
  const ref: any = useRef(null);
  const [collapsed, setCollapsed] = useState(false);
  const handle: any = useRef(null);

  const content = (
    <Flex
      position="relative"
      ref={ref}
      zIndex={3}
      backgroundColor="white"
      flexDirection="column"
      borderRadius="5px"
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
        {!collapsed && (
          <Minimize2
            cursor="pointer"
            size="12px"
            onClick={e => {
              setCollapsed(true);
              e.stopPropagation();
            }}
          />
        )}
        {collapsed && (
          <Maximize2
            cursor="pointer"
            size="12px"
            onClick={e => {
              setCollapsed(false);
              e.stopPropagation();
            }}
          />
        )}
        <X
          cursor="pointer"
          size="12px"
          onClick={e => {
            onRemove();
            e.stopPropagation();
          }}
        />
      </Flex>
      {!collapsed && <Flex overflowY="auto">{children}</Flex>}
    </Flex>
  );

  return (
    <Draggable
      setPosition={setPosition}
      setRef={setRef}
      x={x}
      y={y}
      onEnd={onEnd}
      onStart={onStart}
      handle={handle}
    >
      <Resizable
        style={{ background: "white" }}
        defaultSize={{
          width: `${width || 300}px`,
          height: `${height || 400}px`
        }}
      >
        {content}
      </Resizable>
    </Draggable>
  );
}

export default Frame;
