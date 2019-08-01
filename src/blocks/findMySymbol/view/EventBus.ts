import { Location } from "common/entities/Location";
import { Events } from "../Events";
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

export function getWorkspaceState() {
  return new Promise((resolve, reject) => {
    extensionMessenger.addSubscriber(
      Events.GetWorkspaceState,
      (workspaceState: any) => {
        resolve(workspaceState || null);
      }
    );
    extensionMessenger.send(Events.GetWorkspaceState, {});
  });
}

export function setWorkspaceState(state: any) {
  extensionMessenger.send(Events.SaveWorkspaceState, state);
}

export function openFile(path: string, location?: Location) {
  extensionMessenger.send(Events.Window.ShowTextDocument, { path, location });
}
