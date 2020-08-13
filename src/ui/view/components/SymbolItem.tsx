import React, { useContext } from 'react';
import { PseudoBox, Flex, Box, IconButton, useToast } from '@chakra-ui/core';
import { Bookmark, Trash2, Plus, Copy } from 'react-feather';
import { Tooltip } from 'react-tippy';
import { openFile, insertImport } from 'ui/store/services/file';
import copy from 'copy-to-clipboard';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

import SymbolKindIcon from './SymbolKindIcon';
import { appStore } from 'ui/store';
import SymbolMenu from './SymbolMenu';
import { useCSSVarColor, LightenDarkenColor } from './useThemeColor';

interface ActionIconProps {
    tooltip: string;
    onClick: () => void;
    icon: any;
}

function ActionIcon({ tooltip, onClick, icon }: ActionIconProps) {
    const bg = useCSSVarColor('button.background');
    const foreground = useCSSVarColor('button.foreground');

    return (
        <Tooltip size="small" title={tooltip} position="bottom">
            <IconButton
                size="xs"
                onClick={(e: any) => {
                    e.stopPropagation();
                    onClick();
                }}
                backgroundColor={bg}
                color={foreground}
                border={`1px solid ${LightenDarkenColor(bg, 100)}`}
                aria-label="copy"
                icon={icon}
                marginLeft="10px"
                _hover={{
                    backgroundColor: LightenDarkenColor(bg, -20),
                }}
            />
        </Tooltip>
    );
}

export default function SymbolItem({
    filePath,
    location,
    kind,
    name,
    onBookmark,
    onRemoveBookmark,
}: {
    filePath: string;
    location: any;
    kind: string;
    name: string;
    onBookmark?: (name: string, path: string) => void;
    onRemoveBookmark?: (name: string, path: string) => void;
}) {
    const toast = useToast();
    const projectInfo = useContext(appStore);

    const id = `${name}${filePath}${
        onRemoveBookmark ? 'bookmark' : 'search'
    }${Math.random()}`;

    const copyImport = () => {
        insertImport(name, filePath).then(content => {
            copy(content);

            if (content.trim() === '') {
                toast({
                    description: 'Please select an active file.',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    description: 'Copied to clipboard',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
        });
    };

    const bg = useCSSVarColor('background.secondary');
    const fontColor = useCSSVarColor('text.primary');

    return (
        <PseudoBox
            p="7px"
            width="100%"
            marginBottom="2px"
            borderRadius="4px"
            bg={bg}
            cursor="pointer"
            _hover={{ backgroundColor: LightenDarkenColor(bg, -15) }}
            onClick={() => {
                openFile(filePath, location);
            }}
        >
            <ContextMenuTrigger id={id}>
                <Flex flexDirection="column">
                    <Flex alignItems="center" justifyContent="space-between">
                        <Flex
                            color="gray.800"
                            fontSize={12}
                            fontWeight={500}
                            marginRight="10px"
                            alignItems="center"
                        >
                            <SymbolKindIcon kind={kind} size="12px" />
                            <Box
                                marginLeft="5px"
                                color={fontColor}
                                fontWeight={600}
                                fontSize={13}
                            >
                                {name}
                            </Box>
                        </Flex>

                        <Flex marginRight="5px">
                            <ActionIcon
                                tooltip="Copy import statement to clipboard"
                                onClick={() => {
                                    copyImport();
                                }}
                                icon="copy"
                            />

                            {onBookmark && (
                                <ActionIcon
                                    tooltip="Add to bookmark"
                                    onClick={() => {
                                        onBookmark(name, filePath);
                                    }}
                                    icon={() => <Bookmark size={'11px'} />}
                                />
                            )}
                            {onRemoveBookmark && (
                                <ActionIcon
                                    tooltip="Remove from bookmark"
                                    onClick={() => {
                                        onRemoveBookmark(name, filePath);
                                    }}
                                    icon={() => <Trash2 size={'11px'} />}
                                />
                            )}
                        </Flex>
                    </Flex>
                    {filePath && (
                        <Flex
                            fontSize={11}
                            color={LightenDarkenColor(fontColor, 20)}
                        >
                            {filePath.replace(projectInfo.root, '')}
                        </Flex>
                    )}
                </Flex>
            </ContextMenuTrigger>
            <ContextMenu style={{ borderRadius: '3px' }} id={id}>
                {onBookmark && (
                    <MenuItem
                        onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            onBookmark(name, filePath);
                        }}
                    >
                        <SymbolMenu Icon={Bookmark} name="Bookmark" />
                    </MenuItem>
                )}
                {onRemoveBookmark && (
                    <MenuItem
                        onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            onRemoveBookmark(name, filePath);
                        }}
                        data={{ name, filePath }}
                    >
                        <SymbolMenu Icon={Trash2} name="Remove bookmark" />
                    </MenuItem>
                )}
                <MenuItem
                    onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        copyImport();
                    }}
                >
                    <SymbolMenu
                        Icon={Copy}
                        name="Copy import statement to clipboard"
                    />
                </MenuItem>
            </ContextMenu>
        </PseudoBox>
    );
}
