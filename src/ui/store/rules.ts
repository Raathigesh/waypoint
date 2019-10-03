import { createModel } from "@rematch/core";
import * as nanoid from "nanoid";

export type State = {
  activeRule: string;
  rules: {
    [ruleId: string]: {
      name: string;
      content: string;
    };
  };
};

export const Rules = createModel({
  state: {
    activeRule: "initialRule",
    rules: {
      initialRule: {
        name: "Untitled rule",
        content: ""
      }
    }
  } as State,
  reducers: {
    setActiveRule(state, ruleId: string) {
      return {
        ...state,
        activeRule: ruleId
      };
    },
    setRule(state, name: string, content: string): State {
      const id = nanoid();
      return {
        ...state,
        rules: {
          ...state.rules,
          [id]: {
            name,
            content
          }
        }
      };
    },
    renameRule(state, id: string, name: string) {
      return {
        ...state,
        rules: {
          ...state.rules,
          [id]: {
            name,
            content: state.rules[id].content
          }
        }
      };
    },
    setContent(state, id: string, content: string) {
      return {
        ...state,
        rules: {
          ...state.rules,
          [id]: {
            name: state.rules[id].name,
            content
          }
        }
      };
    },
    deleteRule(state, id: string) {
      return {
        ...state,
        rules: Object.entries(state.rules).reduce(
          (acc, [key, value]) => {
            if (key !== id) {
              return {
                ...acc,
                [key]: value
              };
            }
          },
          {} as any
        )
      };
    }
  },
  effects: {}
});
