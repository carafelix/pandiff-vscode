import pandiff = require("pandiff");
import * as vscode from "vscode";
import { simpleGit, SimpleGit, CleanOptions } from 'simple-git';
const git: SimpleGit = simpleGit().clean(CleanOptions.FORCE);

export async function runPandiffAndGetContent(f1Path: string, f2Path: string, format = 'html', outPath? : string): Promise<string>{
    try {
        if(outPath){
            await pandiff(f1Path, f2Path, {
                to: format,
                files: true,
                output: outPath,
            });
            return ''
        }

        const result = await pandiff(f1Path, f2Path, {
            to: 'html',
            files: true,
        });

        if (!result) {
            throw new Error('Error while running Pandiff');
        }

        return result;
    } catch (error) {
        switch (error){
            case 64:
                vscode.window.showErrorMessage(`Pandoc Error: ${error}. Check your file internal structure and entry points`);
        }
        return ''
    }
}

    export async function getGitShow(hash:string,filename:string,parentPath:string):Promise<Buffer | null> {

        const revision = git.cwd({
            path: parentPath
        }).showBuffer(`${hash}:./${filename}`);

        return revision.then((b)=>{
            return b
        }).catch((err)=>{
            vscode.window.showErrorMessage(err.message)
            return null
        })
    }


