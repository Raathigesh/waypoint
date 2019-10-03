import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { Service, Inject } from "typedi";
import vscode from "vscode";

@Resolver()
@Service()
export default class WorkplaceResolver {
  @Inject("extension-context")
  context?: vscode.ExtensionContext;

  @Mutation(returns => String)
  public setValue(@Arg("key") key: string, @Arg("value") value: string) {
    if (this.context) {
      const state: any = this.context.workspaceState.get(
        "InsightWorkspaceState"
      );
      state[key] = value;
      this.context.workspaceState.update("InsightWorkspaceState", state);
      return value;
    }
  }

  @Query(returns => String)
  public getValue(@Arg("key") key: string) {
    if (this.context) {
      const state: any = this.context.workspaceState.get(
        "InsightWorkspaceState"
      );
      return state[key];
    }
  }
}
