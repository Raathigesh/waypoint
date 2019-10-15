import { observable } from "mobx";

export default class ColumnDefinition {
  @observable
  public key: string = "";

  @observable
  public type: string = "";

  @observable
  public title: string = "";

  @observable
  public initialWidth: string = "";
}
