import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { resetConfig } from './store/services/config';

const params = new URLSearchParams(window.location.search);
if (params.has('resetConfig')) {
    resetConfig();
}

render(<App />, document.getElementById('root'));

if ((module as any).hot) {
    (module as any).hot.accept('./App', () => {
        const NextApp = require('./App').default;
        render(<NextApp />, document.getElementById('root'));
    });
}
