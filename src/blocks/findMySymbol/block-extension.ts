import { WindowHandler } from "./services/WindowHandler";
import { TempFileHandler } from "./services/TempFileHandler";
import { WorkspaceState } from "./services/WorkspaceState";
import SymbolsResolver from "./api/Symbols";
import { BlockExtension } from "common/Block";

const findMySymbol = {
  services: [WindowHandler, TempFileHandler, WorkspaceState],
  resolvers: [SymbolsResolver]
} as BlockExtension;

export default findMySymbol;
