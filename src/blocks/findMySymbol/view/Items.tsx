import React from "react";

import { Flex } from "rebass";
import ResultItem from "./ResultItem";
import { Flake } from "common/entities/Symbol";

interface Props {
  items: Flake[];
}

export default function Items({ items }: Props) {
  return (
    <Flex flexWrap="wrap" pb={2} pt={2}>
      {items.map(item => (
        <ResultItem flake={item} onClick={() => {}} />
      ))}
    </Flex>
  );
}
