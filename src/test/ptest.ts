import pandiff = require("pandiff");

async function supa(str1:string,str2:string){
    const result = await pandiff(str1,str2, {
        to:'html',
        files: true
    })
    console.log(result);
    
    return result
}
supa('/home/martincito/repos/pandiff-vscode/testFiles/gateway.epub','/home/martincito/repos/pandiff-vscode/testFiles/gatewayed.epub')

