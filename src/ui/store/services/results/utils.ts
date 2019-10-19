import { search } from "./api";
import { UIState } from "../ui";

export async function performSearch(selector: string, uiState: UIState) {
  try {
    uiState.setLoading(true);
    const results = await search("", selector);
    return results;
  } catch (e) {
  } finally {
    uiState.setLoading(false);
  }
  return [];
}
