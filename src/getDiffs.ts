import pandiff = require("pandiff");
import * as vscode from "vscode";
import { simpleGit, SimpleGit, CleanOptions } from 'simple-git';
import * as fs from 'fs';

const git: SimpleGit = simpleGit().clean(CleanOptions.FORCE);
const child_process = require('child_process')
const exec = child_process.exec;

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

    export async function getGitDiffs(hash:string,filename:string,filePath:string,extensionPath:string):Promise<string> {

        const par = filePath.slice(0,filePath.lastIndexOf('/')+1);

        const tmp = extensionPath + '/tmp/' + filename
        
        const rev = await new Promise<string>((resolve, reject) => {
            exec(`cd ${par} && git show ${hash}:${filename}`, (err:Error,stdout:string,stderr:string)=>{
                if(err){
                    reject(err)
                    return
                }
                if(stderr){
                    reject(new Error(stderr))
                }
                resolve(stdout)
            })
        }) //await git.show(`${hash}:${filename} > ${tmp}`);

        fs.writeFileSync(tmp,rev)
        
        const result = await runPandiffAndGetHTML(tmp,filePath)

        fs.unlink(tmp,(err)=>{
            if(err){
                throw err
            }
        });

        return result
    }
