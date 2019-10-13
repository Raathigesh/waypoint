import { createContext } from "react";
import { Rules } from "./models/rules";
import { Results } from "./models/results";
import { RulesService } from "./services/rules";
import { ResultsService } from "./services/results";

const rules = new Rules();
export const RulesStore = createContext(rules);

const results = new Results();
export const ResultsStore = createContext(results);

export const rulesService = new RulesService(rules, results);
export const RulesServiceStore = createContext(rulesService);

export const resultsService = new ResultsService(results, rules);
export const ResultsServiceStore = createContext(resultsService);
