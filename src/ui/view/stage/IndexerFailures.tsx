import React, { useContext, Fragment } from "react";
import { observer } from "mobx-react-lite";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Flex,
  Link
} from "@chakra-ui/core";
import { indexerStatusStore } from "ui/store";

function IndexerFailures() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const indexerStatus = useContext(indexerStatusStore);

  return (
    <Flex marginTop="3px">
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxHeight="700px" overflow="auto">
            {indexerStatus.failures.map(failure => (
              <Flex flexDirection="column" marginBottom="5px">
                <Flex fontSize="11px">{failure.filePath}</Flex>
                <Flex fontSize="11px">
                  <pre>{failure.error}</pre>
                </Flex>
              </Flex>
            ))}
          </ModalBody>

          <ModalFooter>
            <Button variantColor="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Link onClick={onOpen}>
        {indexerStatus.failures.length} failures during indexing
      </Link>
    </Flex>
  );
}

export default observer(IndexerFailures);
