import { BlockUI } from "common/Block";
import Search from "./view/Search";
import { Search as SearchIcon } from "react-feather";

const findMySymbol = {
  Component: Search,
  title: "Find my symbol",
  Icon: SearchIcon
} as BlockUI;

export default findMySymbol;
