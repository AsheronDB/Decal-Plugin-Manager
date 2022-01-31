const exiftool = require('exiftool-vendored').exiftool;

async function readFileProperties(path) {
    try {
        return await exiftool.read(path);
    } catch (error) {
        console.log(error);
        return error;
    }
}

function isOSWin64() {
    return process.arch === 'x64' || process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432');
}

module.exports = {
    readFileProperties,
    isOSWin64
};