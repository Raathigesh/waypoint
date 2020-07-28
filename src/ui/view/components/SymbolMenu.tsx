import React from 'react';
import { PseudoBox, Flex, Box } from '@chakra-ui/core';

interface Props {
    name: string;
    Icon: any;
}

export default function SymbolMenu({ Icon, name }: Props) {
    return (
        <PseudoBox
            style={{
                backgroundColor: '#4299e1',
                padding: '2px',
                borderRadius: '0px 0px 0px 0px',
                color: 'white',
                fontSize: '12px',
            }}
        >
            <PseudoBox
                alignItems="center"
                borderRadius="3px"
                display="flex"
                padding="5px"
                _hover={{
                    backgroundColor: '#90cdf4 !important',
                }}
            >
                <Icon size={12} strokeWidth="2px" />
                <Box ml="5px">{name}</Box>
            </PseudoBox>
        </PseudoBox>
    );
}
