import { Resolver, Mutation, Arg, Query } from "type-graphql";
import * as vscode from "vscode";
const Conf = require("conf");
import { Service } from "typedi";

@Resolver()
@Service()
export default class ConfigResolver {
  private conf = new Conf({
    projectName: "Insight",
    projectVersion: 1
  });

  getKeyForPathMaps() {
    return `pathMaps.${vscode.workspace.rootPath}`;
  }

  @Mutation(returns => String)
  public setPathMap(@Arg("value") value: string) {
    this.conf.set(this.getKeyForPathMaps(), value);
    return "";
  }

  @Query(returns => String)
  public getPathMap() {
    return this.conf.get(this.getKeyForPathMaps()) || "";
  }

  getKeyForFontSize() {
    return "fontsize";
  }

  @Mutation(returns => String)
  public setFontSize(@Arg("value") value: string) {
    this.conf.set(this.getKeyForFontSize(), value);
    return "";
  }

  @Query(returns => String)
  public getFontSize() {
    return this.conf.get(this.getKeyForFontSize()) || "";
  }

  getKeyForDirectories() {
    return `directories.${vscode.workspace.rootPath}`;
  }

  @Mutation(returns => String)
  public setDirectories(@Arg("value") value: string) {
    this.conf.set(this.getKeyForDirectories(), value);
    return "";
  }

  @Query(returns => String)
  public getDirectories() {
    return this.conf.get(this.getKeyForDirectories()) || "[]";
  }

  getKeyForStageConfig() {
    return `stage.${vscode.workspace.rootPath}`;
  }

  @Mutation(returns => String)
  public setStageConfig(@Arg("value") value: string) {
    this.conf.set(this.getKeyForStageConfig(), value);
    return "";
  }

  @Query(returns => String, { nullable: true })
  public getStageConfig() {
    return this.conf.get(this.getKeyForStageConfig()) || null;
  }

  getKeyForBookmarksConfig() {
    return `bookmarks.${vscode.workspace.rootPath}`;
  }

  @Mutation(returns => String)
  public setBookmarksConfig(@Arg("value") value: string) {
    this.conf.set(this.getKeyForBookmarksConfig(), value);
    return "";
  }

  @Query(returns => String, { nullable: true })
  public getBookmarksConfig() {
    return this.conf.get(this.getKeyForBookmarksConfig()) || null;
  }
}
