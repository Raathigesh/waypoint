import React, { useRef, useEffect, useContext, useLayoutEffect } from "react";
import { Flex } from "@chakra-ui/core";
import { observer } from "mobx-react-lite";
import { DocumentSymbol } from "ui/store/models/DocumentSymbol";
import { connectionStore } from "ui/store";
import { Instance } from "mobx-state-tree";

interface Props {
  symbol: Instance<typeof DocumentSymbol>;
}

function Function({ symbol }: Props) {
  const ref: any = useRef(null);
  const connections = useContext(connectionStore);

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    connections.addConnection(
      rect.right,
      rect.top + rect.height / 2,
      rect.right + 25,
      rect.top + rect.height / 2
    );
  });

  return (
    <Flex
      ref={ref}
      padding="5px"
      borderRadius="3px"
      color="gray.50"
      bg="gray.1000"
      alignItems="center"
      margin="5px"
      cursor="pointer"
      fontSize={12}
    >
      {symbol.name}
    </Flex>
  );
}

export default observer(Function);
