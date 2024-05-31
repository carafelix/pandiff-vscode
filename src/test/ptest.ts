import pandiff = require("pandiff");

const testFile = [
  "/home/martincito/repos/pandiff-vscode/testFiles/gateway.epub",
  "/home/martincito/repos/pandiff-vscode/testFiles/gatewayed.epub",
];

async function supa(str1: string, str2: string) {
  const result = await pandiff(str1, str2, {
    to: "html",
    files: true,
  });
  console.log(result);

  return result;
}
supa(testFile[0], testFile[1]);
