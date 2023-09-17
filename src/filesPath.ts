import * as vscode from 'vscode';
const exec = require('child_process').exec;


export async function getFilesPath (){
    let filesUri = await vscode.workspace.findFiles('{**/*.epub,**/*.odt,**/*.txt,**/*.md,**/*.html,**/*.docx,**/*.pdf}',
                                                            '**/node_modules/**');
            let filesPath: vscode.QuickPickItem[] = filesUri.map((uri: vscode.Uri)=>{
                    return uri
                })
                .map((file:vscode.Uri):vscode.QuickPickItem=>{

                    return {
                        detail: file.path,
                        label: file.path.slice(file.path.lastIndexOf('/')+1,Infinity),
                        iconPath: new vscode.ThemeIcon('file-text')
                    }
                });

            return filesPath
}

export async function getFileRevision(file:vscode.QuickPickItem):Promise<vscode.QuickPickItem[] | undefined> {
    
    if(!file)throw new Error('wasup');

    let commmitInfo:string = await getCommitsFullInfo(file?.detail!);
    if(!commmitInfo){
        return undefined
    } else return commmitInfo.split('commit ').filter((c)=>{
        if(!c){
            return false
        } else return true
    }).map((commit,i)=>{
        const splittedInfo = commit.split('\n');
        if(i==0){
            splittedInfo[2] = '(HEAD) ' + splittedInfo[2]
        }
        return {
            label: splittedInfo[2],
            detail: splittedInfo[0],
            description: 'm:' + splittedInfo[4]
        }
    });
}

export async function getCommitsFullInfo(filePath:string):Promise<string>{
    return new Promise((resolve, reject) => {
        const fileParent = filePath.slice(0,filePath.lastIndexOf('/'));
        const command = `cd ${fileParent} && git log ${filePath}`;

        exec(command, (error:Error, stdout:string, stderr:string) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (stderr) {
                    reject(new Error(stderr));
                    return;
                }
                resolve(stdout);
        });
    });
}