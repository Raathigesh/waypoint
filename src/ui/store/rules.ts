import { createModel } from "@rematch/core";

export type State = {
  rules: { [ruleName: string]: string };
};

export const Rules = createModel({
  state: {
    rules: {}
  } as State,
  reducers: {
    setRule(state: State, rule: string): State {
      state.rules[rule] = rule;
      return state;
    }
  },
  effects: {}
});
