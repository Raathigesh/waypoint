import { Events } from "../events/Events";
import { useState, useEffect } from "react";

declare var acquireVsCodeApi: any;
const vscode = acquireVsCodeApi();

class MessageHandler {
  private subscribers: { [event: string]: any[] } = {};

  constructor() {
    window.addEventListener("message", ({ data }) => {
      const subscribersForType = this.subscribers[data.type] || [];
      subscribersForType.forEach(subscriber => {
        subscriber(data.payload);
      });
    });
  }

  addSubscriber(event: string, handler: any) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(handler);
  }
}
const messageHandler = new MessageHandler();

export function sendMessageToExtension(eventId: string, payload?: any) {
  vscode.postMessage({
    type: eventId,
    payload
  });
}

export function createTempFile(
  fileContent: string,
  onChangeCallback: (content: string) => void
) {
  sendMessageToExtension(Events.TempFile.CreateTempFile, fileContent);
  messageHandler.addSubscriber(
    Events.TempFile.CreatedTempFile,
    (content: string) => onChangeCallback(content)
  );

  messageHandler.addSubscriber(
    Events.TempFile.UpdatedTempFile,
    (content: string) => onChangeCallback(content)
  );
}

export function useWorkspaceState() {
  const [state, setState] = useState<any>(null);

  useEffect(() => {
    sendMessageToExtension(Events.GetWorkspaceState);
    messageHandler.addSubscriber(
      Events.GetWorkspaceState,
      (workspaceState: any) => {
        setState(workspaceState || null);
      }
    );
  }, []);

  const updateWorkspaceState = (state: any) => {
    sendMessageToExtension(Events.SaveWorkspaceState, state);
    setState(state);
  };

  return [state, updateWorkspaceState];
}
