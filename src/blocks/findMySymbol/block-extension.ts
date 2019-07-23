import { WindowHandler } from "./services/WindowHandler";
import { TempFileHandler } from "./services/TempFileHandler";
import { WorkspaceState } from "./services/WorkspaceState";
import { BlockExtension } from "common/Block";

const findMySymbol = {
  services: [WindowHandler, TempFileHandler, WorkspaceState]
} as BlockExtension;

export default findMySymbol;
