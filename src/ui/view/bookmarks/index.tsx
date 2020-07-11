import React, { useContext, useRef } from "react";
import { Flex } from "@chakra-ui/core";
import SymbolItem from "../components/SymbolItem";
import { bookmarksStore } from "ui/store";
import { Bookmark } from "react-feather";
import { observer } from "mobx-react-lite";
import WidgetFrame from "../components/WidgetFrame";

export default observer(function Bookmarks() {
  const bookmarks = useContext(bookmarksStore);
  return (
    <WidgetFrame
      title="Bookmark"
      subTitle="Bookmark symbols show up here"
      Icon={Bookmark}
    >
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
});
