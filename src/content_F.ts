import pandiff = require("pandiff");
import * as vscode from "vscode";
import { CleanOptions, SimpleGit, simpleGit } from "simple-git";
import { printToOutputChannel } from "./extension";
const git: SimpleGit = simpleGit().clean(CleanOptions.FORCE);

export async function runPandiffAndGetContent(
  f1Path: string,
  f2Path: string,
  format = "html",
  outPath?: string,
): Promise<string> {
  try {
    if (process.platform === "win32") {
      f1Path = vscode.Uri.file(f1Path).fsPath;
      f2Path = vscode.Uri.file(f2Path).fsPath;
    }
    if (outPath) {
      await pandiff(f1Path, f2Path, {
        to: format,
        files: true,
        output: outPath,
      });
      return "";
    }

    const result = await pandiff(f1Path, f2Path, {
      to: "html",
      files: true,
    }).catch((err) => printToOutputChannel(err));

    if (!result) {
      throw new Error("Error while running Pandiff");
    }
    return result;
  } catch (error) {
    switch (error) {
      case 64:
        vscode.window.showErrorMessage(
          `Pandoc Error: ${error}. Check your file internal structure and entry points`,
        );
    }
    return "";
  }
}

export async function getGitShow(
  hash: string,
  filename: string,
  parentPath: string,
): Promise<Buffer | null> {
  if (process.platform === "win32") {
    parentPath = vscode.Uri.file(parentPath).fsPath;
  }
  const revision = git.cwd({
    path: parentPath,
  }).showBuffer(`${hash}:./${filename}`);

  return revision.then((b) => {
    return b;
  }).catch((err) => {
    printToOutputChannel(`${err}`);
    vscode.window.showErrorMessage(err.message);
    return null;
  });
}
