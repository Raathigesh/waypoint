import React, { useEffect, useState } from "react";
import BlockFrame from "common/components/BlockFrame/BlockFrame";
import Bookmark from "./Bookmark";
import { Flex } from "rebass";

export default function Search() {
  return (
    <BlockFrame options={[]}>
      <Flex flexDirection="column" width="100%">
        <Bookmark />
      </Flex>
    </BlockFrame>
  );
}
