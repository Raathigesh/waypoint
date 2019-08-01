import { WindowHandler } from "./services/WindowHandler";
import { WorkspaceState } from "./services/WorkspaceState";
import { BlockExtension } from "common/Block";

const findMySymbol = {
  services: [WindowHandler, WorkspaceState]
} as BlockExtension;

export default findMySymbol;
