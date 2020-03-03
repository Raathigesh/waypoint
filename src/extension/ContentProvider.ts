import { Uri, ExtensionContext } from "vscode";
import { join } from "path";

export default class ContentProvider {
  getDevServerContent() {
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta content="ie=edge" http-equiv="x-ua-compatible">
    <title>JS Bubbles</title>
  </head>
  <body>
    <div id="root">
    </div>
    <script src="http://localhost:9000/ui.bundle.js" type="text/javascript"></script>
  </body>
</html>
      `;
  }

  getProdContent(context: ExtensionContext, port: number) {
    const unBundleDiskPath = Uri.file(
      join(context.extensionPath, "out", "ui", "ui.bundle.js")
    );
    const unBundlePath = unBundleDiskPath.with({ scheme: "vscode-resource" });

    return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta content="ie=edge" http-equiv="x-ua-compatible">
    <link rel="icon" href="icon.png" type="image/png">
    <title>JS Bubbles</title>
  </head>
  <body>
    <div id="root">
    </div>
    <script src="http://localhost:${port}/ui.bundle.js" type="text/javascript"></script>
  </body>
</html>
    `;
  }

  getContent(context: ExtensionContext, port: number) {
    if (process.env.dev) {
      return this.getDevServerContent();
    }

    return this.getProdContent(context, port);
  }
}
