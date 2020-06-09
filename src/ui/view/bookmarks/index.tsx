import React, { useContext, useRef } from "react";
import { Flex } from "@chakra-ui/core";
import SymbolItem from "../components/SymbolItem";
import { bookmarksStore } from "ui/store";
import { ResizableBox } from "react-resizable";
import { withResizeDetector } from "react-resize-detector";
import { Bookmark } from "react-feather";
import { observer } from "mobx-react-lite";
import WidgetFrame from "../components/WidgetFrame";

interface Props {
  width: number;
  height: number;
}

export default withResizeDetector(
  observer(function Bookmarks({ width, height }: Props) {
    const bookmarks = useContext(bookmarksStore);
    return (
      <WidgetFrame title="Bookmark" Icon={Bookmark} height={200} width={width}>
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
      </WidgetFrame>
    );
  })
);
