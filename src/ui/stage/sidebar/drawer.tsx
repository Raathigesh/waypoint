import styled from "styled-components";
import React from "react";
import { useSpring, animated } from "react-spring";

const Container = styled(animated.div)`
  display: flex;
  width: 50%;
  position: absolute;
  margin-left: 50px;
  background-color: ghostwhite;
  height: 100vh;
  z-index: 99;
`;

interface Props {
  show: boolean;
  children: any;
}

export default function Drawer({ show, children }: Props) {
  const props = useSpring({
    width: show ? "50%" : "0%",
    opacity: show ? 1 : 0,
    from: {
      width: show ? "0%" : "50%"
    }
  });
  return <Container style={props as any}>{children}</Container>;
}
