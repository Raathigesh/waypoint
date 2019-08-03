import styled from "styled-components";
import React from "react";
import { Tooltip } from "react-tippy";

const Container = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: ghostwhite;
  }
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 3px;
  border-radius: 3px;
`;

interface Props {
  Icon: any;
  label: string;
  onClick: () => void;
}

export default function ViewIcon({ Icon, label, onClick }: Props) {
  return (
    <Tooltip title={label} size="small" animate="fade">
      <Container onClick={onClick}>
        <Icon size={17} />
      </Container>
    </Tooltip>
  );
}
