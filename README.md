# Pandiff VScode extension

Integration of [Pandiff](https://github.com/davidar/pandiff) to VScode.

## Requirements

- System install of [Pandoc](https://pandoc.org/installing.html)
- Run `npm install -g pandiff`

## Disclaimer

- Do not consider this extension as production ready. It's still on development, things may break. Use at your own discretion




## Features

- File convertion from and to any type supported by Pandoc
- Render diffs between files inside VScode
- Use Pandiff on git revisions


![preview](https://raw.githubusercontent.com/carafelix/pandiff-vscode/main/img/gateway.gif)


## Extension Settings

- Styles of the webview can be set directly on the style.html files

## Known Issues

- Uses exec on cli for accessing pandiff 
- Extension limited to epub, .odt, txt, md, html, docx just for the showQuickPick

## Release Notes

### 0.0.1

- MVP

## Contribute

* [Github](https://github.com/carafelix/pandiff-vscode)

**Enjoy!**

