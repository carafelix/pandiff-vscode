import * as vscode from 'vscode';
import * as node_path from 'path';
import { runPandiffAndGetHTML, getGitShow} from './content_F';
import { combineHTML } from './combineHtml';
import { getFilesPath, getFileRevisions, writeTmpFile, unlinkTmpFile, writeOutputFile } from './fileRelated_F';
import { checkPandocInstall } from './checkPandoc';


export async function activate(context: vscode.ExtensionContext) {
	
	const stylesFile: vscode.Uri = vscode.Uri.file(node_path.join(context.extensionPath, 'styles', 'style.css'));
	const configFile: vscode.Uri = vscode.Uri.file(node_path.join(context.extensionPath, 'out' ,'config', 'settings.json'));

	let compareTwoFiles = vscode.commands.registerCommand('pandiff-vscode.difs', async function() {

		if(await checkPandocInstall()){
			return
		}

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
			`${file1.label} - ${file2.label}`,
			vscode.ViewColumn.One,
			{}
		);
		const stylizedHTML = combineHTML(html,stylesFile)

		panel.webview.html = stylizedHTML;

		writeOutputFile(file1.label!, file2.label!, stylizedHTML)

	});

	context.subscriptions.push(compareTwoFiles);
	
	let compareWithRevision = vscode.commands.registerCommand('pandiff-vscode.compareRevision', async (...files:vscode.Uri[] | Array<any>) => {

		if(await checkPandocInstall()){
			return
		}

		let file:vscode.QuickPickItem | undefined;

		if(files.length === 0){
			let filesPath: vscode.QuickPickItem[] = await getFilesPath();

				file = await vscode.window.showQuickPick(filesPath,{
				matchOnDetail: true,
				title: 'File Pick base',
			});
		} else if(files?.[0]?.[0]?.path || files?.[0]?.[0].m.path) {
			let f;
			if(files?.[0]?.[0]?.path) f = files[0][0];
			if (files?.[0]?.[0]?.m?.path) f = files[0][0].m;
			const name = f.path.slice(f.path.lastIndexOf('/')+1,Infinity);
			file = {
                        detail: f.path,
                        label: name,
                        iconPath: new vscode.ThemeIcon('file-text')
                    }
		}

		if(!file){
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

		const fileHash = revision?.description
		const fileName = file.label
		const fileFullPath = file.detail

		if(!fileHash || !fileName || !fileFullPath){
			return
		}
        const fileParentPath = node_path.dirname(fileFullPath);

		const gitShow= await getGitShow(fileHash,fileName,fileParentPath);

		if(!gitShow){
			return
		}

		const tmp = writeTmpFile(fileName,context.extensionPath, gitShow as Buffer, false);
		const html = await runPandiffAndGetHTML(tmp,fileFullPath);
		unlinkTmpFile(tmp);

		if(!html){
			vscode.window.showInformationMessage('No Difference with Working Tree file')
			return
		}
		
		const panel = vscode.window.createWebviewPanel(
			'pandiffPanel',
			`${fileName}: ${fileHash.slice(0,6)} - (Working Tree)`,
			vscode.ViewColumn.One,
			{}
		);
		const stylizedHTML = combineHTML(html,stylesFile)

		panel.webview.html = stylizedHTML;

		writeOutputFile(fileName, fileHash.slice(0,7), stylizedHTML)

	});

	context.subscriptions.push(compareWithRevision);

	let rightClick = vscode.commands.registerCommand('pandiff-vscode.rightClick', async (...files:vscode.Uri[]) => {
		if(!files){
			return
		} else{
			vscode.commands.executeCommand('pandiff-vscode.compareRevision',files);
		}
	})

	context.subscriptions.push(rightClick);

	let compareTwoRevisions = vscode.commands.registerCommand('pandiff-vscode.twoRevs', async () => {

		if(await checkPandocInstall()){
			return
		}

		let filesPath: vscode.QuickPickItem[] = await getFilesPath();

		let file = await vscode.window.showQuickPick(filesPath,{
				matchOnDetail: true,
				title: 'Pick file 1/3',
			})

		if(!file){
			return
		}

		let hashes:vscode.QuickPickItem[] | undefined = await getFileRevisions(file);

		if(!hashes){
			vscode.window.showErrorMessage('File has no commits')
			return
		}
		
		let revision1 = await vscode.window.showQuickPick(hashes,{
			matchOnDetail: true,
			title: 'Pick revision 2/3',
		});

		const hash1 = revision1?.description

		if(!hash1){
			return
		}	

		let revision2 = await vscode.window.showQuickPick(hashes,{
			matchOnDetail: true,
			title: 'Pick revision 3/3',
		});
		
		const hash2 = revision2?.description;

		if(!hash2){
			return
		}

		const fileName = file.label
		const fileFullPath = file.detail;

		if(!fileName || !fileFullPath){
			return
		}
        const fileParentPath = node_path.dirname(fileFullPath);
		
		const gitShow1 = await getGitShow(hash1,fileName,fileParentPath);
		if(!gitShow1){
			return
		}
		const tmp1 = writeTmpFile(fileName,context.extensionPath, gitShow1 as Buffer,false);

		const gitShow2 = await getGitShow(hash2,fileName,fileParentPath);
		if(!gitShow2){
			return
		}
		const tmp2 = writeTmpFile(fileName,context.extensionPath, gitShow2 as Buffer, true);

		const html = await runPandiffAndGetHTML(tmp1,tmp2);
		unlinkTmpFile(tmp1);
		unlinkTmpFile(tmp2);

		if(!html){
			vscode.window.showInformationMessage('No differences between Revisions')
			return
		}
		
		const panel = vscode.window.createWebviewPanel(
			'pandiffPanel',
			`${fileName}: ${hash1.slice(0,6)} - ${hash2.slice(0,6)}`,
			vscode.ViewColumn.One,
			{}
		);
		const stylizedHTML = combineHTML(html,stylesFile)
		
		panel.webview.html = stylizedHTML

		writeOutputFile(fileName, hash1.slice(0,7) + '_' + hash2.slice(0,7), stylizedHTML)


	});

	context.subscriptions.push(compareTwoRevisions);

	let editStyle = vscode.commands.registerCommand('pandiff-vscode.editStyles', async ()=> {
		vscode.workspace.openTextDocument(stylesFile).then(doc => {
			vscode.window.showTextDocument(doc)
			})
	});

	context.subscriptions.push(editStyle);

	let editConfig = vscode.commands.registerCommand('pandiff-vscode.editConfig',async () => {
		vscode.workspace.openTextDocument(configFile).then(doc => {
			vscode.window.showTextDocument(doc)
			})
	})
	context.subscriptions.push(editConfig);


}

// This method is called when your extension is deactivated
export function deactivate() {}