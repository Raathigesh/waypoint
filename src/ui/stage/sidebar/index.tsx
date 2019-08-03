import React, { useState, useRef } from "react";
import { Flex, Card } from "rebass";
import { Search } from "react-feather";
import ViewIcon from "./ViewIcon";
import styled from "styled-components";
import Drawer from "./drawer";
import { BlockUI } from "common/Block";

const Wrapper = styled.div`
  display: flex;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 50px;
  background-color: #b6b6b6;
`;

interface Props {
  blocks: BlockUI[];
}

export default function SideBar({ blocks }: Props) {
  const [showDrawer, setShowDrawer] = useState(false);
  const DrawerComponent = useRef<any>(null);
  return (
    <Wrapper>
      <Container>
        {blocks.map(({ title, Icon, Component }) => (
          <ViewIcon
            Icon={Icon}
            label={title}
            onClick={() => {
              setShowDrawer(!showDrawer);
              DrawerComponent.current = Component;
            }}
          />
        ))}
      </Container>
      <Drawer show={showDrawer}>
        {DrawerComponent.current && <DrawerComponent.current />}
      </Drawer>
    </Wrapper>
  );
}
