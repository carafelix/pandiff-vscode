import * as vscode from 'vscode'
const exec = require('child_process').exec;

export async function getFilesPath (){
    let filesUri = await vscode.workspace.findFiles('{**/*.epub,**/*.odt,**/*.txt,**/*.md,**/*.html,**/*.docx}',
                                                            '**/node_modules/**');
            let filesPath: vscode.QuickPickItem[] = filesUri.map((uri: vscode.Uri)=>{
                    return uri
                })
                .map((file:vscode.Uri):vscode.QuickPickItem=>{
                    return {
                        detail: file.path,
                        label: file.path.slice(file.path.lastIndexOf('/')+1,Infinity),
                    }
                });

            return filesPath
}

export async function getFileRevisionHashes(file:vscode.QuickPickItem){
    let orange = vscode.window.createOutputChannel("Orange");
    // let fileParse = vscode.Uri.parse(file?.detail!)
    orange.append(file?.detail!)
    orange.show();
    
    if(!file)return;

    let onelines = await getOneLines(file?.detail!).then((data)=>{
        orange.appendLine(`${data}`);
        orange.show();
    })

    
    
    // let fileHashes: vscode.QuickPickItem[] = []
}

export async function getOneLines(filePath:string){
    return new Promise((resolve, reject) => {
        const fileParent = filePath.slice(0,filePath.lastIndexOf('/'))
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