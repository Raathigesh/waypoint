import * as nanoid from "nanoid";
import { observable } from "mobx";

export default class Rule {
  @observable
  public id: string = nanoid();
  @observable
  public name: string = "";
  @observable
  public content: string = "";
}
