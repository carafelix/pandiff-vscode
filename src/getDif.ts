const exec = require('child_process').exec;

    export async function runPandiffAndGetHTML(file1: string, file2: string): Promise<string> {
        return new Promise((resolve, reject) => {
        const command = `pandiff ${file1} ${file2} --to=html`;

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
