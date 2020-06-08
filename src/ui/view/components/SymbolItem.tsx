import React, { useContext } from "react";
import { PseudoBox, Flex, Box, IconButton } from "@chakra-ui/core";
import { Bookmark, Trash2 } from "react-feather";
import { Tooltip } from "react-tippy";
import { openFile, insertImport } from "ui/store/services/file";
import SymbolKindIcon from "./SymbolKindIcon";
import { appStore } from "ui/store";

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

  return (
    <PseudoBox
      p="8px"
      width="100%"
      borderRadius="3px"
      borderStyle="solid"
      borderWidth="1px"
      borderColor="gray.200"
      backgroundColor="#fafafa"
      mb="3px"
      cursor="pointer"
      _hover={{ backgroundColor: "blue.100" }}
      onClick={() => {
        openFile(filePath, location);
      }}
    >
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
            <Box marginLeft="5px">{name}</Box>
          </Flex>

          <Flex marginRight="5px">
            <Tooltip
              size="small"
              title="Import symbol into active  file"
              position="bottom"
            >
              <IconButton
                variant="outline"
                size="xs"
                onClick={(e: any) => {
                  e.stopPropagation();
                  insertImport(name, filePath);
                }}
                aria-label="Add"
                icon="small-add"
                marginLeft="10px"
              />
            </Tooltip>
            {onBookmark && (
              <Tooltip size="small" title="Add to bookmark" position="bottom">
                <IconButton
                  variant="outline"
                  size="xs"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    onBookmark(name, filePath);
                  }}
                  aria-label="Bookmark"
                  icon={() => <Bookmark size={"11px"} />}
                  marginLeft="10px"
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
                  variant="outline"
                  size="xs"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    onRemoveBookmark(name, filePath);
                  }}
                  aria-label="Bookmark"
                  icon={() => <Trash2 size={"11px"} />}
                  marginLeft="10px"
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
    </PseudoBox>
  );
}
