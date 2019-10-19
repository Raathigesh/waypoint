import { action, observable } from "mobx";

export class UIState {
  @observable
  public isResultLoading: boolean = false;
  @observable
  public isIndexing: boolean = false;

  @action.bound
  public setLoading(isResultLoading: boolean) {
    this.isResultLoading = isResultLoading;
  }

  @action.bound
  public setIsIndexing(isIndexing: boolean) {
    this.isIndexing = isIndexing;
  }
}
