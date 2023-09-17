# Pandiff VScode extension

Integration of [Pandiff](https://github.com/davidar/pandiff) to VScode.

## Disclaimer

- Do not consider this extension as production ready. It's still on development, things may break. Use at your own discretion
- I am trying to get rid of the need for running the commands below

## Requirements

- System install of [Pandoc](https://pandoc.org/installing.html)
- run ```npm i -g pandiff``` and
```
git config --global difftool.pandiff.cmd 'pandiff "$LOCAL" "$REMOTE"'
git config --global alias.pandiff 'difftool -t pandiff -y'
```

## Features

- File convertion from and to any type supported by Pandoc
- Render diffs between files inside VScode
- Use Pandiff on git revisions


![preview](https://raw.githubusercontent.com/carafelix/pandiff-vscode/main/img/gateway.gif)


## Extension Settings

- Styles of the webview can be set directly on the style.html files

## Known Issues

- Extension limited to epub, .odt, txt, md, html, docx, pdf, on the quickPick


## Release Notes

### 0.0.3

- Implemented simple-git instead of using exec on cli commands
- uses native pandiff function
### 0.0.1

- MVP

## Contribute

* [Github](https://github.com/carafelix/pandiff-vscode)

**Enjoy!**

