import { search } from "./api";

export async function performSearch(selector: string) {
  return await search("", selector);
}
