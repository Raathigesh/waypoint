import { observable, IObservableArray } from "mobx";
import { GqlSymbolInformation } from "entities/GqlSymbolInformation";

export class SearchResults {
  @observable
  public results: IObservableArray<GqlSymbolInformation> = observable([]);

  public setResults(results: GqlSymbolInformation[]) {
    this.results.clear();
    this.results.push(...results);
  }
}
