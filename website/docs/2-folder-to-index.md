---
id: folder-to-index
title: Choose which files to index
sidebar_label: Choose files to index
---

If you don't specify folders to index, Waypoint, by default indexes all your `.js`, `.ts`, `.jsx` and `.tsx` files in the workspace. By default it skips `node_modules` folder.

## Selecting specific folders to index

However you can choose which folders Waypoint should traverse and index by providing a list of folders under the `Folders to index` section in the preference panel. The directory paths should be relative to the folder opened in VSCode (e.g: `./src`).

If you have a very large project, selecting which folders to index could reduce the indexing time.
