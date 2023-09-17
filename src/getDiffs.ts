const exec = require('child_process').exec;

    export async function runPandiffAndGetHTML(f1Path: string, f2Path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const command = `pandiff ${f1Path} ${f2Path} --to=html`;

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
