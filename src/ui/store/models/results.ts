import { observable, ObservableMap } from "mobx";
import { Flake } from "entities/Symbol";

export class Results {
  @observable
  public items = new ObservableMap();

  @observable
  public errorMessage: string | undefined = "";

  public setResult(id: string, results: Flake[]) {
    this.items.set(id, results);
  }

  public setErrorMessage(message: string | undefined) {
    this.errorMessage = message;
  }
}
