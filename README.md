<div align="center">
<img src="https://raw.githubusercontent.com/Raathigesh/JSBubbles/master/docs/assets/bubbles.png">
  
<p align="center">
  A VSCode extension for <em>navigating</em> and <em>understanding</em> <br/>
  JavaScript codebases.
</p>

<br/>
<img src="https://img.shields.io/github/workflow/status/Raathigesh/JSBubbles/Production Build?style=flat-square" />
<img src="https://img.shields.io/visual-studio-marketplace/v/Raathigeshan.js-bubbles?color=green&style=flat-square" />
<br />
</div>
<br/>
<br/>

> 💡Still polishing things up but feel free to try it out and give feedback and ideas.

JSBubbles is a VSCode extension which makes it easy to find and read JavaScript without switching back and forth between multiple files.

JSBubbles is inspired by [Code bubbles](http://www.andrewbragdon.com/codebubbles_site.asp), few ideas of [the Light table IDE](https://www.chris-granger.com/2012/04/12/light-table-a-new-ide-concept/) and various other projects.

<br/>

### Getting started

#### Install and activate

- Install the extension from [marketplace](https://marketplace.visualstudio.com/items?itemName=Raathigeshan.js-bubbles).
- Click on the <img src="https://raw.githubusercontent.com/Raathigesh/JSBubbles/master/docs/assets/Trigger%20icon.png" height="30px"> icon on the top right corner of any file to open the JS Bubbles panel.

#### Configure and index your project

- When you open the extension, you will be prompted to configure and index your project.
- Click on "Configure project" to open the Preference panel.
  - You have to add which folders to index
  - Also, if you use path alias (like Webpack's resolve rules), make sure to add those as well.
- Then go ahead and click **"Start Indexing"**. This will take a few minutes.

<br/>

### Features

<div align="center">
  <p align="center"><b>Fast symbol search</b></p>
 <p align="center"><em>Press `ctrl + f` to open the symbol search window. Search and select a symbol to bring to the stage.</em></p>
 <img src="https://raw.githubusercontent.com/Raathigesh/JSBubbles/master/docs/assets/2-search-symbol.gif">
</div>

<br/>
<br/>

<div align="center">
  <p align="center"><b>Open connected symbols</b></p>
 <p align="center"><em>Click on the markers in the bubble to open other connected symbols.</em></p>
 <img src="https://raw.githubusercontent.com/Raathigesh/JSBubbles/master/docs/assets/3-connected-symbols.gif">
</div>

<br/>
<br/>

<div align="center">
  <p align="center"><b>Add symbol from a file</b></p>
 <p align="center"><em>Add symbol from file to stage.</em></p>
 <img src="https://raw.githubusercontent.com/Raathigesh/JSBubbles/master/docs/assets/4-add-symbol-from-file.gif">
</div>

<br/>
<br/>
 
<div align="center">
  <p align="center"><b>Take notes with a note bubble</b></p>
 <p align="center"><em>Add a note bubble and bring in other bubbles from the stage.</em></p>
<img src="https://raw.githubusercontent.com/Raathigesh/JSBubbles/master/docs/assets/5-add-note-bubble.gif">
</div>

<br/> 
<br/>

### Contributing

Have a look at our [contribution guide](docs/contributing.md).
