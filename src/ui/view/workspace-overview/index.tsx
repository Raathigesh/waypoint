import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { File, Folder } from 'react-feather';
import { Flex, PseudoBox } from '@chakra-ui/core';
import { workspaceStore, appStore } from 'ui/store';
import { openFile } from 'ui/store/services/file';

interface TreeNode {
    name: string;
    type: string;
    path: string;
    children: TreeNode[];
}

function ensurePath(root: TreeNode | null, path: string, tokens: string[]) {
    const currentToken = tokens.shift();
    const isAFile = tokens.length === 0 && (currentToken || '').includes('.');

    let hasTokenChildren =
        root && root.name === currentToken
            ? root
            : root &&
              (root.children || []).find(child => child.name === currentToken);

    if (!hasTokenChildren) {
        hasTokenChildren = {
            name: currentToken || '',
            path,
            type: isAFile ? 'file' : 'directory',
            children: [],
        };

        if (root) {
            root.children?.push(hasTokenChildren);
        } else {
            root = hasTokenChildren;
        }
    }

    if (tokens.length !== 0) {
        ensurePath(hasTokenChildren, path, tokens);
    }

    return root;
}

export function constructTree(
    paths: string[],
    separator: string
): TreeNode | null {
    let tree: TreeNode | null = null;

    paths.forEach(item => {
        const tokens = item
            .split(separator)
            .filter(token => token.trim() !== '');
        tree = ensurePath(tree, item, tokens);
    });

    return tree;
}

function Row({ tree }: { tree: TreeNode | null }) {
    const app = useContext(appStore);

    if (tree === null) {
        return null;
    }

    const Icon = tree.type === 'file' ? File : Folder;
    return (
        <Flex flexDir="column" ml="15px">
            <PseudoBox
                display="flex"
                alignItems="center"
                cursor="pointer"
                padding="3px"
                onClick={() => {
                    openFile(`${app.root}${tree.path}`, {
                        start: {
                            line: 1,
                            column: 1,
                        },
                        end: {
                            line: 1,
                            column: 1,
                        },
                    });
                }}
                borderRadius="3px"
                _hover={{
                    backgroundColor: 'background.secondary',
                }}
            >
                <Icon size="15px" />
                <Flex ml="5px">{tree.name}</Flex>
            </PseudoBox>
            {tree.children.map(child => (
                <Row tree={child} />
            ))}
        </Flex>
    );
}

function WorkspaceOverview() {
    const workspace = useContext(workspaceStore);
    const app = useContext(appStore);
    const textDocs = workspace.textDocuments
        .filter(doc => {
            const extension = doc.split('.').pop();
            return ['js', 'tsx', 'txt', 'ts'].includes(extension || '');
        })
        .map(doc => doc.replace(app.root, ''));
    const tree = constructTree(textDocs, app.separator);

    return (
        <div>
            <Row tree={tree} />
        </div>
    );
}

export default observer(WorkspaceOverview);
