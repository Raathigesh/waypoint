import React from "react";
import styled from "styled-components";
import { ArcherContainer, ArcherElement, AnchorPosition } from "react-archer";

const Container = styled.div`
  display: flex;
  padding: 5px;
  background-color: wheat;
  margin-bottom: 15px;
`;

interface Props {
  id: string;
  targetIds?: string[];
  label: string;
}

export default function Node({ id, targetIds = [], label }: Props) {
  const content = <Container>{label}</Container>;

  if (targetIds.length || id) {
    return (
      <ArcherElement
        id={id}
        relations={targetIds.map(target => ({
          targetId: target,
          targetAnchor: "right" as AnchorPosition,
          sourceAnchor: "left" as AnchorPosition
        }))}
      >
        {content}
      </ArcherElement>
    );
  }

  return content;
}
