import React, { useRef, useEffect } from "react";
import { Flex, Text } from "@chakra-ui/core";
import File from "./file";
import { File as FileType } from ".";
import { observer } from "mobx-react-lite";
import { useTransition, animated } from "react-spring";

interface Props {
  column: FileType[];
  side: string;
}

function Column({ column, side }: Props) {
  const mid = Math.round((column.length - 1) / 2);
  let top = side === "top" ? column.slice(0, mid) : [];
  const bottom = side === "bottom" ? column.slice(mid, column.length - 1) : [];

  if (column.length === 1 && side === "top") {
    top = column;
  }

  const topTransitions = useTransition(top, item => item.path, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  const bottomTransitions = useTransition(bottom, item => item.path, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  return (
    <Flex flexDirection="column">
      {topTransitions.map(({ item, props, key }) => (
        <File key={key} style={props} file={item}></File>
      ))}

      {bottomTransitions.map(({ item, props, key }) => (
        <File key={key} style={props} file={item}></File>
      ))}
    </Flex>
  );
}

export default observer(Column);
