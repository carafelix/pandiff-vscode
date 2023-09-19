import pandiff = require("pandiff");
import * as vscode from "vscode";
import * as fs from 'fs';
import * as path from 'path'
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

    export async function getGitDiffs(hash:string,filename:string,filePath:string,extensionPath:string):Promise<string> {

        const parentPath = path.dirname(filePath)
        const tmpFolder = path.join(extensionPath, 'tmp')
        const tmp = tmpFolder + filename

        const rev = await git.cwd({
            path: parentPath
        }).show(`${hash}:${filename}`);

        if(!fs.existsSync(tmpFolder)){
            fs.mkdirSync(tmpFolder)
        }

        fs.writeFileSync(tmp,rev)
        
        const result = await runPandiffAndGetHTML(tmp,filePath)

        fs.unlink(tmp,(err)=>{
            if(err){
                throw err
            }
        });

        return result
    }
