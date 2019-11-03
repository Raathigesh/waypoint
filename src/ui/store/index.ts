import { createContext } from "react";
import { SearchResults } from "./models/SearchResults";
import { ResultsService } from "./services/results";
import { UIState } from "./services/ui";
import { ReferenceService } from "./services/references";

const ui = new UIState();
export const UIStore = createContext(ui);

const searchResults = new SearchResults();
export const SearchResultStore = createContext(searchResults);

export const resultsService = new ResultsService(searchResults, ui);
export const ResultsServiceStore = createContext(resultsService);

export const referenceService = new ReferenceService();
export const ReferenceServiceStore = createContext(referenceService);
