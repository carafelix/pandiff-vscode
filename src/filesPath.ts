import * as vscode from 'vscode';
const exec = require('child_process').exec;


export async function getFilesPath (){
    let filesUri = await vscode.workspace.findFiles('{**/*.epub,**/*.odt,**/*.txt,**/*.md,**/*.html,**/*.docx}',
                                                            '**/node_modules/**');
            let filesPath: vscode.QuickPickItem[] = filesUri.map((uri: vscode.Uri)=>{
                    return uri
                })
                .map((file:vscode.Uri):vscode.QuickPickItem=>{
                    
                    // let fileExt = file.path.slice(file.path.lastIndexOf('.')+1,Infinity);
                    return {
                        detail: file.path,
                        label: file.path.slice(file.path.lastIndexOf('/')+1,Infinity),
                        iconPath: new vscode.ThemeIcon('file-text')
                    }
                });

            return filesPath
}

export async function getFileRevisionHashes(file:vscode.QuickPickItem):Promise<string[]>{
    
    if(!file)throw new Error('wasup');

    let onelines:string = await getOneLines(file?.detail!);

    return onelines.split('\n').map((line)=>line.slice(0,6));
}

export async function getOneLines(filePath:string):Promise<string>{
    return new Promise((resolve, reject) => {
        const fileParent = filePath.slice(0,filePath.lastIndexOf('/'));
        const command = `cd ${fileParent} && git log --oneline ${filePath}`;

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