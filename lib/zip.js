
// require modules
const compressing = require('compressing');

module.exports.zipFold = function  (output_zip, dirPath) {
return compressing.zip.compressDir(dirPath, output_zip)
}

module.exports.unzipFold = function  (input_zip, dirPath) {
 return compressing.zip.uncompress(input_zip, dirPath)
 }