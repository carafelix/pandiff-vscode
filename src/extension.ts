import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { runPandiffAndGetHTML } from './getDiffs';
import { combineHTML } from './combineHtml';
import { getFilesPath } from './filesPath';

export async function activate(context: vscode.ExtensionContext) {

	let compareTwoFiles = vscode.commands.registerCommand('pandiff-vscode.difs', async function() {
		

		const stylesFile: vscode.Uri = vscode.Uri.file(path.join(context.extensionPath, 'src', 'style.html'));
		const styles = fs.readFileSync(stylesFile.fsPath, 'utf8');
						
	
		let filesPath: vscode.QuickPickItem[] = await getFilesPath();

		let file1 = await vscode.window.showQuickPick(filesPath,{
			matchOnDetail: true,
			title: 'File Pick 1/2 (base)',
		})
		let file2 = await vscode.window.showQuickPick(filesPath,{
			matchOnDetail: true,
			title: 'File Pick 2/2 (changes)',
		})

		const selectedFilePath1 = file1?.detail;
		const selectefFilePath2 = file2?.detail;

		if(selectedFilePath1 && selectefFilePath2){
			const html  = await runPandiffAndGetHTML(file1?.detail!,file2?.detail!)

			const panel = vscode.window.createWebviewPanel(
				'pandiffPanel',
				'Pandif Render',
				vscode.ViewColumn.One,
				{}
			);
		
			// And set its HTML content
			panel.webview.html = combineHTML(html,styles);
			}
	});
	context.subscriptions.push(compareTwoFiles);

	let compareWithRevision = vscode.commands.registerCommand('pandiff-vscode.compareRevision', async function() {

		let filesPath: vscode.QuickPickItem[] = await getFilesPath();
		


		let fileRevision: vscode.QuickPickItem[] = [];

		let file = await vscode.window.showQuickPick(filesPath,{
			matchOnDetail: true,
			title: 'File Pick base',
		});
		let revision = await vscode.window.showQuickPick(fileRevision,{
			matchOnDetail: true,
			title: 'File Revision',
		});

	});

	context.subscriptions.push(compareWithRevision);
}

// This method is called when your extension is deactivated
export function deactivate() {}