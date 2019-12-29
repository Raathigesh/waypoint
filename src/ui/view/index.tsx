import React, { useContext, useEffect, Fragment } from "react";
import { observer } from "mobx-react-lite";
import { Flex, IconButton, useDisclosure } from "@chakra-ui/core";
import Search from "./SearchBar";
import { indexerStatusStore } from "../store";
import Welcome from "./welcome";
import Preference from "./preference";
import Stage from "./stage";

function App() {
  const indexerStatus = useContext(indexerStatusStore);
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    indexerStatus.pollForStatus();
  }, []);

  return (
    <Flex bg="gray.50" flexDirection="column" p={3} minHeight="100vh">
      <Welcome indexerStatus={indexerStatus} onOpenPreference={onOpen} />
      {indexerStatus.status === "indexed" && (
        <Fragment>
          <Flex width="100%" zIndex={5}>
            <Search />
            <IconButton
              onClick={onOpen}
              aria-label="Settings"
              icon="settings"
              marginLeft="10px"
            />
          </Flex>

          <Stage />
        </Fragment>
      )}
      <Preference isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}

export default observer(App);
