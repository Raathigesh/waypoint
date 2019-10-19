import React from "react";
import { CircularProgress, Flex, Text } from "@chakra-ui/core";

interface Props {
  isLoading: boolean;
}

export default function Loading({ isLoading }: Props) {
  if (!isLoading) {
    return null;
  }

  return (
    <Flex width="100%" justifyContent="center" margin={3}>
      <Flex justifyItems="center" alignItems="center">
        <CircularProgress isIndeterminate color="green" size="20px" />
        <Text fontSize="md" ml="2">
          Fetching results
        </Text>
      </Flex>
    </Flex>
  );
}
