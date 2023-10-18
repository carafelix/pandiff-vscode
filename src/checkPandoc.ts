import { exec } from 'child_process';
import * as vscode from 'vscode';

export async function checkPandocInstall():Promise<boolean>{
    return new Promise((resolve,reject)=>{
      exec('pandoc -v', (err,stdout)=>{
        if(err){
          reject(err)
        } else if (stdout) resolve(stdout);
      })
    }).then((response)=>{
      return false // pandoc is installed
    })
      .catch((err)=>{
		    vscode.window.showErrorMessage('Pandoc is missing. Visit https://pandoc.org/installing.html')
        return true 
      })
}