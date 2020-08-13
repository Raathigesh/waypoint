import { useContext } from 'react';
import { preferenceStore } from 'ui/store';
import { useObserver } from 'mobx-react-lite';
import { useTheme } from '@chakra-ui/core';

export function useCSSVarColor(key: string) {
    const theme = useTheme();

    return useObserver(() => {
        const preference = useContext(preferenceStore);
        const themeName = preference.theme;

        const cssVarName: string = (theme.colors as any)[key.split('.')[0]][
            key.split('.')[1]
        ];

        const justVarName = cssVarName.replace('var(', '').replace(')', '');

        return getComputedStyle(document.documentElement).getPropertyValue(
            justVarName
        );
    });
}

// https://css-tricks.com/snippets/javascript/lighten-darken-color/
export function LightenDarkenColor(col: string, amt: number) {
    var usePound = false;

    if (col[0] == '#') {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col, 16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00ff) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000ff) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
}
