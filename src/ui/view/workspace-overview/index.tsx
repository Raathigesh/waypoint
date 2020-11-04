import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { File, Folder, Code } from 'react-feather';
import { Flex, PseudoBox } from '@chakra-ui/core';
import { workspaceStore, appStore } from 'ui/store';
import { openFile } from 'ui/store/services/file';
import SymbolKindIcon from '../components/SymbolKindIcon';

function Items({ header, items }: any) {
    return (
        <Flex flexDir="column" fontSize="15px" mb="20px">
            {header}
            <Flex flexDir="column">
                {items.map((item: any) => (
                    <PseudoBox
                        display="flex"
                        marginLeft="10px"
                        borderRadius="3px"
                        cursor="pointer"
                        alignItems="center"
                        fontSize="14px"
                        padding="5px"
                        _hover={{
                            backgroundColor: 'button.foreground',
                        }}
                        onClick={() => {
                            openFile(item.filePath, item.location);
                        }}
                    >
                        <SymbolKindIcon kind={item.kind} size="12px" />
                        <Flex ml="5px" pb="2px">
                            {item.name}
                        </Flex>
                    </PseudoBox>
                ))}
            </Flex>
        </Flex>
    );
}

function WorkspaceOverview() {
    const workspace = useContext(workspaceStore);
    const app = useContext(appStore);
    const groupedItems = workspace.entries.reduce((acc: any, item) => {
        if (!acc[item.filePath]) {
            acc[item.filePath] = [];
        }
        acc[item.filePath].push(item);
        return acc;
    }, {});

    return (
        <Flex padding="10px" flexDir="column">
            {Object.entries(groupedItems).map(([key, items]) => {
                return (
                    <Items header={key.replace(app.root, '')} items={items} />
                );
            })}
        </Flex>
    );
}

export default observer(WorkspaceOverview);
