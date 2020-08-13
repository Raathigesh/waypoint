import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
    Flex,
    useDisclosure,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    useTheme,
} from '@chakra-ui/core';
import { indexerStatusStore } from '../store';
import Preference from './preference';

import SymbolSearch from './symbol-search';
import Bookmarks from './bookmarks';
import IndexerStatus from './status-bar';
import { Search, Bookmark } from 'react-feather';
import { useCSSVarColor } from './components/useThemeColor';

const TabsComponent: any = Tabs;

function App() {
    const indexerStatus = useContext(indexerStatusStore);
    const { isOpen, onOpen, onClose } = useDisclosure();
    useEffect(() => {
        indexerStatus.pollForStatus();
    }, []);

    const tabHeaderColor = useCSSVarColor('text.primary');
    const variableColor = useCSSVarColor('button.background');

    return (
        <Flex
            bg="background.primary"
            color="text.primary"
            flexDirection="column"
            minHeight="100vh"
            flexGrow={1}
        >
            <Flex direction="column" height="100vh" flexGrow={1}>
                <IndexerStatus onOpen={onOpen as any} />
                <TabsComponent isFitted>
                    <TabList>
                        <Tab
                            _selected={{
                                borderBottom: '2px solid',
                                borderBottomColor: variableColor,
                            }}
                            padding="0px"
                            _focus={{
                                boxShadow: 'none',
                            }}
                        >
                            <Flex
                                borderRadius="3px"
                                padding="8px"
                                alignItems="center"
                            >
                                <Flex borderRadius="5px" padding="9px" mr="3px">
                                    <Search size={20} stroke={tabHeaderColor} />
                                </Flex>
                                <Flex flexDirection="column">
                                    <Flex
                                        ml="5px"
                                        fontSize="13px"
                                        color="text.primary"
                                    >
                                        Search
                                    </Flex>
                                    <Flex
                                        ml="5px"
                                        fontSize="11px"
                                        color="text.primary"
                                    >
                                        Search symbols with filters
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Tab>
                        <Tab
                            padding="0px"
                            _selected={{
                                borderBottom: '2px solid',
                                borderBottomColor: variableColor,
                            }}
                            _focus={{
                                boxShadow: 'none',
                            }}
                        >
                            <Flex
                                borderRadius="3px"
                                padding="8px"
                                alignItems="center"
                            >
                                <Flex borderRadius="5px" padding="9px" mr="3px">
                                    <Bookmark
                                        size={20}
                                        stroke={tabHeaderColor}
                                    />
                                </Flex>
                                <Flex flexDirection="column">
                                    <Flex
                                        ml="5px"
                                        fontSize="13px"
                                        color="text.primary"
                                    >
                                        Bookmark
                                    </Flex>
                                    <Flex
                                        ml="5px"
                                        fontSize="11px"
                                        color="text.primary"
                                    >
                                        Bookmarked items
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <SymbolSearch />
                        </TabPanel>
                        <TabPanel>
                            <Bookmarks />
                        </TabPanel>
                    </TabPanels>
                </TabsComponent>
            </Flex>
            <Preference isOpen={isOpen} onClose={onClose} />
        </Flex>
    );
}

export default observer(App);
