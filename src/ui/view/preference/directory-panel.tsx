import React, { Fragment } from 'react';
import {
    Heading,
    Link,
    Flex,
    Input,
    IconButton,
    Button,
    Text,
} from '@chakra-ui/core';
import { Instance, IMSTMap } from 'mobx-state-tree';
import { observer } from 'mobx-react-lite';

interface Props {
    header: any;
    entries: Instance<IMSTMap<any>>;
    addNewLabel: string;
    onChange: (id: string, value: string) => void;
    onRemove: (id: string) => void;
    onAdd: (value: string) => void;
}

function DirectoryPanel({
    header,
    entries,
    addNewLabel,
    onChange,
    onRemove,
    onAdd,
}: Props) {
    return (
        <Fragment>
            {header}
            <Flex flexGrow={1} flexDirection="column" marginTop="10px">
                {[...entries.entries()].map(([id, directory]) => {
                    return (
                        <Flex key={id} alignItems="center" marginBottom="5px">
                            <Input
                                backgroundColor="input.background"
                                borderColor="input.border"
                                value={directory}
                                placeholder="Directory"
                                size="sm"
                                marginRight="5px"
                                onKeyDown={(e: any) => e.stopPropagation()}
                                onChange={(e: any) => {
                                    onChange(id, e.target.value);
                                }}
                            />

                            <IconButton
                                marginLeft="5px"
                                aria-label="Search database"
                                size="xs"
                                icon="close"
                                variant="outline"
                                onClick={() => onRemove(id)}
                            />
                        </Flex>
                    );
                })}
            </Flex>
            <Flex justifyContent="flex-end" marginTop="5px" marginBottom="5px">
                <Button
                    backgroundColor="button.background"
                    color="button.foreground"
                    leftIcon="plus-square"
                    variant="outline"
                    size="xs"
                    onClick={() => onAdd('')}
                >
                    {addNewLabel}
                </Button>
            </Flex>
        </Fragment>
    );
}

export default observer(DirectoryPanel);
