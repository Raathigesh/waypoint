import { GqlLocation } from "entities/GqlLocation";
import { Events } from "common/Events";
import { getExtensionMessenger } from "common/messaging/extension";

const extensionMessenger = getExtensionMessenger();

export function openFile(path: string, location?: GqlLocation) {
  extensionMessenger.send(Events.Window.ShowTextDocument, { path, location });
}
