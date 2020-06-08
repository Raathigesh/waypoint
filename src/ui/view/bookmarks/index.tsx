import React, { useContext, useRef } from "react";
import { Flex } from "@chakra-ui/core";
import SymbolItem from "../components/SymbolItem";
import { bookmarksStore } from "ui/store";
import { ResizableBox } from "react-resizable";
import { withResizeDetector } from "react-resize-detector";
import { Bookmark } from "react-feather";
import { observer } from "mobx-react-lite";

interface Props {
  width: number;
  height: number;
}

export default withResizeDetector(
  observer(function Bookmarks({ width, height }: Props) {
    const bookmarks = useContext(bookmarksStore);
    console.log(bookmarks.items.toJSON());
    return (
      <ResizableBox
        handle={
          <Flex
            width="100%"
            height="2px"
            backgroundColor="gray.300"
            cursor="ns-resize"
          />
        }
        axis="y"
        width={width}
        height={200}
        draggableOpts={{}}
      >
        <Flex
          borderRadius="4px"
          background="white"
          padding="10px"
          direction="column"
          height="100%"
          borderTop="3px"
          borderColor="orange.200"
          borderStyle="solid"
        >
          <Flex mb="10px" alignItems="center">
            <Bookmark size={13} />
            <Flex ml="5px" fontSize="14px" fontWeight={400}>
              Bookmarks
            </Flex>
          </Flex>
          <Flex overflow="auto" direction="column" flexGrow={1}>
            {bookmarks.items.map(item => (
              <Flex width="100%">
                <SymbolItem
                  filePath={item.filePath}
                  name={item.name}
                  location={item.location}
                  kind={item.kind}
                  onRemoveBookmark={(name, filePath) => {
                    bookmarks.removeBookmark(name, filePath);
                  }}
                />
              </Flex>
            ))}
          </Flex>
        </Flex>
      </ResizableBox>
    );
  })
);
