import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
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
    IconButton,
    Divider,
    Heading,
    Text,
    Code,
    Link,
} from '@chakra-ui/core';
import { pathMapStore, indexerStatusStore, appStore } from 'ui/store';
import { Coffee, Activity, Play } from 'react-feather';
import { openURL } from 'ui/store/services/misc';

interface Props {
    isOpen?: boolean;
    onClose?: () => void;
}

function Preference({ isOpen, onClose }: Props) {
    const pathMap = useContext(pathMapStore);
    const app = useContext(appStore);
    const indexerStatus = useContext(indexerStatusStore);

    const handleUpdate = (id: string, alias: string, path: string) => {
        pathMap.update(id, alias, path);
    };

    return (
        <Drawer size="lg" isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader fontWeight={400}>Preference</DrawerHeader>

                <DrawerBody>
                    <Heading size="sm" fontWeight={400}>
                        Folders to index
                    </Heading>
                    <Text fontSize="12px">
                        Path should be relative to the folder opened in VSCode.{' '}
                        <Link
                            color="#3f51b5"
                            href="https://waypoint.netlify.app/docs/folder-to-index"
                            target="_blank"
                            onClick={() => {
                                openURL(
                                    'https://waypoint.netlify.app/docs/folder-to-index'
                                );
                            }}
                        >
                            Read the docs for more info.
                        </Link>
                    </Text>
                    <Flex flexGrow={1} flexDirection="column" marginTop="10px">
                        {[...app.directories.entries()].map(
                            ([id, directory]) => {
                                return (
                                    <Flex
                                        key={id}
                                        alignItems="center"
                                        marginBottom="5px"
                                    >
                                        <Input
                                            value={directory}
                                            placeholder="Directory"
                                            size="sm"
                                            marginRight="5px"
                                            onKeyDown={(e: any) =>
                                                e.stopPropagation()
                                            }
                                            onChange={(e: any) => {
                                                app.changeDirectory(
                                                    id,
                                                    e.target.value
                                                );
                                            }}
                                        />

                                        <IconButton
                                            marginLeft="5px"
                                            aria-label="Search database"
                                            size="xs"
                                            icon="close"
                                            variant="outline"
                                            onClick={() =>
                                                app.removeDirectory(id)
                                            }
                                        />
                                    </Flex>
                                );
                            }
                        )}
                    </Flex>
                    <Flex
                        justifyContent="flex-end"
                        marginTop="5px"
                        marginBottom="5px"
                    >
                        <Button
                            leftIcon="plus-square"
                            variant="outline"
                            size="xs"
                            onClick={() => app.addDirectory('')}
                        >
                            Add another folder
                        </Button>
                    </Flex>

                    <Heading size="sm" fontWeight={400}>
                        Import alias configuration
                    </Heading>
                    <Text fontSize="12px">
                        If you use custom module alias in your bundler, add them
                        here. First value is the alias (e.g: components). The
                        second value is the relative path which points to the
                        actual directory (e.g: ./src/components).{' '}
                        <Link
                            color="#3f51b5"
                            href="https://waypoint.netlify.app/docs/alias-configuration"
                            target="_blank"
                            onClick={() => {
                                openURL(
                                    'https://waypoint.netlify.app/docs/alias-configuration'
                                );
                            }}
                        >
                            Read the docs for more info.
                        </Link>
                    </Text>
                    <Flex flexGrow={1} flexDirection="column" marginTop="10px">
                        {pathMap.items.map(item => {
                            return (
                                <Flex
                                    key={item.id}
                                    alignItems="center"
                                    marginBottom="5px"
                                >
                                    <Input
                                        value={item.alias}
                                        placeholder="Alias"
                                        size="sm"
                                        marginRight="5px"
                                        onChange={(e: any) =>
                                            handleUpdate(
                                                item.id,
                                                e.target.value,
                                                item.path
                                            )
                                        }
                                    />
                                    <Input
                                        value={item.path}
                                        placeholder="Path"
                                        size="sm"
                                        onChange={(e: any) =>
                                            handleUpdate(
                                                item.id,
                                                item.alias,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <IconButton
                                        marginLeft="5px"
                                        aria-label="Search database"
                                        size="xs"
                                        icon="close"
                                        variant="outline"
                                        onClick={() => pathMap.remove(item.id)}
                                    />
                                </Flex>
                            );
                        })}
                    </Flex>
                    <Flex
                        justifyContent="flex-end"
                        marginTop="5px"
                        marginBottom="5px"
                    >
                        <Button
                            leftIcon="plus-square"
                            variant="outline"
                            size="xs"
                            onClick={() => pathMap.addNewItem('', '')}
                        >
                            Add another entry
                        </Button>
                    </Flex>

                    <Heading size="sm" fontWeight={400}>
                        Indexer
                    </Heading>
                    <Text fontSize="12px">Run the code indexer</Text>
                    <Button
                        size="sm"
                        marginTop="10px"
                        leftIcon={Play}
                        variant="outline"
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
