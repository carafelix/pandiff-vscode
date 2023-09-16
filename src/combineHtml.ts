export function combineHTML(content:string,style:string){
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Files Diff</title>
    </head>
    <body>
        <style>
            ${style}
        </style>
        <div align="center">
            ${content}
        </div>
    </body>
    </html>`;
}