import UsageResolver from "./api/File";
import { BlockBackend } from "common/Block";

const findMySymbol = {
  resolvers: [UsageResolver]
} as BlockBackend;

export default findMySymbol;
