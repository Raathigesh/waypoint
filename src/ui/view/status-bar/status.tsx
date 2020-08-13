import React from 'react';
import { Flex } from '@chakra-ui/core';
import { useCSSVarColor } from '../components/useThemeColor';

interface Props {
    icon: any;
    label: string;
    rightActions: any;
}

export default function TopStatusBar({ icon, label, rightActions }: Props) {
    const fontColor = useCSSVarColor('text.primary');
    const borderBottomColor = useCSSVarColor('background.secondary');

    return (
        <Flex
            padding="9px"
            borderBottom="1px solid #F9F9F9"
            borderBottomColor={borderBottomColor}
            justifyContent="space-between"
        >
            <Flex alignItems="center">
                {icon}
                <Flex color={fontColor} ml="5px" fontSize="13px">
                    {label}
                </Flex>
            </Flex>
            {rightActions}
        </Flex>
    );
}
