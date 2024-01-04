import * as vscode from 'vscode';
import * as path from 'path'
import * as fs from 'fs'
import * as extensionSettings from './config/settings.json'
import { simpleGit, SimpleGit, CleanOptions, LogResult } from 'simple-git';
const git: SimpleGit = simpleGit().clean(CleanOptions.FORCE);


export async function getFilesPath (){
    let filesUri = await vscode.workspace.findFiles(spreadPatterns(extensionSettings['enabled-fileFormats']),
                                                    spreadPatterns(extensionSettings['disabled-directories']));
                                                    
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
        file: filePath,
    })
}


export function writeTmpFile(filename:string, parentPath:string, content:Buffer, changeFilename:boolean):string{
    const tmpFolder = path.join(parentPath, 'tmp')
    let tmp = (changeFilename) ? path.join(tmpFolder, '2_' + filename) : path.join(tmpFolder, '1_' + filename);

    if(!fs.existsSync(tmpFolder)){
        fs.mkdirSync(tmpFolder)
    }

    fs.writeFileSync(tmp, content)

    return tmp
}

export function unlinkTmpFile(tmpPath:string){
    fs.unlink(tmpPath,(err)=>{
        if(err){
            throw err
        }
    });
}

// foR = FileOrRevision
export function writeOutputFile(foR1 : string, foR2 : string, content : string ){
    if(extensionSettings['keep-output-file']){
        const workspaceUri = vscode.workspace.workspaceFolders?.[0].uri;
        if(!workspaceUri) return;
        const filePathInWorkspace = vscode.Uri.joinPath(workspaceUri, `_c_${foR1}_${foR2}.html`);
        fs.writeFileSync(filePathInWorkspace.fsPath, content)
    }
}

function spreadPatterns(patterns:string[]):string{
    return "{" + patterns.join(',') + '}'
}
