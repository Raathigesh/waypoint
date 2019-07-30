import React, { useState } from "react";
import { Flex } from "rebass";
import Select from "react-select";
import styled from "styled-components";
import { X } from "react-feather";

interface Props {}

const SymbolName = styled.div`
  font-size: 18px;
  cursor: pointer;
`;

export default function Bookmark({  }: Props) {
  const [inEdit, setInEdit] = useState(false);
  const [descriptionInEdit, setDescriptionInEdit] = useState(false);

  return (
    <Flex
      alignItems="center"
      backgroundColor="wheat"
      css={{ borderRadius: "5px" }}
      p={2}
      mb={1}
    >
      <Flex
        flexWrap="wrap"
        flexDirection="column"
        onClick={() => {
          setInEdit(false);
          setDescriptionInEdit(false);
        }}
        css={{ flexGrow: 1 }}
      >
        <Flex>
          {!inEdit && (
            <SymbolName
              onClick={event => {
                setInEdit(true);
                event.stopPropagation();
              }}
            >
              Hello
            </SymbolName>
          )}
          {inEdit && (
            <Select
              defaultValue={null}
              isClearable
              styles={{
                container: provided => ({
                  ...provided,
                  width: "250px"
                })
              }}
              options={[]}
              onChange={(option: any) => {}}
            />
          )}
        </Flex>
        <Flex>
          {descriptionInEdit && (
            <input
              type="text"
              onClick={event => {
                event.stopPropagation();
              }}
            />
          )}
          {!descriptionInEdit && (
            <div
              onClick={event => {
                setDescriptionInEdit(true);
                event.stopPropagation();
              }}
            >
              Description
            </div>
          )}
        </Flex>
      </Flex>
      <X size={16} />
    </Flex>
  );
}
