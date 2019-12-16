import { getItems } from "../query/items";
import { getInStockCount } from "project/query/items";

const getSessions = () => {};

export default function Store() {
  const items = getItems();
  const stockCount = getInStockCount();
  const sessions = getSessions();
}
