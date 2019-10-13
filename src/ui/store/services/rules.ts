import { deepObserve } from "mobx-utils";
import { saveValue, getValue } from "ui/services/workplace-state";
import { InitialFileContent } from "ui/Const";
import Rule from "../models/rule";
import { Rules } from "../models/rules";
import { observable } from "mobx";
import { performSearch } from "./results/utils";
import { Results } from "../models/results";

export class RulesService {
  @observable
  public rules: Rules;

  @observable
  public results: Results;

  constructor(rules: Rules, results: Results) {
    this.rules = rules;
    this.results = results;
    this.initialize();
  }

  private async initialize() {
    let rulesString: any = await getValue("insight-rules");
    if (rulesString === "") {
      rulesString = "[]";
    }

    const ruleObj = JSON.parse(rulesString);
    if (ruleObj.length === 0) {
      const rule = this.rules.createRule("Untitled", InitialFileContent);
      this.rules.setActiveRule(rule.id);
    } else {
      ruleObj.map((rule: Rule) => {
        const observableRule = new Rule();
        observableRule.id = rule.id;
        observableRule.name = rule.name;
        observableRule.content =
          rule.content === "" ? InitialFileContent : rule.content;
        this.rules.items.push(observableRule);
      });
      this.rules.setActiveRule(this.rules.items[0].id);
    }

    if (this.rules.activeRule) {
      const initialResults = await performSearch(this.rules.activeRule.content);
      this.results.setResult(this.rules.activeRule.id, initialResults);
    }

    this.observeRuleChanges();
  }

  private observeRuleChanges() {
    deepObserve(this.rules, () => {
      const rules = JSON.stringify(this.rules.items.toJSON());
      saveValue("insight-rules", rules);
    });
  }
}
