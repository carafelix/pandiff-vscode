import pandiff = require("pandiff");
import * as vscode from "vscode";
import { simpleGit, SimpleGit, CleanOptions } from 'simple-git';

const git: SimpleGit = simpleGit().clean(CleanOptions.FORCE);


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

    export async function getGitDiffs(hash:string,filename:string,filePath:string):Promise<string> {

        const par = filePath.slice(0,filePath.lastIndexOf('/')+1);

        git.addConfig('difftool.pandiff.cmd','pandiff "$LOCAL" "$REMOTE" --to=html', false, 'global');

        git.addConfig('alias.pandiff','difftool -t pandiff -y', false, 'global');

        const commands = ['pandiff', hash, 'HEAD', filename];

        const out = await simpleGit(par, {
            trimmed: true
        }).raw(...commands);

        return out
    }
