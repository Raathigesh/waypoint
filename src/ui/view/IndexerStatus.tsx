import React from "react";
import { observer } from "mobx-react-lite";
import { Tooltip } from "react-tippy";
import { Flex, IconButton } from "@chakra-ui/core";
import { CheckCircle } from "react-feather";

interface Props {
  onOpen: () => void;
}

export default observer(function IndexerStatus({ onOpen }: Props) {
  return (
    <Flex
      padding="9px"
      backgroundColor="#F9F9F9"
      borderBottom="1px solid #e7e7e7"
      justifyContent="space-between"
    >
      <Flex alignItems="center">
        <CheckCircle strokeWidth={3} color="#04CA1F" size={15} />{" "}
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
