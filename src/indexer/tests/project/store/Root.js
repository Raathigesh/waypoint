import { getItems } from "../query/items";
import { getInStockCount } from "project/query/items";

export default function Store() {
  const items = getItems();
  const stockCount = getInStockCount();
}
