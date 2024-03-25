import * as vscode from 'vscode';
import * as path from 'path'
import * as fs from 'fs'
import { printToOutputChannel } from './extension';
import { simpleGit, SimpleGit, CleanOptions, LogResult } from 'simple-git';
import { runPandiffAndGetContent } from './content_F';
const git: SimpleGit = simpleGit().clean(CleanOptions.FORCE);

export async function getFilesPath (){
    const config = vscode.workspace.getConfiguration('HeroProtagonist.pandiff-vscode');
    const allowedFiles = config.get('enabledFilesExtensions', ["docx","odt","txt","md","html","epub" ]);
    const patterizeAllowedFiles = allowedFiles.map((v)=>composePattern(v));
    let filesUri = await vscode.workspace.findFiles(spreadPatterns(patterizeAllowedFiles),
                                                    spreadPatterns([
                                                        "**/node_modules/**" // disabled directories
                                                    ]));
                                                    
            let filesPath: vscode.QuickPickItem[] = filesUri.map((uri: vscode.Uri)=>{
                    return uri
                })
                    .map((file:vscode.Uri):vscode.QuickPickItem=>{

                        return {
                            detail: file.path,
                            label: path.basename(file.path),
                            iconPath: new vscode.ThemeIcon('file-text')
                        }
                    });

            return filesPath
}

export async function getFileRevisions(file:vscode.QuickPickItem):Promise<vscode.QuickPickItem[] | undefined> {
    
    if(!file)return;

    const log:LogResult = await getCommitsFullInfo(file?.detail!);

    if(!log){
        return undefined
    }

    return log.all.map((commit,i )=>{
        if(i===0){
            commit.date = 'HEAD: ' + commit.date
        }
        return {
            label: commit.date,
            detail: 'm: ' + commit.message,
            description: commit.hash,
            iconPath: new vscode.ThemeIcon('git-commit')
        }
    })
}

export async function getCommitsFullInfo(filePath:string):Promise<LogResult>{
    const parentPath = path.dirname(filePath)
    return await git.cwd({
        path: parentPath,
    }).log({
        "--":null,
        file: filePath
    })
}


export function writeTmpFile(filename:string, parentPath:string, content:Buffer, changeFilename:boolean):string{
    const tmpFolder = path.join(parentPath, 'tmp')
    let tmp = (changeFilename) ? path.join(tmpFolder, '2_' + filename) : path.join(tmpFolder, '1_' + filename);

    if(!fs.existsSync(tmpFolder)){
        fs.mkdirSync(tmpFolder)
    }

    try {
        fs.writeFileSync(tmp, content)
    } catch (err) {
        printToOutputChannel(`${err}`)
    }

    return tmp
}

export function unlinkTmpFile(tmpPath:string){
    fs.unlink(tmpPath,(err)=>{
        if(err){
            printToOutputChannel(`${err}`)
            throw err
        }
    });
}

// foR = FileOrRevision
export function writeHTMLdirectly(labels : string, content : string, ext = 'html'){ 
    const workspaceUri = vscode.workspace.workspaceFolders?.[0].uri;
    if(!workspaceUri){ return }
    else {
        const filePathInWorkspace = vscode.Uri.joinPath(workspaceUri, `_${labels}.${ext}`);
        try {
            fs.writeFileSync(filePathInWorkspace.fsPath, content)
        } catch (err) {
            printToOutputChannel(`${err}`)
        }
    }

}

function spreadPatterns(patterns:string[]):string{
    return "{" + patterns.join(',') + '}'
}
function composePattern(ext : string){
    return `**/*.${ext}`
}

export async function writeOutputFile(path1 : string, path2 : string, outputFormat : string, lables : string[] , stylizedHTML : string) {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0].uri;
	const twoFilesNames = `${lables.join('_')}`;

	    if( outputFormat === 'HTML' && stylizedHTML ){
			writeHTMLdirectly(lables.join('_'), stylizedHTML)
		} else if (outputFormat === 'Critic Markup'){ 
			const filePathInWorkspace = vscode.Uri.joinPath(workspaceUri!, twoFilesNames + '.md');
			const pandiffNewOutput = await runPandiffAndGetContent(path1, path2, 'markdown', filePathInWorkspace.fsPath)
		} else if (outputFormat === 'Docx with Track Changes'){
			const filePathInWorkspace = vscode.Uri.joinPath(workspaceUri!, twoFilesNames + '.docx');
			const pandiffNewOutput = await runPandiffAndGetContent(path1, path2, 'docx', filePathInWorkspace.fsPath)
		}
} 
