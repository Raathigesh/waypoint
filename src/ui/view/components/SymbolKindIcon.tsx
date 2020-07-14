import React from 'react';
import { Code, Square, Box, Type, Minus, Package, File } from 'react-feather';
import { Tooltip } from 'react-tippy';
import { Flex } from '@chakra-ui/core';

interface Props {
    kind: string | undefined;
    size: string;
}

const Icon = ({ children, color }: any) => (
    <Flex
        borderRadius="3px"
        padding="3px"
        alignItems="center"
        justifyContent="center"
        width="18px"
        height="18px"
        backgroundColor="#ececec"
        color={color}
        fontSize={14}
    >
        {children}
    </Flex>
);

export default function SymbolKindIcon({ kind, size }: Props) {
    if (kind === 'FunctionDeclaration') {
        return (
            <Tooltip
                size="small"
                title="Function declaration"
                position="bottom"
            >
                <Icon color="blue.500">f</Icon>
            </Tooltip>
        );
    } else if (kind === 'VariableDeclaration') {
        return (
            <Tooltip
                size="small"
                title="Variable declaration"
                position="bottom"
            >
                <Icon color="green.500">v</Icon>
            </Tooltip>
        );
    } else if (kind === 'ClassDeclaration') {
        return (
            <Tooltip size="small" title="Class declaration" position="bottom">
                <Icon color="orange.500">C</Icon>
            </Tooltip>
        );
    } else if (kind === 'TypeAlias') {
        return (
            <Tooltip size="small" title="Type declaration" position="bottom">
                <Icon color="purple.500">T</Icon>
            </Tooltip>
        );
    }

    return (
        <Tooltip size="small" title="File" position="bottom">
            <File size={size} />
        </Tooltip>
    );
}
