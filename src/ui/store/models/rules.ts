import { observable, IObservableArray, computed, action } from "mobx";
import * as nanoid from "nanoid";
import Rule from "./rule";
import { InitialFileContent } from "ui/Const";

export class Rules {
  @observable
  public activeRuleId: string = "";
  @observable
  public items: IObservableArray<Rule> = observable([]);

  @action.bound
  public createRule(name: string, content?: string) {
    const rule = new Rule();
    rule.id = nanoid();
    rule.name = name;
    rule.content = content || InitialFileContent;
    this.items.push(rule);
    return rule;
  }

  @computed
  public get activeRule() {
    return this.findRuleById(this.activeRuleId);
  }

  public findRuleById(id: string) {
    return this.items.find(item => item.id === id);
  }

  @action.bound
  public setActiveRule(ruleId: string) {
    this.activeRuleId = ruleId;
  }

  @action.bound
  public deleteRule(id: string) {
    const rule = this.findRuleById(id);
    if (rule) {
      this.items.remove(rule);
    }
  }

  @action.bound
  public renameRule(ruleId: string, name: string) {
    const rule = this.findRuleById(ruleId);
    if (rule) {
      rule.name = name;
    }
  }

  @action.bound
  public setRuleContent(ruleId: string, content: string) {
    const rule = this.findRuleById(ruleId);
    if (rule) {
      rule.content = content;
    }
  }
}
