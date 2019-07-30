import { sendMessageToExtension, messageHandler } from "common/MessageHandler";
import { Events } from "../Events";
import { Location } from "../../../common/entities/Location";

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

export function openFile(path: string, location?: Location) {
  sendMessageToExtension(Events.Window.ShowTextDocument, { path, location });
}
