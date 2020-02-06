import React, { useState, useContext, useRef, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Box,
  Button,
  Link
} from "@chakra-ui/core";
import { appStore } from "ui/store";
import { Instance } from "mobx-state-tree";
import { DocumentSymbol } from "ui/store/models/DocumentSymbol";
import { openFile } from "ui/store/services/file";
import { observer } from "mobx-react-lite";

export interface Props {
  symbol: Instance<typeof DocumentSymbol>;
  onClose: () => void;
}
function ReferenceDialog({ symbol, onClose }: Props) {
  const projectInfo = useContext(appStore);

  return (
    <Modal isOpen onClose={onClose} size="xl" closeOnOverlayClick>
      <ModalOverlay />
      <ModalContent padding="10px" height="400px" borderRadius="3px">
        {symbol.references.map(reference => (
          <Flex alignItems="center">
            <Link
              fontSize={11}
              whiteSpace="nowrap"
              paddingLeft="10px"
              onClick={() => {
                openFile(reference.filePath, reference.location as any);
              }}
            >
              <Box as="span" fontWeight={600} marginRight="10px">
                {reference.name}
              </Box>
              <Box as="span" fontWeight={400}>
                {reference.filePath.replace(projectInfo.root, "")}
              </Box>
            </Link>
          </Flex>
        ))}
      </ModalContent>
    </Modal>
  );
}

export default observer(ReferenceDialog);
