---
id: doc1
title: Choose which files to index
sidebar_label: Choose files to index
---

Waypoint indexes all your `.js`, `.ts`, `.jsx` and `.tsx` files. Waypoint by default skips `node_modules` directory.

## Selecting specific folders to index

However you can choose which folders Waypoint should traverse and index by providing a list of folders under the `Directories to index` section in the preference panel. The directory paths should be relative to the folder opened in VSCode (e.g: `./src`).

If you have a very large project, selecting which folders to index could reduce the initial indexing time.
