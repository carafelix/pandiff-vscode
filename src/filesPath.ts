import * as vscode from 'vscode';
import * as path from 'path'
import { simpleGit, SimpleGit, CleanOptions, LogResult } from 'simple-git';
const git: SimpleGit = simpleGit().clean(CleanOptions.FORCE);


export async function getFilesPath (){
    let filesUri = await vscode.workspace.findFiles('{**/*.epub,**/*.odt,**/*.txt,**/*.md,**/*.html,**/*.docx,**/*.pdf}',
                                                            '**/node_modules/**');
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
    
    if(!file)throw new Error('wasup');

    const log:LogResult = await getCommitsFullInfo(file?.detail!);

    if(!log){
        return undefined
    }

    return log.all.map((commit)=>{
        return {
            label: commit.date,
            detail: commit.hash,
            description: 'm:' + commit.message,
            iconPath: new vscode.ThemeIcon('git-commit')
        }
    })


}

export async function getCommitsFullInfo(filePath:string):Promise<LogResult>{
    const parentPath = path.dirname(filePath)
    return await git.cwd({
        path: parentPath,
    }).log({
        file: filePath,
    })
}
