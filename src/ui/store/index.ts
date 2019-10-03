import { init, RematchRootState } from "@rematch/core";
import immerPlugin from "@rematch/immer";
import createRematchPersist from "@rematch/persist";
import storage from "redux-persist/lib/storage";
import { Rules } from "./rules";
import { Results } from "./results";
import { saveValue, getValue } from "ui/services/workplace-state";

const models = {
  Rules,
  Results
};

const persistPlugin = createRematchPersist({
  whitelist: ["Rules"],
  throttle: 5000,
  version: 1,
  storage: {
    async setItem(key: string, value: string) {
      return await saveValue(key, value);
    },
    async getItem(key: string) {
      return await getValue(key);
    },
    async removeItem(key: string) {}
  }
});

export const store = init({
  models,
  plugins: [persistPlugin]
});

export type Store = typeof store;
export type Dispatch = typeof store.dispatch;
export type RootState = RematchRootState<typeof models>;
