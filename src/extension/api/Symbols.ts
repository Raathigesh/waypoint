import {
  Arg,
  Mutation,
  Query,
  Resolver,
  Subscription,
  Root
} from "type-graphql";
import { ContainerInstance, Service } from "typedi";

import Indexer from "indexer/Indexer";
import Project from "indexer/Project";
import { pubSub } from "common/pubSub";
import { Status } from "./Status";
import { SearchResult } from "../../entities/SearchResult";
import { Flake } from "entities/Symbol";
import { ColumnValue } from "entities/ColumnValue";

@Service()
@Resolver(SearchResult)
export default class SymbolsResolver {
  constructor(
    private readonly container: ContainerInstance,
    private readonly indexer: Indexer
  ) {}

  @Query(returns => SearchResult)
  results() {
    return new SearchResult();
  }

  @Mutation(returns => String)
  public async reindex() {
    const project: Project = {
      root: process.env.projectRoot || ""
    };
    await this.indexer.parse(project);
    return Status.OK;
  }

  @Mutation(returns => SearchResult)
  public search(
    @Arg("query") query: string,
    @Arg("selector") selector: string
  ) {
    const symbols: Flake[] = [];
    try {
      const viewFn = eval(`(${selector})`);
      const selectorFn = viewFn().filter;

      Object.entries(this.indexer.files).forEach(([path, file]) => {
        const selectorResult = selectorFn({
          path
        });
        file.classes
          .filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
          .forEach(classSymbol => {
            if (selectorResult.include) {
              const columnValues = selectorResult.columns.map((column: any) => {
                const columnValue = new ColumnValue();
                columnValue.key = column.key;
                columnValue.properties = JSON.stringify(column.properties);
                return columnValue;
              });

              symbols.push({
                id: classSymbol.id,
                exportStatus: classSymbol.exportStatus,
                filePath: path,
                name: classSymbol.name,
                type: "class",
                location: classSymbol.location,
                columnValues
              });
            }
          });

        file.functions
          .filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
          .forEach(functionSymbol => {
            if (selectorResult.include) {
              const columnValues = selectorResult.columns.map((column: any) => {
                const columnValue = new ColumnValue();
                columnValue.key = column.key;
                columnValue.properties = JSON.stringify(column.properties);
                return columnValue;
              });
              symbols.push({
                id: functionSymbol.id,
                exportStatus: functionSymbol.exportStatus,
                filePath: path,
                name: functionSymbol.name,
                type: "function",
                location: functionSymbol.location,
                columnValues
              });
            }
          });

        file.variables
          .filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
          .forEach(variableSymbol => {
            if (selectorResult.include) {
              const columnValues = selectorResult.columns.map((column: any) => {
                const columnValue = new ColumnValue();
                columnValue.key = column.key;
                columnValue.properties = JSON.stringify(column.properties);
                return columnValue;
              });
              symbols.push({
                id: variableSymbol.id,
                exportStatus: variableSymbol.exportStatus,
                filePath: path,
                name: variableSymbol.name,
                type: "variable",
                location: variableSymbol.location,
                columnValues
              });
            }
          });
      });

      const result = new SearchResult();
      result.items = symbols;

      return result;
    } catch (e) {
      const result = new SearchResult();
      result.errorMessage = e.stack;
      return result;
    }
  }
}
