import pandiff = require("pandiff");
import * as vscode from "vscode";
import { simpleGit, SimpleGit, CleanOptions } from 'simple-git';
const git: SimpleGit = simpleGit().clean(CleanOptions.FORCE);

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

    export async function getGitShow(hash:string,filename:string,parentPath:string):Promise<Buffer | null> {

        const rev = git.cwd({
            path: parentPath
        }).showBuffer(`${hash}:${filename}`);

        return rev.then((b)=>{
            return b
        }).catch((err)=>{
            vscode.window.showErrorMessage(err.message)
            return null
        })
    }


