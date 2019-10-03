import { Location } from "entities/Location";
import { Events } from "common/Events";
import { getExtensionMessenger } from "common/messaging/extension";

const extensionMessenger = getExtensionMessenger();

export function createTempFile(
  fileContent: string,
  onChangeCallback: (content: string) => void
) {
  extensionMessenger.send(Events.TempFile.CreateTempFile, fileContent);
  extensionMessenger.addSubscriber(
    Events.TempFile.CreatedTempFile,
    (content: string) => onChangeCallback(content)
  );

  extensionMessenger.addSubscriber(
    Events.TempFile.UpdatedTempFile,
    (content: string) => onChangeCallback(content)
  );
}

export function openFile(path: string, location?: Location) {
  extensionMessenger.send(Events.Window.ShowTextDocument, { path, location });
}
