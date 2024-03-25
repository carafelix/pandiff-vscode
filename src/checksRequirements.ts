import { exec } from 'child_process';
import * as vscode from 'vscode';
import * as path from 'path'
import { getCommitsFullInfo } from './fileRelated_F'
import { simpleGit, SimpleGit, CleanOptions } from 'simple-git';
const git: SimpleGit = simpleGit().clean(CleanOptions.FORCE);


export async function isPandocInstalled():Promise<boolean>{
    return new Promise((resolve,reject)=>{
      exec('pandoc -v', (err,stdout)=>{
        if(err){
          reject(err)
        } else if (stdout) resolve(stdout);
      })
    }).then((response)=>{
      return true
    })
      .catch((err)=>{
		    vscode.window.showErrorMessage('Pandoc is missing. Visit https://pandoc.org/installing.html')
        return false
      })
}

export async function isGitRepo(filePath : string){
  const parentPath = path.dirname(filePath) + '/'
  const execGitPromise = await new Promise((resolve,reject)=>{
    exec(`cd "${parentPath}" && git log`, (err,stdout)=>{
      if(err){
        reject(err)
      } else if (stdout) resolve(stdout);
    })
  }).then((sucess)=>{
    return true
  }).catch((err)=>{
      return false
    })
    return execGitPromise
}