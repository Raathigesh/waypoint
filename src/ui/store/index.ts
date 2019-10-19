import { createContext } from "react";
import { Rules } from "./models/rules";
import { Results } from "./models/results";
import { RulesService } from "./services/rules";
import { ResultsService } from "./services/results";
import { UIState } from "./services/ui";

const ui = new UIState();
export const UIStore = createContext(ui);

const rules = new Rules();
export const RulesStore = createContext(rules);

const results = new Results();
export const ResultsStore = createContext(results);

export const rulesService = new RulesService(rules, results, ui);
export const RulesServiceStore = createContext(rulesService);

export const resultsService = new ResultsService(results, rules, ui);
export const ResultsServiceStore = createContext(resultsService);
