import React, { useContext, Fragment } from 'react';
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
    Switch,
    RadioGroup,
    Radio,
} from '@chakra-ui/core';
import {
    pathMapStore,
    indexerStatusStore,
    appStore,
    preferenceStore,
} from 'ui/store';
import { Coffee, Activity, Play } from 'react-feather';
import { openURL } from 'ui/store/services/misc';
import DirectoryPanel from './directory-panel';

interface Props {
    isOpen?: boolean;
    onClose?: () => void;
}

function Preference({ isOpen, onClose }: Props) {
    const pathMap = useContext(pathMapStore);
    const app = useContext(appStore);
    const indexerStatus = useContext(indexerStatusStore);
    const preference = useContext(preferenceStore);

    const handleUpdate = (id: string, alias: string, path: string) => {
        pathMap.update(id, alias, path);
    };

    return (
        <Drawer size="lg" isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent
                backgroundColor="background.primary"
                color="text.primary"
            >
                <DrawerCloseButton />
                <DrawerHeader fontWeight={400}>Preference</DrawerHeader>

                <DrawerBody>
                    <DirectoryPanel
                        entries={app.directories}
                        header={
                            <Fragment>
                                <Heading size="sm" fontWeight={400}>
                                    Folders to index
                                </Heading>
                                <Text fontSize="12px">
                                    Path should be relative to the folder opened
                                    in VSCode.{' '}
                                    <Link
                                        fontWeight={600}
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
                            </Fragment>
                        }
                        addNewLabel="Add another folder"
                        onAdd={value => {
                            app.addDirectory(value);
                        }}
                        onChange={(id, value) => {
                            app.changeDirectory(id, value);
                        }}
                        onRemove={id => {
                            app.removeDirectory(id);
                        }}
                    />

                    <DirectoryPanel
                        entries={app.excludedDirectories}
                        header={
                            <Fragment>
                                <Heading size="sm" fontWeight={400}>
                                    Folders to exclude
                                </Heading>
                                <Text fontSize="12px">
                                    Path should be relative to the folder opened
                                    in VSCode.
                                </Text>
                            </Fragment>
                        }
                        addNewLabel="Add another excluded folder"
                        onAdd={value => {
                            app.addExcludedDirectory(value);
                        }}
                        onChange={(id, value) => {
                            app.changeExcludedDirectory(id, value);
                        }}
                        onRemove={id => {
                            app.removeExcludedDirectory(id);
                        }}
                    />

                    <Heading size="sm" fontWeight={400}>
                        Import alias configuration
                    </Heading>
                    <Text fontSize="12px">
                        If you use custom module alias in your bundler, add them
                        here. First value is the alias (e.g: components). The
                        second value is the relative path which points to the
                        actual directory (e.g: ./src/components).{' '}
                        <Link
                            fontWeight={600}
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
                                        backgroundColor="input.background"
                                        borderColor="input.border"
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
                                        backgroundColor="input.background"
                                        borderColor="input.border"
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
                            backgroundColor="button.background"
                            color="button.foreground"
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
                        backgroundColor="button.background"
                        color="button.foreground"
                        size="sm"
                        marginTop="10px"
                        leftIcon={Play}
                        variant="outline"
                        onClick={() => indexerStatus.initiateIndexing()}
                    >
                        Start Indexing
                    </Button>

                    <Flex flexDir="column" mt="35px">
                        <Heading size="sm" fontWeight={400}>
                            Theme
                        </Heading>
                        <Text fontSize="12px" mb="5px">
                            Enable dark theme
                        </Text>
                        <RadioGroup
                            isInline
                            size="sm"
                            onChange={(e: any) => {
                                preference.setTheme(e.target.value);
                            }}
                            value={preference.theme}
                        >
                            <Radio value="light">Light</Radio>
                            <Radio value="dark">Dark</Radio>
                            <Radio value="vscode">Use VSCode Theme</Radio>
                        </RadioGroup>
                    </Flex>
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
