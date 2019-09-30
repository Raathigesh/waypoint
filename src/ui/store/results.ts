import { createModel } from "@rematch/core";
import { Flake } from "entities/Symbol";

export type State = {
  activeRule: string;
  rules: { [ruleName: string]: { items: Flake[] } };
};

export const Results = createModel({
  state: {
    activeRule: "",
    rules: {}
  } as State,
  reducers: {
    setActiveRule(state: State, activeRule: string): State {
      state.activeRule = activeRule;
      return state;
    },
    setRuleResults(
      state: State,
      { ruleName, results }: { ruleName: string; results: Flake[] }
    ): State {
      if (!state.rules[ruleName]) {
        state.rules[ruleName] = {
          items: []
        };
      }
      state.rules[ruleName].items = results;
      return state;
    }
  },
  effects: {}
});
