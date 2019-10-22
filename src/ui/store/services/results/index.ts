import { Results } from "../../models/results";
import { computed, observable, action } from "mobx";
import { Rules } from "../../models/rules";
import { Flake } from "entities/Symbol";
import { search } from "./api";
import { createTempFile } from "ui/EventBus";
import { performSearch } from "./utils";
import { UIState } from "../ui";

export class ResultsService {
  @observable
  public results: Results;

  @observable
  public rules: Rules;

  @observable
  public searchQuery: string = "";

  @observable
  public uiState: UIState;

  constructor(results: Results, rules: Rules, uiState: UIState) {
    this.results = results;
    this.rules = rules;
    this.uiState = uiState;
  }

  @action.bound
  public setSearchQuery(searchQuery: string) {
    this.searchQuery = searchQuery;
  }

  @action.bound
  public async editRule() {
    if (this.rules.activeRule) {
      createTempFile(this.rules.activeRule.content, async updatedContent => {
        if (
          this.rules.activeRule &&
          this.rules.activeRule.content !== updatedContent
        ) {
          this.rules.activeRule.content = updatedContent;
          const results = await performSearch(
            this.rules.activeRule.content,
            this.uiState
          );
          this.results.setResult(this.rules.activeRule.id, results.items);
          this.results.setErrorMessage(results.errorMessage);
        }
      });
    }
  }

  @computed
  public get activeResults(): Flake[] {
    return this.results.items.get(this.rules.activeRuleId) || [];
  }

  @computed
  public get searchResults() {
    return this.activeResults.filter(result =>
      result.name
        .toLocaleLowerCase()
        .includes(this.searchQuery.toLocaleLowerCase())
    );
  }

  @computed
  public get errorMessage() {
    return this.results.errorMessage;
  }
}
