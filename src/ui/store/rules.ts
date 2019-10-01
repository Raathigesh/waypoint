import { createModel } from "@rematch/core";

export type State = {
  rules: { [ruleName: string]: string };
};

export const Rules = createModel({
  state: {
    rules: {}
  } as State,
  reducers: {
    setRule(state: State, ruleName: string, ruleContent: string): State {
      state.rules[ruleName] = ruleContent;
      return state;
    }
  },
  effects: {}
});
