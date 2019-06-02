import { Events } from "../events/Events";

declare var acquireVsCodeApi: any;
const vscode = acquireVsCodeApi();

export function listenToMessage() {
  window.addEventListener("message", ({ data }) => {
    if (data.type === Events.GetWorkspaceState) {
    }
  });
}

export function sendMessageToExtension(eventId: string, payload: any) {
  vscode.postMessage({
    type: eventId,
    payload
  });
}
