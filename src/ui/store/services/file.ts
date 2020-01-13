import { GqlLocation } from "entities/GqlLocation";
import { Events } from "common/Events";
import { getExtensionMessenger } from "common/messaging/extension";
import gql from "graphql-tag";
import { sendQuery } from "ui/util/graphql";
import { GqlFile } from "entities/GqlFile";

const extensionMessenger = getExtensionMessenger();

export function openFile(path: string, location?: GqlLocation) {
  extensionMessenger.send(Events.Window.ShowTextDocument, { path, location });
}

export async function getFile(path: string) {
  const query = gql`
    query GetFile($path: String!) {
      getFile(path: $path) {
        filePath
        symbols {
          name
          filePath
          kind
          id
          location {
            start {
              line
              column
            }
            end {
              line
              column
            }
          }
        }
      }
    }
  `;

  const results = await sendQuery<{ getFile: GqlFile }>(query, {
    path
  });

  return results.getFile;
}
