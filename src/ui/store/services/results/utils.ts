import { search } from "./api";
import { UIState } from "../ui";

export async function performSearch(query: string, uiState: UIState) {
  try {
    uiState.setLoading(true);
    const results = await search(query);
    return results;
  } catch (e) {
  } finally {
    uiState.setLoading(false);
  }
  return {
    items: [],
    errorMessage: undefined
  };
}
