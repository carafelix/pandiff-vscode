import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { runPandiffAndGetHTML, getGitDiffs} from './getDiffs';
import { combineHTML } from './combineHtml';
import { getFilesPath, getFileRevision } from './filesPath';
const exec = require('child_process').exec;


export async function activate(context: vscode.ExtensionContext) {
	
	

	let compareTwoFiles = vscode.commands.registerCommand('pandiff-vscode.difs', async function() {

		
		const stylesFile: vscode.Uri = vscode.Uri.file(path.join(context.extensionPath, 'styles', 'style.html'));
		const styles = fs.readFileSync(stylesFile.fsPath, 'utf8');
						
	
		let filesPath: vscode.QuickPickItem[] = await getFilesPath();

		let file1 = await vscode.window.showQuickPick(filesPath,{
			matchOnDetail: true,
			title: 'File Pick 1/2 (base)',
		});
		let file2 = await vscode.window.showQuickPick(filesPath,{
			matchOnDetail: true,
			title: 'File Pick 2/2 (changes)',
		});


		if(!file1 || !file2){
			vscode.window.showErrorMessage('File not selected')
			return
		} else if (file1 === file2){
			vscode.window.showInformationMessage('Selected same file twice')
		}
			const html  = await runPandiffAndGetHTML(file1.detail!,file2.detail!)

			const panel = vscode.window.createWebviewPanel(
				'pandiffPanel',
				'Pandif Render',
				vscode.ViewColumn.One,
				{}
			);
		
			panel.webview.html = combineHTML(html,styles);
		
			
	});
	context.subscriptions.push(compareTwoFiles);
	
	let compareWithRevision = vscode.commands.registerCommand('pandiff-vscode.compareRevision', async function() {
		
		//when selecting from the explorer, avoid showing showing the selecting again

		const stylesFile: vscode.Uri = vscode.Uri.file(path.join(context.extensionPath, 'styles', 'style.html'));
		const styles = fs.readFileSync(stylesFile.fsPath, 'utf8');

		let filesPath: vscode.QuickPickItem[] = await getFilesPath();
		let file = await vscode.window.showQuickPick(filesPath,{
			matchOnDetail: true,
			title: 'File Pick base',
		});

		if(!file){
			vscode.window.showErrorMessage('file not found')
			return
		}
		let hashes:vscode.QuickPickItem[] | undefined = (await getFileRevision(file))?.filter((line)=>{
			if(line){
				return true
			} else return false
		});

		if(!hashes){
			vscode.window.showErrorMessage('File has no commits')
			return
		}

		let revision = await vscode.window.showQuickPick(hashes,{
			matchOnDetail: true,
			title: 'File Pick revision',
		});

		if(!revision?.detail){
			return
		}

			const html = await getGitDiffs(revision?.detail!,file.label,file.detail!)

			if(!html){
				vscode.window.showInformationMessage('No Differences')
				return
			}
		
			const panel = vscode.window.createWebviewPanel(
				'pandiffPanel',
				'Pandif Render',
				vscode.ViewColumn.One,
				{}
			);
		
			panel.webview.html = combineHTML(html,styles);

	});

	context.subscriptions.push(compareWithRevision);

	let editStyle = vscode.commands.registerCommand('pandiff-vscode.editStyles', async function() {
		const stylesFilePath: vscode.Uri = vscode.Uri.file(path.join(context.extensionPath, 'styles', 'style.html'));

		vscode.workspace.openTextDocument(stylesFilePath).then(doc => {
			vscode.window.showTextDocument(doc)
			})
	});
	context.subscriptions.push(editStyle);
}

// This method is called when your extension is deactivated
export function deactivate() {}