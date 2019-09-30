import { init, RematchRootState } from "@rematch/core";
import immerPlugin from "@rematch/immer";
import createRematchPersist from "@rematch/persist";
import { Rules } from "./rules";
import { Results } from "./results";
import { getWorkspaceState, setWorkspaceState } from "ui/EventBus";

const models = {
  Rules,
  Results
};

const persistPlugin = createRematchPersist({
  whitelist: ["rules"],
  throttle: 5000,
  version: 1,
  storage: {
    async setItem(key: string, value: string) {
      const workplaceState: any = await getWorkspaceState();
      workplaceState[key] = value;
      await setWorkspaceState(workplaceState);
    },
    async getItem(key: string) {
      const workplaceState: any = await getWorkspaceState();
      return workplaceState[key];
    },
    async removeItem(key: string) {
      const workplaceState: any = await getWorkspaceState();
      delete workplaceState[key];
      await setWorkspaceState(workplaceState);
    }
  }
});

export const store = init({
  models,
  plugins: [immerPlugin(), persistPlugin]
});

export type Store = typeof store;
export type Dispatch = typeof store.dispatch;
export type RootState = RematchRootState<typeof models>;
