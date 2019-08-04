export const Events = {
  SEARCH_QUERY_CHANGE: "SEARCH_QUERY_CHANGE",
  SUB_ACTIVE_SYMBOL_CHANGE: "SUB_ACTIVE_SYMBOL_CHANGE"
};

export interface SearchQueryChangeEvent {
  query: string;
  selector: string;
}

export interface ActiveSymbolChangeEvent {
  name: string;
  path: string;
  line: number;
  column: number;
}
