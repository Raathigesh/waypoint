import React from "react";
import styled from "styled-components";

const Container = styled.button`
  background-color: wheat;
  border: 1px solid gray;
  border-radius: 5px;
  padding: 5px;
  display: flex;
  cursor: pointer;
`;

interface Props {
  onClick: () => void;
  label: string;
  Icon?: any;
}

export default function Button({ label, Icon, onClick }: Props) {
  const icon = Icon ? <Icon size={14} /> : null;

  return (
    <Container onClick={onClick}>
      {icon}
      {label}
    </Container>
  );
}
