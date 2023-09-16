import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { runPandiffAndGetHTML } from './getDiffs';
import { combineHTML } from './combineHtml';

export async function activate(context: vscode.ExtensionContext) {

	let compareTwoFiles = vscode.commands.registerCommand('pandiff-vscode.difs', async function() {
		let filesUri = await vscode.workspace.findFiles('{**/*.epub,**/*.odt,**/*.txt,**/*.md,**/*.html,**/*.docx}',
													'**/node_modules/**');

		const stylesFile: vscode.Uri = vscode.Uri.file(path.join(context.extensionPath, 'src', 'style.html'));
		const styles = fs.readFileSync(stylesFile.fsPath, 'utf8');
													
		let filesPath: vscode.QuickPickItem[] = filesUri.map((uri: vscode.Uri)=>{
				return uri.path
			})
			.map((path:string):vscode.QuickPickItem=>{
				return {
					detail: path,
					label: path.slice(path.lastIndexOf('/')+1,Infinity),
				}
			});

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

	// let compareWithRevision = vscode.commands.registerCommand('pandiff-vscode.compareRevision', async function() {
	// 	let filesUri = await vscode.workspace.findFiles('{**/*.epub,**/*.odt,**/*.txt,**/*.md,**/*.html,**/*.docx}',
	// 												'**/node_modules/**');
	// })

}

// This method is called when your extension is deactivated
export function deactivate() {}