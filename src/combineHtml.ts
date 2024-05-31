import * as vscode from "vscode";
import * as fs from "fs";

export function combineHTML(content: string, stylesFile: vscode.Uri) {
  const styles = fs.readFileSync(stylesFile.fsPath, "utf8");

  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Files Diff</title>
    </head>
    <body>
        <style>
            ${styles}
        </style>
        <div align="center">
            ${content}
        </div>
    </body>
    </html>`;
}
