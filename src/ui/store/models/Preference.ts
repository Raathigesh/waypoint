import { types, flow } from "mobx-state-tree";
import { getPreference } from "../services/config";

export interface PreferenceJSON {
  startIndexingOnStarUp: boolean;
}

export const Preference = types
  .model("Preference", {
    startIndexingOnStarUp: types.boolean
  })
  .actions(self => {
    const afterCreate = flow(function*() {
      const preference: PreferenceJSON = yield getPreference();
      self.startIndexingOnStarUp = preference.startIndexingOnStarUp || false;
    });

    const getPersistableJson = () => ({
      startIndexingOnStarUp: self.startIndexingOnStarUp
    });

    const setIndexingOnStartUp = (status: boolean) => {
      self.startIndexingOnStarUp = status;
    };

    return {
      afterCreate,
      getPersistableJson,
      setIndexingOnStartUp
    };
  });
