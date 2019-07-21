import { Flex } from "rebass";
import React from "react";
import TextInput from "common/components/TextInput/TextInput";

export default function Rule() {
  return (
    <Flex p={3} flexDirection="column">
      <Flex flexDirection="column" paddingBottom={1}>
        Rule name
        <TextInput />
      </Flex>
      <Flex flexDirection="column" paddingBottom={1}>
        File/directory path pattern
        <TextInput />
      </Flex>
      <button>Save</button>
    </Flex>
  );
}
