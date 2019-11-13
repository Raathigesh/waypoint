import React, { Fragment } from "react";
import { Flex, Button, Text, Progress, Link } from "@chakra-ui/core";
import { Coffee } from "react-feather";
import { observer } from "mobx-react-lite";
import { IndexerStatus } from "ui/store/models/IndexerStatus";

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
        <Text marginBottom="20px" fontWeight={400} fontSize={20}>
          Please index your project to get started
        </Text>
        <Button
          leftIcon={Coffee}
          variantColor="pink"
          variant="solid"
          width="180px"
          onClick={() => indexerStatus.initiateIndexing()}
        >
          Start Indexing
        </Button>
        <Link onClick={onOpenPreference}>Configure path map</Link>
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
          Indexing in Progress
        </Text>
        <Progress
          color="pink"
          size="sm"
          value={100}
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
        {content}
      </Flex>
    </Flex>
  );
}

export default observer(Welcome);
