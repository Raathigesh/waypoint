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
  Input,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel
} from "@chakra-ui/core";
import { indexerStatusStore, dependencyGraphStore } from "../store";
import Welcome from "./welcome";
import Preference from "./preference";
import IndexerFailures from "./stage/IndexerFailures";
import SymbolSearch from "./symbol-search";

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
          <Flex position="fixed" right="10px" top="10px" zIndex={100}>
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
          <Flex mt="20px">
            <Tabs flexGrow={1}>
              <TabList>
                <Tab>Search</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <SymbolSearch />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Flex>
        </Fragment>
      )}

      <Preference isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}

export default observer(App);
