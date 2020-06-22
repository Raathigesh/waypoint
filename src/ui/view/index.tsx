import React, { useContext, useEffect, Fragment } from "react";
import { observer } from "mobx-react-lite";
import { Tooltip } from "react-tippy";
import { Flex, IconButton, useDisclosure } from "@chakra-ui/core";
import { indexerStatusStore } from "../store";
import Welcome from "./welcome";
import Preference from "./preference";
import IndexerFailures from "./stage/IndexerFailures";
import SymbolSearch from "./symbol-search";
import Bookmarks from "./bookmarks";
import IndexerStatus from "./IndexerStatus";

function App() {
  const indexerStatus = useContext(indexerStatusStore);
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    indexerStatus.pollForStatus();
  }, []);

  return (
    <Flex bg="white" flexDirection="column" minHeight="100vh" flexGrow={1}>
      <Flex direction="column" height="100vh" flexGrow={1}>
        <IndexerStatus onOpen={onOpen as any} />
        <SymbolSearch />
        <Bookmarks />
      </Flex>
      <Preference isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}

export default observer(App);
