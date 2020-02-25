import React, { useContext, useEffect, Fragment } from "react";
import { observer } from "mobx-react-lite";
import { Tooltip } from "react-tippy";
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
          <Flex position="fixed" right="10px" top="10px" zIndex={100}>
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
            <Tooltip size="small" title="Add a note" position="bottom">
              <IconButton
                variant="outline"
                size="sm"
                onClick={() => dependencyGraph.addNote()}
                aria-label="Note"
                icon="plus-square"
                marginLeft="10px"
              />
            </Tooltip>
            <Popover placement="bottom" closeOnBlur={false}>
              <Tooltip
                size="small"
                title="Open link in browser"
                position="bottom"
              >
                <PopoverTrigger>
                  <IconButton
                    size="sm"
                    variant="outline"
                    aria-label="Copy link"
                    icon="link"
                    marginLeft="10px"
                  />
                </PopoverTrigger>
              </Tooltip>
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
            <Tooltip size="small" title="Refresh" position="bottom">
              <IconButton
                size="sm"
                variant="outline"
                onClick={() => dependencyGraph.initializeStage()}
                aria-label="Refresh"
                icon={"repeat" as any}
                marginLeft="10px"
              />
            </Tooltip>
            <Tooltip size="small" title="Remove all items" position="bottom">
              <IconButton
                size="sm"
                variant="outline"
                onClick={() => dependencyGraph.clear()}
                aria-label="Delete"
                icon={"delete" as any}
                marginLeft="10px"
              />
            </Tooltip>
          </Flex>
          <Stage />
        </Fragment>
      )}
      <Preference isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}

export default observer(App);
