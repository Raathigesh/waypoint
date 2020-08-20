import { types, flow } from 'mobx-state-tree';
import { getPreference } from '../services/config';
import { switchTheme } from 'ui/theme';

export interface PreferenceJSON {
    startIndexingOnStarUp: boolean;
    theme?: string;
}

export const Preference = types
    .model('Preference', {
        startIndexingOnStarUp: types.boolean,
        theme: types.maybe(types.string),
    })
    .actions(self => {
        const afterCreate = flow(function*() {
            const preference: PreferenceJSON = yield getPreference();
            self.startIndexingOnStarUp =
                preference.startIndexingOnStarUp || false;
            self.theme = preference.theme || 'light';
            switchTheme(self.theme as any);
        });

        const getPersistableJson = () => ({
            startIndexingOnStarUp: self.startIndexingOnStarUp,
            theme: self.theme,
        });

        const setIndexingOnStartUp = (status: boolean) => {
            self.startIndexingOnStarUp = status;
        };

        const setTheme = (theme: string) => {
            self.theme = theme;
            switchTheme(self.theme as any);
        };

        return {
            afterCreate,
            getPersistableJson,
            setIndexingOnStartUp,
            setTheme,
        };
    });
