import pandiff = require("pandiff");
import * as vscode from "vscode";

const exec = require('child_process').exec;

    export async function runPandiffAndGetHTML(f1Path: string, f2Path: string): Promise<string> {
        const result = await pandiff(f1Path,f2Path,{
            to: 'html',
            files: true
        });

        if(!result){
            vscode.window.showErrorMessage('Result is null')
            throw new Error('Result is null')
        } else return result
    }

    export async function getGitDiffs(hash:string,filename:string,parentFolder:string):Promise<string> {
        return new Promise((resolve, reject) => {
            const par = parentFolder.slice(0,parentFolder.lastIndexOf('/')+1)
            const command = `cd ${par} && git pandiff ${hash} HEAD ${filename}`;
    
                exec(command, (error:Error, stdout:string, stderr:string) => {
                    if (error) {
                        console.error(`Error running pandiff: ${error.message}`);
                        reject(error);
                        return;
                    }
            
                    if (stderr) {
                        console.error(`pandiff produced an error message: ${stderr}`);
                        reject(new Error(stderr));
                        return;
                    }
            
                    resolve(stdout);
                });
            });
    }
