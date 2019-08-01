export const Events = {
  MESSAGE_TO_CLIENT: "CLIENT_MESSAGE",
  MESSAGE_TO_EXTENSION: "EXTENSION_MESSAGE"
};

export interface MessageEvent {
  id: string;
  payload: string;
}
