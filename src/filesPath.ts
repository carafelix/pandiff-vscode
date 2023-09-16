import * as vscode from 'vscode'

export async function getFilesPath (){
    let filesUri = await vscode.workspace.findFiles('{**/*.epub,**/*.odt,**/*.txt,**/*.md,**/*.html,**/*.docx}',
                                                            '**/node_modules/**');
            let filesPath: vscode.QuickPickItem[] = filesUri.map((uri: vscode.Uri)=>{
                    return uri.path
                })
                .map((path:string):vscode.QuickPickItem=>{
                    return {
                        detail: path,
                        label: path.slice(path.lastIndexOf('/')+1,Infinity),
                    }
                });

            return filesPath
}