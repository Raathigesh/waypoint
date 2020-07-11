import React from "react";
import { PseudoBox, Flex, Box } from "@chakra-ui/core";

interface Props {
  name: string;
  Icon: any;
}

export default function SymbolMenu({ Icon, name }: Props) {
  return (
    <PseudoBox
      style={{
        backgroundColor: "#2a69ac",
        padding: "8px",
        borderRadius: "0px 0px 0px 0px",
        color: "white",
        fontSize: "12px"
      }}
      _hover={{
        backgroundColor: "#2a5d93 !important"
      }}
    >
      <Flex alignItems="center">
        <Icon size={12} strokeWidth="2px" />
        <Box ml="5px">{name}</Box>
      </Flex>
    </PseudoBox>
  );
}
