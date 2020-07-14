import { join } from 'path';
import { readdirSync } from 'fs';

export function initializeStaticRoutes(express: any, port: number) {
    const uiDirectory = join(__dirname, '../../ui');
    const files = readdirSync(uiDirectory);

    const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta content="ie=edge" http-equiv="x-ua-compatible">
      <link rel="icon" href="icon.png" type="image/png">
      <script>
        window.port = ${port};
      </script>
      <title>Waypoint</title>
    </head>
    <body>
      <div id="root">
      </div>
      <script src="http://localhost:${port}/ui.bundle.js" type="text/javascript"></script>
    </body>
  </html>
        `;

    express.get('/', (req: any, res: any) => {
        res.set('Content-Type', 'text/html');
        res.send(htmlContent);
    });

    files.forEach(fileName => {
        express.get(`/${fileName}`, (req: any, res: any) => {
            return res.sendFile(join(uiDirectory, fileName));
        });
    });
}
