export interface Messenger {
  send(id: string, payload: any): void;
  addSubscriber(type: string, cb: any): void;
}
