// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { runPandiffAndGetHTML } from './getDif';

export async function activate(context: vscode.ExtensionContext) {
	let orange = vscode.window.createOutputChannel("Orange");

	let getFiles = vscode.commands.registerCommand('pandiff-vscode.difs', async function() {

		let files = await vscode.workspace.findFiles('{**/*.epub,**/*.odt,**/*.txt,**/*.md,**/*.html,**/*.docx}','**/node_modules/**');

			orange.append(files.constructor())
			orange.show();
		
		vscode.window.showInformationMessage(`${files}`)

		vscode.window.showQuickPick(['asd'])

	});

	context.subscriptions.push(getFiles);
}

// This method is called when your extension is deactivated
export function deactivate() {}