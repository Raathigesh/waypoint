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

function App() {
  const indexerStatus = useContext(indexerStatusStore);
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    indexerStatus.pollForStatus();
  }, []);

  return (
    <Flex bg="#EDEFF6" flexDirection="column" minHeight="100vh" flexGrow={1}>
      <Welcome indexerStatus={indexerStatus} onOpenPreference={onOpen} />
      {indexerStatus.status === "indexed" && (
        <Fragment>
          <Flex position="fixed" right="10px" bottom="10px" zIndex={100}>
            <IndexerFailures />
            <Tooltip size="small" title="Preference" position="bottom">
              <IconButton
                variant="outline"
                size="sm"
                onClick={onOpen}
                aria-label="Settings"
                icon="settings"
                marginLeft="10px"
              />
            </Tooltip>
          </Flex>
          <Flex direction="column" height="100vh" flexGrow={1}>
            <SymbolSearch />
            <Bookmarks />
          </Flex>
        </Fragment>
      )}

      <Preference isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}

export default observer(App);
