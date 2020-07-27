---
id: alias-configuration
title: Import alias configuration
sidebar_label: Configure your import alias
---

You might be using custom bundler configuration such as [Webpack resolve](https://webpack.js.org/configuration/resolve/) so you could use shorter import paths instead of using relative path as below.

For example you might be importing components from `./src/views/components` by `import {List} from 'views/components';` instead of `import {List} from './src/views/components';`

In the preference panel, under `Module resolution mapping`, configure your path mapping like shown below. The path should be relative to the folder opened in VSCode.

| Alias              | Path                     |
| ------------------ | ------------------------ |
| `views/components` | `./src/views/components` |

Knowing this configuration will help Waypoint figure out the right file relationships.
