import { init, RematchRootState } from "@rematch/core";
import immerPlugin from "@rematch/immer";
import createRematchPersist from "@rematch/persist";
import storage from "redux-persist/lib/storage";
import { Rules } from "./rules";
import { Results } from "./results";
import { getWorkspaceState, setWorkspaceState } from "ui/EventBus";

const models = {
  Rules,
  Results
};

const persistPlugin = createRematchPersist({
  whitelist: ["Rules"],
  throttle: 5000,
  version: 1,
  storage: storage /* {
    async setItem(key: string, value: string) {
      debugger;
      const workplaceState: any = await getWorkspaceState();
      workplaceState[key] = value;
      await setWorkspaceState(workplaceState);
    },
    async getItem(key: string) {
      debugger;
      const workplaceState: any = await getWorkspaceState();
      return workplaceState[key];
    },
    async removeItem(key: string) {
      debugger;
      const workplaceState: any = await getWorkspaceState();
      delete workplaceState[key];
      await setWorkspaceState(workplaceState);
    }
  } */
});

export const store = init({
  models,
  plugins: [persistPlugin, immerPlugin()]
});

export type Store = typeof store;
export type Dispatch = typeof store.dispatch;
export type RootState = RematchRootState<typeof models>;
