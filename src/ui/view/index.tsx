import React, { useContext, useEffect, Fragment } from "react";
import { observer } from "mobx-react-lite";
import {
  Flex,
  IconButton,
  useDisclosure,
  Popover,
  PopoverTrigger,
  Button,
  PopoverHeader,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
  Box,
  ButtonGroup,
  Input
} from "@chakra-ui/core";
import { indexerStatusStore, dependencyGraphStore } from "../store";
import Welcome from "./welcome";
import Preference from "./preference";
import Stage from "./stage";

function App() {
  const indexerStatus = useContext(indexerStatusStore);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dependencyGraph = useContext(dependencyGraphStore);
  useEffect(() => {
    indexerStatus.pollForStatus();
  }, []);

  return (
    <Flex bg="gray.50" flexDirection="column" p={3} minHeight="100vh">
      <Welcome indexerStatus={indexerStatus} onOpenPreference={onOpen} />
      {indexerStatus.status === "indexed" && (
        <Fragment>
          <IconButton
            variant="outline"
            position="fixed"
            right="10px"
            top="10px"
            onClick={onOpen}
            aria-label="Settings"
            icon="settings"
            marginLeft="10px"
            zIndex={100}
          />
          <IconButton
            variant="outline"
            position="fixed"
            right="60px"
            top="10px"
            onClick={() => dependencyGraph.addNote()}
            aria-label="Settings"
            icon="plus-square"
            marginLeft="10px"
            zIndex={100}
          />
          <Popover placement="bottom" closeOnBlur={false}>
            <PopoverTrigger>
              <IconButton
                variant="outline"
                position="fixed"
                right="110px"
                top="10px"
                aria-label="Copy link"
                icon="link"
                marginLeft="10px"
                zIndex={100}
              />
            </PopoverTrigger>
            <PopoverContent
              zIndex={4}
              color="white"
              bg="blue.800"
              borderColor="blue.800"
            >
              <PopoverHeader pt={4} fontWeight="bold" border="0">
                Open this URL in the browser
              </PopoverHeader>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <Input
                  color="blue.800"
                  placeholder="small size"
                  size="sm"
                  borderRadius="3px"
                  value="http://localhost:4545"
                />
              </PopoverBody>
            </PopoverContent>
          </Popover>

          <Stage />
        </Fragment>
      )}
      <Preference isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}

export default observer(App);
