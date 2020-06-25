import React, { useContext, useEffect, Fragment } from "react";
import { observer } from "mobx-react-lite";
import { Tooltip } from "react-tippy";
import {
  Flex,
  IconButton,
  useDisclosure,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel
} from "@chakra-ui/core";
import { indexerStatusStore } from "../store";
import Welcome from "./welcome";
import Preference from "./preference";
import IndexerFailures from "./stage/IndexerFailures";
import SymbolSearch from "./symbol-search";
import Bookmarks from "./bookmarks";
import IndexerStatus from "./IndexerStatus";
import { Book, Search, Bookmark } from "react-feather";

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
        <Tabs isFitted>
          <TabList>
            <Tab
              padding="0px"
              _focus={{
                boxShadow: "none"
              }}
            >
              <Flex borderRadius="3px" padding="8px" alignItems="center">
                <Flex borderRadius="5px" padding="9px" mr="3px">
                  <Search size={20} color="#2a69ac" />
                </Flex>
                <Flex flexDirection="column">
                  <Flex ml="5px" fontSize="13px" color="#2a69ac">
                    Search
                  </Flex>
                  <Flex ml="5px" fontSize="11px" color="gray">
                    Search symbols with filters
                  </Flex>
                </Flex>
              </Flex>
            </Tab>
            <Tab
              padding="0px"
              _focus={{
                boxShadow: "none"
              }}
            >
              <Flex borderRadius="3px" padding="8px" alignItems="center">
                <Flex borderRadius="5px" padding="9px" mr="3px">
                  <Bookmark size={20} color="#2a69ac" />
                </Flex>
                <Flex flexDirection="column">
                  <Flex ml="5px" fontSize="13px" color="#2a69ac">
                    Bookmark
                  </Flex>
                  <Flex ml="5px" fontSize="11px" color="gray">
                    Bookmarked items
                  </Flex>
                </Flex>
              </Flex>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <SymbolSearch />
            </TabPanel>
            <TabPanel>
              <Bookmarks />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
      <Preference isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}

export default observer(App);
