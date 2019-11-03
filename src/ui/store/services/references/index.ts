import { GqlSymbolInformation } from "entities/GqlSymbolInformation";
import { findReferences } from "./api";
import { FindReferenceSymbol } from "extension/api/GetReferenceArgs";

export class ReferenceService {
  public async getReferences(symbol: FindReferenceSymbol) {
    const result = await findReferences(symbol);
  }
}
