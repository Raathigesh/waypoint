import SymbolsResolver from "./api/Symbols";
import { BlockBackend } from "common/Block";

const findMySymbol = {
  resolvers: [SymbolsResolver]
} as BlockBackend;

export default findMySymbol;
