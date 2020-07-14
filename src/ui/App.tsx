import React, { Fragment } from 'react';
import { observer } from 'mobx-react-lite';
import 'react-tippy/dist/tippy.css';
import { ThemeProvider as ChakraProvider, CSSReset } from '@chakra-ui/core';

import View from './view';
import lightTheme from './theme';
import { VSCodeStyleOverride } from './view/VSCodeStyleOverride';

function App() {
    return (
        <Fragment>
            <ChakraProvider theme={lightTheme}>
                <CSSReset />
                <VSCodeStyleOverride />
                <View />
            </ChakraProvider>
        </Fragment>
    );
}

export default observer(App);
