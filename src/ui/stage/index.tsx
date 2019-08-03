import React from "react";
import { Flex } from "rebass";
import SideBar from "./sidebar";
import styled from "styled-components";
import Scratchpad from "./scratchpad";
import blocks from "../../blocks/ui-register";

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

export default function Stage() {
  return (
    <Container>
      <SideBar blocks={blocks} />
      <Scratchpad />
    </Container>
  );
}
