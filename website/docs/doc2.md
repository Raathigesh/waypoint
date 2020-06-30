---
id: doc2
title: Import alias configuration
sidebar_label: Configure your import alias
---

You might be using custom bundler configuration so you could use shorter import paths instead of using relative path as below.

| This                                     | Instead of                                     |
| ---------------------------------------- | ---------------------------------------------- |
| `import {List} from 'views/components';` | `import {List} from './src/views/components';` |

Telling this configuration to Waypoint will help to figure out actual file relationships.

In the preference panel, under `Module resolution mapping`, configure your path mapping like the example shown below. The path should be relative to the folder opened in VSCode.

| Alias              | Path                     |
| ------------------ | ------------------------ |
| `views/components` | `./src/views/components` |
