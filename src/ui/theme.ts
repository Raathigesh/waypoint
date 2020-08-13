import { theme } from '@chakra-ui/core';

const CSSVariableNames = {
    background: {
        primary: '--vscode-tab-activeBackground',
        secondary: '--vscode-list-hoverBackground',
    },
    input: {
        background: '--vscode-input-background',
        border: '--vscode-input-border',
    },
    button: {
        background: '--vscode-button-background',
        foreground: '--vscode-button-foreground',
    },
    text: {
        primary: '--vscode-list-activeSelectionForeground',
        secondary: '--vscode-list-inactiveSelectionForeground',
    },
};

const backupVSCodeColors = {
    background: {
        primary: getComputedStyle(document.documentElement).getPropertyValue(
            CSSVariableNames.background.primary
        ),
        secondary: getComputedStyle(document.documentElement).getPropertyValue(
            CSSVariableNames.background.secondary
        ),
    },
    input: {
        background: getComputedStyle(document.documentElement).getPropertyValue(
            CSSVariableNames.input.background
        ),
        border: getComputedStyle(document.documentElement).getPropertyValue(
            CSSVariableNames.input.border
        ),
    },
    button: {
        background: getComputedStyle(document.documentElement).getPropertyValue(
            CSSVariableNames.button.background
        ),
        foreground: getComputedStyle(document.documentElement).getPropertyValue(
            CSSVariableNames.button.foreground
        ),
    },
    text: {
        primary: getComputedStyle(document.documentElement).getPropertyValue(
            CSSVariableNames.text.primary
        ),
        secondary: getComputedStyle(document.documentElement).getPropertyValue(
            CSSVariableNames.text.secondary
        ),
    },
};

const colors = {
    ...theme.colors,
    background: {
        primary: `var(${CSSVariableNames.background.primary})`,
        secondary: `var(${CSSVariableNames.background.secondary})`,
    },
    input: {
        background: `var(${CSSVariableNames.input.background})`,
        border: `var(${CSSVariableNames.input.border})`,
    },
    button: {
        background: `var(${CSSVariableNames.button.background})`,
        foreground: `var(${CSSVariableNames.button.foreground})`,
    },
    text: {
        primary: `var(${CSSVariableNames.text.primary})`,
        secondary: `var(${CSSVariableNames.text.secondary})`,
    },
};

const vsCodeTheme = {
    ...theme,
    colors,
};
export default vsCodeTheme;

interface Theme {
    background: {
        primary: string;
        secondary: string;
    };
    input: {
        background: string;
        border: string;
    };
    button: {
        background: string;
        foreground: string;
    };
    text: {
        primary: string;
        secondary: string;
    };
}

function setThemeVariables(theme: Theme) {
    document.documentElement.style.setProperty(
        CSSVariableNames.background.primary,
        theme.background.primary
    );
    document.documentElement.style.setProperty(
        CSSVariableNames.background.secondary,
        theme.background.secondary
    );

    document.documentElement.style.setProperty(
        CSSVariableNames.input.background,
        theme.input.background
    );
    document.documentElement.style.setProperty(
        CSSVariableNames.input.border,
        theme.input.border
    );

    document.documentElement.style.setProperty(
        CSSVariableNames.button.background,
        theme.button.background
    );
    document.documentElement.style.setProperty(
        CSSVariableNames.button.foreground,
        theme.button.foreground
    );

    document.documentElement.style.setProperty(
        CSSVariableNames.text.primary,
        theme.text.primary
    );
    document.documentElement.style.setProperty(
        CSSVariableNames.text.secondary,
        theme.text.secondary
    );
}

const darkTheme: Theme = {
    background: {
        primary: '#1D1D1D',
        secondary: '#222322',
    },
    button: { background: '#008CFE', foreground: '#F9F9F9' },
    input: { background: '#0A0A0B', border: '#222322' },
    text: { primary: '#F9F9F9', secondary: '#F9F9F9' },
};
const lightTheme: Theme = {
    background: {
        primary: '#FFFFFF',
        secondary: '#f4f4f4',
    },
    button: { background: '#1A1A1A', foreground: '#F9F9F9' },
    input: { background: '#FFFFFF', border: '#E5E5E5' },
    text: { primary: '#1A1A1A', secondary: '#1A1A1A' },
};

export function switchTheme(theme: 'light' | 'dark' | 'vscode') {
    if (theme === 'light') {
        setThemeVariables(lightTheme);
    } else if (theme === 'dark') {
        setThemeVariables(darkTheme);
    } else if (theme === 'vscode') {
        setThemeVariables(backupVSCodeColors);
    }
}
