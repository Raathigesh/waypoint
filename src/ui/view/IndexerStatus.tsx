import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Tooltip } from "react-tippy";
import { Flex, IconButton, Progress, Text, Button } from "@chakra-ui/core";
import {
  CheckCircle,
  Coffee,
  AlertTriangle,
  Check,
  Smile,
  Play,
  Settings
} from "react-feather";
import { indexerStatusStore, preferenceStore } from "../store";
import { stopIndexing } from "ui/store/services";

interface Props {
  onOpen: () => void;
}

export default observer(function IndexerStatus({ onOpen }: Props) {
  const indexerStatus = useContext(indexerStatusStore);
  const preference = useContext(preferenceStore);

  if (!preference.startIndexingOnStarUp) {
    return (
      <Flex flexDir="column" borderBottom="1px solid #F9F9F9" padding="9px">
        <Flex justifyContent="space-between">
          <Flex alignItems="center">
            <Flex fontSize="13px" flexDir="column">
              <Flex fontSize="15px" mb="5px">
                <Smile strokeWidth={1} size={20} /> Hi there, Welcome to
                Waypoint.
              </Flex>
              <Flex>
                By default Waypoint indexes all your .js, .ts, .jsx and .tsx
                files. Also node_modules are ignored.
              </Flex>
              <Flex>
                Optionally you can configure which folders to index (e.g: ./src)
                in the preference panel.
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex mt="10px">
          <Button
            size="xs"
            variant="outline"
            onClick={() => {
              preference.setIndexingOnStartUp(true);
              indexerStatus.initiateIndexing();
            }}
            marginRight="15px"
          >
            <Play strokeWidth={1} size={15} />
            All good. Start indexing.
          </Button>

          <Button
            size="xs"
            variant="outline"
            onClick={() => {
              preference.setIndexingOnStartUp(true);
              onOpen();
            }}
          >
            <Settings strokeWidth={1} size={15} />
            Set directories to index
          </Button>
        </Flex>
      </Flex>
    );
  }

  if (indexerStatus.status === "indexing") {
    return (
      <Flex flexDir="column" borderBottom="1px solid #F9F9F9">
        <Progress
          size="sm"
          value={(indexerStatus.indexedFiles / indexerStatus.totalFiles) * 100}
          width="100%"
          height="5px"
          isAnimated
          hasStripe
        />
        <Flex padding="10px" alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <Coffee size={12} />
            <Text marginLeft="5px" fontSize={12} textAlign="center">
              Indexing in progress ({indexerStatus.indexedFiles} of{" "}
              {indexerStatus.totalFiles})
            </Text>
          </Flex>
          <Button
            size="xs"
            variant="outline"
            onClick={() => {
              stopIndexing();
            }}
          >
            Stop
          </Button>
        </Flex>
      </Flex>
    );
  }

  if (indexerStatus.status === "none") {
    return (
      <Flex
        justifyContent="space-between"
        padding="9px"
        borderBottom="1px solid #F9F9F9"
      >
        <Flex alignItems="center">
          <AlertTriangle strokeWidth={3} color="#F6AD55" size={15} />{" "}
          <Flex ml="5px" fontSize="13px" color="#fffff">
            Please index your project
          </Flex>
        </Flex>
        <Button
          size="xs"
          variant="outline"
          onClick={() => {
            indexerStatus.initiateIndexing();
          }}
        >
          Start indexing
        </Button>
      </Flex>
    );
  }

  return (
    <Flex
      padding="9px"
      borderBottom="1px solid #F9F9F9"
      justifyContent="space-between"
    >
      <Flex alignItems="center">
        <Check strokeWidth={3} color="#01B075" size={15} />{" "}
        <Flex ml="5px" fontSize="13px">
          Initial indexing completed
        </Flex>
      </Flex>
      <Tooltip size="small" title="Preference" position="bottom">
        <IconButton
          size="xs"
          onClick={onOpen}
          aria-label="Settings"
          icon="settings"
          marginLeft="10px"
          backgroundColor="#FFFFFF"
        />
      </Tooltip>
    </Flex>
  );
});
