import { observable, IObservableArray, computed } from "mobx";
import * as nanoid from "nanoid";
import { deepObserve } from "mobx-utils";
import Rule from "./rule";
import { saveValue, getValue } from "ui/services/workplace-state";
import { InitialFileContent } from "ui/Const";

export class Rules {
  @observable
  public activeRule: string = "";
  @observable
  public rules: IObservableArray<Rule> = observable([]);

  constructor() {
    this.initialize();
  }

  private async initialize() {
    let rulesString: any = await getValue("insight-rules");
    if (rulesString === "") {
      rulesString = "[]";
    }

    const ruleObj = JSON.parse(rulesString);
    if (ruleObj.length === 0) {
      const rule = this.createRule("Untitled", InitialFileContent);
      this.setActiveRule(rule.id);
    } else {
      ruleObj.map((rule: Rule) => {
        const observableRule = new Rule();
        observableRule.id = rule.id;
        observableRule.name = rule.name;
        observableRule.content = rule.content;
        this.rules.push(observableRule);
      });
      this.setActiveRule(this.rules[0].id);
    }
    this.observeRuleChanges();
  }

  private observeRuleChanges() {
    deepObserve(this.rules, () => {
      const rules = JSON.stringify(this.rules.toJSON());
      saveValue("insight-rules", rules);
    });
  }

  public createRule(name: string, content: string) {
    const rule = new Rule();
    rule.id = nanoid();
    rule.name = name;
    rule.content = content;
    this.rules.push(rule);

    return rule;
  }

  public deleteRule(id: string) {
    const rule = this.getRuleById(id);
    if (rule) {
      this.rules.remove(rule);
    }
  }

  public setActiveRule(ruleId: string) {
    this.activeRule = ruleId;
  }

  public renameRule(ruleId: string, name: string) {
    const rule = this.getRuleById(ruleId);
    if (rule) {
      rule.name = name;
    }
  }

  public setRuleContent(ruleId: string, content: string) {
    const rule = this.getRuleById(ruleId);
    if (rule) {
      rule.content = content;
    }
  }

  private getRuleById(ruleId: string) {
    return this.rules.find(rule => (rule.id = ruleId));
  }

  @computed
  public get getActiveFileName() {
    const activeRule = this.rules.find(rule => rule.id === this.activeRule);
    if (activeRule) {
      return activeRule.name;
    }
    return "";
  }

  @computed
  public get getActiveFileContent() {
    const activeRule = this.rules.find(rule => rule.id === this.activeRule);
    if (activeRule) {
      return activeRule.content;
    }
    return "";
  }
}
