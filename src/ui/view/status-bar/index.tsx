import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Tooltip } from 'react-tippy';
import { Flex, IconButton, Progress, Text, Button, Box } from '@chakra-ui/core';
import {
    CheckCircle,
    Coffee,
    AlertTriangle,
    Check,
    Smile,
    Play,
    Settings,
    Loader,
} from 'react-feather';
import { indexerStatusStore, preferenceStore } from '../../store';
import { stopIndexing } from 'ui/store/services';
import TopStatusBar from './status';

interface Props {
    onOpen: () => void;
}

export default observer(function IndexerStatus({ onOpen }: Props) {
    const indexerStatus = useContext(indexerStatusStore);
    const preference = useContext(preferenceStore);

    const preferenceIcon = (
        <Tooltip size="small" title="Preference" position="bottom">
            <IconButton
                size="xs"
                onClick={onOpen}
                aria-label="Settings"
                icon="settings"
                marginLeft="10px"
                backgroundColor="button.background"
                color="button.foreground"
            />
        </Tooltip>
    );

    if (!preference.startIndexingOnStarUp) {
        return (
            <Flex
                flexDir="column"
                color="#F9F9F9"
                borderBottom="1px solid #F9F9F9"
                padding="9px"
                backgroundColor="#18184F"
            >
                <Flex justifyContent="space-between">
                    <Flex alignItems="center">
                        <Flex fontSize="13px" flexDir="column">
                            <Flex fontSize="18px" mb="5px">
                                Hi there, Welcome to Waypoint!
                            </Flex>
                            <Flex>
                                By default Waypoint indexes all the .js, .ts,
                                .jsx and .tsx files in your root folder but all
                                node_modules are ignored.
                            </Flex>
                            <Flex>
                                Optionally, you can configure which folders to
                                index (e.g: ./src) in the preference panel.
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex mt="20px" mb="10px">
                    <Button
                        size="sm"
                        variant="outline"
                        fontWeight={400}
                        _hover={{
                            backgroundColor: '#AF3A83',
                        }}
                        onClick={() => {
                            preference.setIndexingOnStartUp(true);
                            indexerStatus.initiateIndexing();
                        }}
                        marginRight="15px"
                    >
                        <Play strokeWidth={1} size={15} />
                        <Box ml="5px">Start indexing</Box>
                    </Button>

                    <Button
                        aria-label="Settings"
                        size="sm"
                        variant="outline"
                        fontWeight={400}
                        _hover={{
                            backgroundColor: '#AF3A83',
                        }}
                        onClick={() => {
                            preference.setIndexingOnStartUp(true);
                            onOpen();
                        }}
                    >
                        <Settings strokeWidth={1} size={15} />
                        <Box ml="5px">Set folders to index</Box>
                    </Button>
                </Flex>
            </Flex>
        );
    }

    if (indexerStatus.status === 'indexing') {
        return (
            <Flex flexDir="column" borderBottom="1px solid #F9F9F9">
                <Progress
                    size="sm"
                    value={
                        (indexerStatus.indexedFiles /
                            indexerStatus.totalFiles) *
                        100
                    }
                    width="100%"
                    height="5px"
                    isAnimated
                    hasStripe
                />

                <TopStatusBar
                    icon={<Coffee size={12} />}
                    label={`Indexing in progress (${indexerStatus.indexedFiles}) of ${indexerStatus.totalFiles})`}
                    rightActions={
                        <Button
                            size="xs"
                            variant="outline"
                            onClick={() => {
                                stopIndexing();
                            }}
                        >
                            Stop
                        </Button>
                    }
                />
            </Flex>
        );
    }

    if (indexerStatus.status === 'needs_indexing') {
        return (
            <TopStatusBar
                icon={
                    <AlertTriangle strokeWidth={3} color="#F6AD55" size={15} />
                }
                label="Please index your project"
                rightActions={
                    <Flex alignItems="center">
                        <Button
                            size="xs"
                            variant="outline"
                            onClick={() => {
                                indexerStatus.initiateIndexing();
                            }}
                        >
                            Start indexing
                        </Button>
                        {preferenceIcon}
                    </Flex>
                }
            />
        );
    }

    if (indexerStatus.status === 'none') {
        return (
            <TopStatusBar
                icon={<Loader strokeWidth={3} color="#AF3A83" size={15} />}
                label="Loading...."
                rightActions={preferenceIcon}
            />
        );
    }

    return (
        <TopStatusBar
            icon={<Check strokeWidth={3} color="#01B075" size={15} />}
            label="Indexing completed"
            rightActions={preferenceIcon}
        />
    );
});
