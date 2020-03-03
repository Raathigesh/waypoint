import React, { Fragment } from "react";
import {
  Flex,
  Button,
  Text,
  Progress,
  Link,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@chakra-ui/core";
import { Coffee, Settings, Activity } from "react-feather";
import { observer } from "mobx-react-lite";
import { IndexerStatus } from "ui/store/models/IndexerStatus";
import image from "../../assets/JsBubblesLogo.png";

interface Props {
  indexerStatus: typeof IndexerStatus.Type;
  onOpenPreference?: () => void;
}

function Welcome({ indexerStatus, onOpenPreference }: Props) {
  if (indexerStatus.status === "indexed") {
    return null;
  }

  let content = null;

  if (indexerStatus.status === "none") {
    content = (
      <Fragment>
        <Text
          color="gray.700"
          marginBottom="20px"
          fontWeight={400}
          fontSize={15}
        >
          Please configure and index your project to get started
        </Text>
        <Flex>
          <Button
            leftIcon={Settings}
            variant="outline"
            width="180px"
            variantColor="blue"
            marginRight="15px"
            onClick={onOpenPreference}
          >
            Configure project
          </Button>
          <Button
            leftIcon={Activity}
            variant="outline"
            width="180px"
            variantColor="blue"
            onClick={() => indexerStatus.initiateIndexing()}
          >
            Start Indexing
          </Button>
        </Flex>
      </Fragment>
    );
  } else if (indexerStatus.status === "indexing") {
    content = (
      <Fragment>
        <Coffee />
        <Text
          marginBottom="20px"
          fontWeight={400}
          fontSize={20}
          textAlign="center"
        >
          Indexing in progress ({indexerStatus.indexedFiles}/
          {indexerStatus.totalFiles})
        </Text>
        <Progress
          size="sm"
          value={(indexerStatus.indexedFiles / indexerStatus.totalFiles) * 100}
          width="100%"
          isAnimated
          hasStripe
        />
      </Fragment>
    );
  }

  return (
    <Flex justifyContent="center" alignItems="center" flexGrow={1}>
      <Flex flexDirection="column" alignItems="center">
        <img src={image} width="250px" style={{ marginBottom: "20px" }} />
        {content}
      </Flex>
    </Flex>
  );
}

export default observer(Welcome);
