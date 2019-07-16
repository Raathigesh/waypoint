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

export function getWorkspaceState() {
  return new Promise((resolve, reject) => {
    messageHandler.addSubscriber(
      Events.GetWorkspaceState,
      (workspaceState: any) => {
        resolve(workspaceState || null);
      }
    );
    sendMessageToExtension(Events.GetWorkspaceState);
  });
}

export function setWorkspaceState(state: any) {
  sendMessageToExtension(Events.SaveWorkspaceState, state);
}

export function openFile(path: string) {
  sendMessageToExtension(Events.Window.ShowTextDocument, { path });
}
