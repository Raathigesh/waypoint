import React, { useContext, useEffect, Fragment } from "react";
import { observer } from "mobx-react-lite";
import { Flex, IconButton, useDisclosure } from "@chakra-ui/core";
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
          <IconButton
            position="fixed"
            right="10px"
            top="10px"
            onClick={onOpen}
            aria-label="Settings"
            icon="settings"
            marginLeft="10px"
            zIndex={100}
          />

          <Stage />
        </Fragment>
      )}
      <Preference isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}

export default observer(App);
