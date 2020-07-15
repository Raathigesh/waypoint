import React, { useState, useRef, useContext } from 'react';
import { Flex, Box, Text } from '@chakra-ui/core';
import { Filter, Search, Code } from 'react-feather';
import debounce from 'lodash.debounce';

import { Search as SearchIcon, CornerDownLeft } from 'react-feather';
import { searchSymbol } from 'ui/store/services/search';
import { GqlSymbolInformation } from 'entities/GqlSymbolInformation';
import Select from 'react-select/creatable';
import SymbolItem from '../components/SymbolItem';
import { observer } from 'mobx-react-lite';
import { bookmarksStore } from 'ui/store';
import WidgetFrame from '../components/WidgetFrame';

export interface SearchResult {
    value: string;
    label: string;
    path: string;
    symbol: GqlSymbolInformation;
    type: string;
    kind: string;
}

export default observer(function SymbolSearch() {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [options, setOptions] = useState([]);
    const bookmarks = useContext(bookmarksStore);
    const [inputValue, setInputValue] = useState('');

    const promiseOptions = useRef(
        debounce(async (inputValue: string, type: string) => {
            const results = await searchSymbol(inputValue, type);
            const resultOptions = results.items.map(item => ({
                value: item.name,
                label: `${item.name} : ${item.filePath}`,
                path: item.filePath,
                symbol: item,
                kind: item.kind,
                type: item.kind,
            }));
            setResults(resultOptions);
        }, 300)
    ).current;

    const customStyles = {
        container: (provided: any) => ({
            ...provided,
            width: '100%',
            borderColor: '#f0f0f0',
        }),
        control: (provided: any) => ({
            ...provided,
            borderColor: 'inherit',
            borderRadius: '4px 4px 0px 0px',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#f0f0f0',
            },
        }),
        menu: (provided: any) => ({
            ...provided,
            backgroundColor: '#ffff',
            boxShadow: 'none',
            position: 'initial',
            marginTop: '0px',
            borderRadius: '0px 0px 4px 4px',
            borderStyle: 'solid',
            borderWidth: '0px 1px 1px 1px',
            borderColor: '#f0f0f0',
        }),
        option: (provided: any) => ({
            ...provided,
        }),
        multiValue: (provided: any) => ({
            ...provided,
            backgroundColor: '#eaf2fc',
            borderRadius: '3px',
        }),
        input: (provided: any) => ({
            ...provided,
            color: '#666666',
        }),
        noOptionsMessage: (provided: any) => ({
            ...provided,
            fontSize: '13px',
        }),
        placeholder: (provided: any) => ({
            ...provided,
            fontSize: '13px',
        }),
    };

    const SearchIconComponent = () => (
        <Box marginRight={3}>
            <SearchIcon size={14} />
        </Box>
    );

    const formatOptionLabel = (item: any, options: any) => {
        const Icon = item.Icon || Search;
        return (
            <Flex alignItems="center" justifyContent="space-between">
                <Flex alignItems="center">
                    <Flex marginRight="5px" marginTop="1px">
                        <Icon kind={item.kind} size="12px" />
                    </Flex>
                    <Flex color="gray.800" fontSize={13} mr="1px">
                        {item.label}
                    </Flex>
                </Flex>
                {options.context === 'menu' && (
                    <Flex>
                        <CornerDownLeft color="#718096" size="12px" />
                    </Flex>
                )}
            </Flex>
        );
    };

    return (
        <WidgetFrame
            title="Search"
            subTitle="Search symbols across your codebase"
            Icon={Code}
            mb="8px"
        >
            <Select
                formatCreateLabel={(value: string) => {
                    if (value.startsWith('/')) {
                        return `Search for ${value}`;
                    }

                    return (
                        <Flex alignItems="center">
                            <Flex>
                                <Text
                                    isTruncated
                                    color="#2a69ac"
                                    ml="5px"
                                    fontSize="12px"
                                >
                                    <Flex>
                                        Press{' '}
                                        <Text
                                            fontWeight={700}
                                            ml="5px"
                                            mr="5px"
                                        >
                                            enter
                                        </Text>{' '}
                                        (
                                        <CornerDownLeft
                                            color="#718096"
                                            size="12px"
                                            style={{ marginTop: '5px' }}
                                        />
                                        ) and type{' '}
                                        <Text
                                            fontWeight={700}
                                            ml="5px"
                                            mr="5px"
                                        >
                                            /
                                        </Text>{' '}
                                        to apply filters
                                    </Flex>
                                </Text>
                            </Flex>
                        </Flex>
                    );
                }}
                inputValue={inputValue}
                menuIsOpen
                isMulti
                formatOptionLabel={formatOptionLabel}
                options={[
                    {
                        value: 'type',
                        label: 'Type',
                        filter: true,
                        Icon: Filter,
                    },
                    {
                        value: 'class',
                        label: 'Class',
                        filter: true,
                        Icon: Filter,
                    },
                    { value: 'var', label: 'Var', filter: true, Icon: Filter },
                    {
                        value: 'func',
                        label: 'Function',
                        filter: true,
                        Icon: Filter,
                    },
                ]}
                styles={customStyles}
                placeholder="Search here..."
                noOptionsMessage={() =>
                    "Start searching or add filter by typing '/'"
                }
                isClearable
                value={options}
                components={{
                    DropdownIndicator: SearchIconComponent,
                    IndicatorSeparator: () => null,
                }}
                onChange={(options: any[]) => {
                    if (!options) {
                        setOptions([]);
                        return;
                    }
                    let foundFirstNew = false;
                    const filtered = options
                        .reverse()
                        .filter(option => {
                            if (option['__isNew__'] && !foundFirstNew) {
                                foundFirstNew = true;
                                return true;
                            }
                            return true;
                        })
                        .reverse();
                    setOptions(filtered as any);
                    const createdOption = options.find(
                        (option: any) => option['__isNew__']
                    );
                    if (createdOption) {
                        promiseOptions(
                            createdOption.value,
                            options
                                .filter((option: any) => option.filter)
                                .map(item => item.value)
                                .join(':')
                        );
                    }
                }}
                filterOption={(option: any, value: string) => {
                    return (
                        (value.startsWith('/') && option.data.filter) ||
                        option.data['__isNew__']
                    );
                }}
                onInputChange={(input: string, context: any) => {
                    if (
                        context.action === 'input-blur' ||
                        context.action === 'menu-close'
                    ) {
                        return;
                    }

                    setInputValue(input);
                    let query = '';
                    if (input.startsWith('/') || input.trim() === '') {
                        const queryOption: any = options.find(
                            option => option['__isNew__']
                        );
                        if (queryOption) {
                            query = queryOption.value;
                        }
                    } else if (input.trim() !== '') {
                        query = input;
                        const filtered = options.filter(
                            option => !option['__isNew__']
                        );
                        setOptions(filtered);
                    }

                    promiseOptions(
                        query,
                        options
                            .filter((option: any) => option.filter)
                            .map((item: any) => item.value)
                            .join(':')
                    );
                }}
            />

            <Flex direction="column" mt="5px" overflowY="auto">
                {results.map(item => {
                    return (
                        <SymbolItem
                            filePath={item.symbol.filePath}
                            name={item.symbol.name}
                            location={item.symbol.location}
                            kind={item.symbol.kind}
                            onBookmark={(name, path) => {
                                bookmarks.addBookmark(name, path);
                            }}
                        />
                    );
                })}
            </Flex>
        </WidgetFrame>
    );
});
