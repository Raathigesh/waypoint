import * as nanoid from "nanoid";
import { observable, computed } from "mobx";
import ColumnDefinition from "./ColumnDefinition";

export default class Rule {
  @observable
  public id: string = nanoid();
  @observable
  public name: string = "";
  @observable
  public content: string = "";

  @computed
  public get columnDefinitions() {
    try {
      const viewFunction = eval(`(${this.content})`);
      const view = viewFunction();

      if (view.columnDefinitions) {
        return view.columnDefinitions.map((columnDefinition: any) => {
          const definition = new ColumnDefinition();
          definition.key = columnDefinition.key;
          definition.type = columnDefinition.type;
          definition.title = columnDefinition.title;
          definition.initialWidth = columnDefinition.initialWidth;
          return definition;
        });
      }
    } catch (e) {
      console.log(e);
    }

    return [];
  }
}
