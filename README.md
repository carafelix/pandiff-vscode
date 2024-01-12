# Pandiff VScode extension
## Integration of [Pandiff](https://github.com/davidar/pandiff) to VScode.

## Requirements

- System install of [Pandoc](https://pandoc.org/installing.html)
- For Git related functions requires Unix based OS, Windows may or may not work.

## Features

- File render from any type supported by Pandoc
- Ability to visualize prose difference between files inside VScode
- Use Pandiff to compare two revisions of the same file


![preview](https://raw.githubusercontent.com/carafelix/pandiff-vscode/main/img/gateway.gif)


## Extension Settings

- Styles of the webview can be set directly on the style.css files
- Enable or disable file formats via the Settings.json file

## Disclaimer

- Do not consider this extension as production ready. It's still on development, things may break. Use at your own discretion

## Contribute

* [Github](https://github.com/carafelix/pandiff-vscode)

## Release Notes

### 0.1.6

- add option for selecting the output format of the writed output file

### 0.1.5

- add feature for keeping the output file via editing the extension settings
- refactor extension settings to use vscode native settings

### 0.1.4

- add check for pandoc installation

### 0.1.0

- Added config file for enable/disable file formats listed on prompt 

### 0.0.5

- Added feature for compare two revisions of the same file
### 0.0.4

- Removed the need for running commands on installation
### 0.0.3

- Implemented simple-git instead of using exec on cli commands
- Enable the use for native Pandiff function

**Enjoy!**
