# Pandiff VScode extension

Integration of [Pandiff](https://github.com/davidar/pandiff) to VScode.

## Requirements

- System install of [Pandoc](https://pandoc.org/installing.html)
- Git based OS with Git installed, Windows may or may not work.

## Features

- File convertion from and to any type supported by Pandoc
- Render diffs between files inside VScode
- Use Pandiff on git revisions


![preview](https://raw.githubusercontent.com/carafelix/pandiff-vscode/main/img/gateway.gif)


## Extension Settings

- Styles of the webview can be set directly on the style.html files

## Disclaimer

- Do not consider this extension as production ready. It's still on development, things may break. Use at your own discretion
## Known Issues

- Extension limited to epub, .odt, txt, md, html, docx, pdf, on the quickPick with no major reason to not overcrowd the list


## Release Notes

### 0.0.4

- removed the need for running commands on installation
### 0.0.3

- Implemented simple-git instead of using exec on cli commands
- uses native pandiff function

## Contribute

* [Github](https://github.com/carafelix/pandiff-vscode)

**Enjoy!**

