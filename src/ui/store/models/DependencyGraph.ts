import { types, flow, Instance, IArrayType } from "mobx-state-tree";
import { DocumentSymbol } from "./DocumentSymbol";
import { GqlSymbolInformation } from "entities/GqlSymbolInformation";
import { findReferences } from "../services/references/api";

export const DependencyGraph = types
  .model("DependencyGraph", {
    currentSymbol: types.maybeNull(DocumentSymbol),
    references: types.array(DocumentSymbol)
  })
  .actions(self => {
    const setCurrentSymbol = (symbol: GqlSymbolInformation) => {
      self.currentSymbol = DocumentSymbol.create({
        id: symbol.id,
        name: symbol.name,
        filePath: symbol.filePath,
        kind: symbol.kind
      });
    };

    const fetchReferences = flow(function*(symbol: GqlSymbolInformation) {
      const references: GqlSymbolInformation[] = yield findReferences({
        filePath: symbol.filePath,
        kind: symbol.kind,
        name: symbol.name,
        containerKind: undefined
      });

      references.forEach(reference => {
        const documentSymbol = DocumentSymbol.create({
          id: reference.id,
          name: reference.name || "None",
          filePath: reference.filePath,
          kind: ""
        });
        self.references.push(documentSymbol);
      });
    });
    return { setCurrentSymbol, fetchReferences };
  });
