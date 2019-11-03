import { computed, observable, action, reaction } from "mobx";

import { GqlSymbolInformation } from "entities/GqlSymbolInformation";
import { search } from "./api";
import { createTempFile } from "ui/EventBus";
import { performSearch } from "./utils";
import { UIState } from "../ui";
import { SearchResults } from "ui/store/models/SearchResults";

export class ResultsService {
  @observable
  public searchResults: SearchResults;

  @observable
  public searchQuery: string = "";

  @observable
  public uiState: UIState;

  constructor(searchResults: SearchResults, uiState: UIState) {
    this.searchResults = searchResults;
    this.uiState = uiState;

    reaction(
      () => this.searchQuery,
      async query => {
        const results = await performSearch(query, this.uiState);
        this.searchResults.setResults(results.items);
      }
    );
  }

  @action.bound
  public setSearchQuery(searchQuery: string) {
    this.searchQuery = searchQuery;
  }

  @action.bound
  public async search(query: string) {
    const results = await performSearch(query, this.uiState);
    return results.items.map(item => ({
      value: item.name,
      label: `${item.name} : ${item.filePath}`,
      symbol: item
    }));
  }
}
