import { BlockExtension } from "common/Block";
import { WindowSelectionWatcher } from "./services/WindowSelectionWatcher";

const findMySymbol = {
  services: [WindowSelectionWatcher]
} as BlockExtension;

export default findMySymbol;
