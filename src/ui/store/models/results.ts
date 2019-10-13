import { observable, ObservableMap } from "mobx";
import { Flake } from "entities/Symbol";

export class Results {
  @observable
  public items = new ObservableMap();

  public setResult(id: string, results: Flake[]) {
    this.items.set(id, results);
  }
}
