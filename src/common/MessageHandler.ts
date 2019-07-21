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
export const messageHandler = new MessageHandler();

export function sendMessageToExtension(eventId: string, payload?: any) {
  vscode.postMessage({
    type: eventId,
    payload
  });
}
