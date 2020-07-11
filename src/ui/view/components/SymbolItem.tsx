import React, { useContext } from "react";
import { PseudoBox, Flex, Box, IconButton } from "@chakra-ui/core";
import { Bookmark, Trash2, Plus } from "react-feather";
import { Tooltip } from "react-tippy";
import { openFile, insertImport } from "ui/store/services/file";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import SymbolKindIcon from "./SymbolKindIcon";
import { appStore } from "ui/store";
import SymbolMenu from "./SymbolMenu";

export default function SymbolItem({
  filePath,
  location,
  kind,
  name,
  onBookmark,
  onRemoveBookmark
}: {
  filePath: string;
  location: any;
  kind: string;
  name: string;
  onBookmark?: (name: string, path: string) => void;
  onRemoveBookmark?: (name: string, path: string) => void;
}) {
  const projectInfo = useContext(appStore);

  const id = `${name}${filePath}${
    onRemoveBookmark ? "bookmark" : "search"
  }${Math.random()}`;

  return (
    <PseudoBox
      p="7px"
      width="100%"
      marginBottom="2px"
      borderRadius="4px"
      borderBottom="1px solid #f4f4f4"
      backgroundColor="#ffffff"
      cursor="pointer"
      _hover={{ backgroundColor: "gray.50" }}
      onClick={() => {
        openFile(filePath, location);
      }}
    >
      <ContextMenuTrigger id={id}>
        <Flex flexDirection="column">
          <Flex alignItems="center" justifyContent="space-between">
            <Flex
              color="gray.800"
              fontSize={12}
              fontWeight={500}
              marginRight="10px"
              alignItems="center"
            >
              <SymbolKindIcon kind={kind} size="12px" />
              <Box
                marginLeft="5px"
                color="#393939"
                fontWeight={600}
                fontSize={13}
              >
                {name}
              </Box>
            </Flex>

            <Flex marginRight="5px">
              <Tooltip
                size="small"
                title="Import symbol into active  file"
                position="bottom"
              >
                <IconButton
                  size="xs"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    insertImport(name, filePath);
                  }}
                  aria-label="Add"
                  icon="small-add"
                  marginLeft="10px"
                  border="1px solid #d7d7d7"
                  backgroundColor="white"
                />
              </Tooltip>
              {onBookmark && (
                <Tooltip size="small" title="Add to bookmark" position="bottom">
                  <IconButton
                    size="xs"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      onBookmark(name, filePath);
                    }}
                    aria-label="Bookmark"
                    icon={() => <Bookmark size={"11px"} />}
                    marginLeft="10px"
                    border="1px solid #d7d7d7"
                    backgroundColor="white"
                  />
                </Tooltip>
              )}
              {onRemoveBookmark && (
                <Tooltip
                  size="small"
                  title="Remove from bookmark"
                  position="bottom"
                >
                  <IconButton
                    size="xs"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      onRemoveBookmark(name, filePath);
                    }}
                    aria-label="Bookmark"
                    icon={() => <Trash2 size={"11px"} />}
                    marginLeft="10px"
                    border="1px solid #d7d7d7"
                    backgroundColor="white"
                  />
                </Tooltip>
              )}
            </Flex>
          </Flex>
          {filePath && (
            <Flex fontSize={11} color="gray.600">
              {filePath.replace(projectInfo.root, "")}
            </Flex>
          )}
        </Flex>
      </ContextMenuTrigger>
      <ContextMenu style={{ borderRadius: "3px" }} id={id}>
        {onBookmark && (
          <MenuItem
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onBookmark(name, filePath);
            }}
          >
            <SymbolMenu Icon={Bookmark} name="Bookmark" />
          </MenuItem>
        )}
        {onRemoveBookmark && (
          <MenuItem
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onRemoveBookmark(name, filePath);
            }}
            data={{ name, filePath }}
          >
            <SymbolMenu Icon={Trash2} name="Remove bookmark" />
          </MenuItem>
        )}
        <MenuItem
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            insertImport(name, filePath);
          }}
        >
          <SymbolMenu Icon={Plus} name="Import symbol into active file" />
        </MenuItem>
      </ContextMenu>
    </PseudoBox>
  );
}
