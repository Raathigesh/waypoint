import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Input,
  DrawerFooter,
  Button,
  Flex,
  IconButton
} from "@chakra-ui/core";
import { pathMapStore, indexerStatusStore } from "ui/store";
import { Coffee } from "react-feather";

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

function Preference({ isOpen, onClose }: Props) {
  const pathMap = useContext(pathMapStore);
  const indexerStatus = useContext(indexerStatusStore);

  const handleUpdate = (id: string, alias: string, path: string) => {
    pathMap.update(id, alias, path);
  };

  return (
    <Drawer size="md" isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Preference</DrawerHeader>

        <DrawerBody>
          {pathMap.items.map(item => {
            return (
              <Flex key={item.id}>
                <Input
                  value={item.alias}
                  placeholder="Alias"
                  size="sm"
                  onChange={(e: any) =>
                    handleUpdate(item.id, e.target.value, item.path)
                  }
                />
                <Input
                  value={item.path}
                  placeholder="Path"
                  size="sm"
                  onChange={(e: any) =>
                    handleUpdate(item.id, item.alias, e.target.value)
                  }
                />
                <IconButton
                  aria-label="Search database"
                  size="sm"
                  icon="close"
                  onClick={() => pathMap.remove(item.id)}
                />
              </Flex>
            );
          })}

          <Button
            rightIcon="plus-square"
            variantColor="teal"
            variant="outline"
            size="xs"
            onClick={() => pathMap.addNewItem("", "")}
          >
            Add another
          </Button>
          <Button
            leftIcon={Coffee}
            variantColor="pink"
            variant="outline"
            size="sm"
            width="180px"
            onClick={() => indexerStatus.initiateIndexing()}
          >
            Start Indexing
          </Button>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Done
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default observer(Preference);
