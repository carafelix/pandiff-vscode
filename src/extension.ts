import * as vscode from 'vscode';
import * as node_path from 'path';
import { runPandiffAndGetHTML, getGitShow} from './content_F';
import { combineHTML } from './combineHtml';
import { getFilesPath, getFileRevisions, writeTmpFile, unlinkTmpFile } from './fileRelated_F';


export async function activate(context: vscode.ExtensionContext) {
	
	const stylesFile: vscode.Uri = vscode.Uri.file(node_path.join(context.extensionPath, 'styles', 'style.css'));


	let compareTwoFiles = vscode.commands.registerCommand('pandiff-vscode.difs', async function() {

		let filesPath: vscode.QuickPickItem[] = await getFilesPath();

		let file1 = await vscode.window.showQuickPick(filesPath,{
			matchOnDetail: true,
			title: 'File Pick 1/2 (base)',
		});

		if(!file1){
			return
		}
		let file2 = await vscode.window.showQuickPick(filesPath,{
			matchOnDetail: true,
			title: 'File Pick 2/2 (changes)',
		});

		if(!file2){
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
		
			panel.webview.html = combineHTML(html,stylesFile);
		
			
	});
	context.subscriptions.push(compareTwoFiles);
	
	let compareWithRevision = vscode.commands.registerCommand('pandiff-vscode.compareRevision', async (...files:vscode.Uri[] | Array<any>) => {
		let file:vscode.QuickPickItem | undefined;

		if(files.length === 0 || files?.[0]?.[0]?.path === undefined){
			let filesPath: vscode.QuickPickItem[] = await getFilesPath();

				file = await vscode.window.showQuickPick(filesPath,{
				matchOnDetail: true,
				title: 'File Pick base',
			});
		} else {
			const f = files[0][0];
			const name = f.path.slice(f.path.lastIndexOf('/')+1,Infinity);
			file = {
                        detail: f.path,
                        label: name,
                        iconPath: new vscode.ThemeIcon('file-text')
                    }
		}

		if(!file){
			vscode.window.showErrorMessage('file not found')
			return
		}
		let hashes:vscode.QuickPickItem[] | undefined = (await getFileRevisions(file))?.filter((line) => {
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

		const fileHash = revision?.detail
		const fileName = file.label
		const fileFullPath = file.detail


		if(!fileHash || !fileName || !fileFullPath){
			return
		}

        const fileParentPath = node_path.dirname(fileFullPath);

		const gitShow:Buffer | null = await getGitShow(fileHash,fileName,fileParentPath);

		if(!gitShow){
			return
		}

		const tmp = writeTmpFile(fileName,context.extensionPath, gitShow);
		const html = await runPandiffAndGetHTML(tmp,fileFullPath);
		unlinkTmpFile(tmp);
		

		if(!html){
			vscode.window.showInformationMessage('No Differences with HEAD')
			return
		}
		
		const panel = vscode.window.createWebviewPanel(
			'pandiffPanel',
			'Pandif Render',
			vscode.ViewColumn.One,
			{}
		);
		
		panel.webview.html = combineHTML(html,stylesFile);

	});

	context.subscriptions.push(compareWithRevision);

	let editStyle = vscode.commands.registerCommand('pandiff-vscode.editStyles', async ()=> {

		vscode.workspace.openTextDocument(stylesFile).then(doc => {
			vscode.window.showTextDocument(doc)
			})
	});

	context.subscriptions.push(editStyle);

	let rightClick = vscode.commands.registerCommand('pandiff-vscode.rightClick', async (...files:vscode.Uri[]) => {
		if(!files){
			return
		} else{
			vscode.commands.executeCommand('pandiff-vscode.compareRevision',files);
		}
	})
	context.subscriptions.push(rightClick);

}

// This method is called when your extension is deactivated
export function deactivate() {}