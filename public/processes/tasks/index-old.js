const Axios = require('axios');
const fs = require('fs');
const { execSync } = require('child_process');

console.log("i'm a worker process");

const APP_PATH = process.argv[5];
const DOWNLOAD_CACHE_PATH = APP_PATH + '\\Download_Cache\\';
const PLUGIN_URL = 'https://gitlab.com/trevis/dothingsbot/uploads/d15cd820fbb19e85ae22b23479c1b236/DoThingsBotInstaller-2.0.0.6.exe';

const exiftool = require('exiftool-vendored').exiftool;


async function readDllProperties() {

    console.log('READING DLL PROPERTIES')
    //  let filePath = 'C:\\games\\Decal Plugins\\ScrollReader3\\ScrollReader3.dll';

    //let version = execSync(`C:\\Windows\\System32\\wbem\\wmic.exe DATAFILE where Name="C:\\\\Program Files (x86)\\\\TreeStats\\\\TreeStats.dll" GET /value`).toString();

    try {

        let tags = await exiftool.read('C:\\Program Files (x86)\\TreeStats\\TreeStats.dll')

        console.log(tags);

    } catch (error) {

        console.log(error);
    }





}







async function downloadFile(fileUrl, outputLocationPath, filename) {

    if (!fs.existsSync(outputLocationPath)) fs.mkdirSync(outputLocationPath);
    let destFilePath = outputLocationPath + '\\' + filename;
    const writer = fs.createWriteStream(destFilePath);

    return Axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream',
    }).then(response => {
        return new Promise((resolve, reject) => {
            response.data.pipe(writer);
            let error = null;
            writer.on('error', err => {
                error = err;
                writer.close();
                reject(err);
            });
            writer.on('close', () => {
                if (!error) {
                    resolve(true);
                }
            });
        });
    });
}

async function installPluginWithInstaller(outputLocationPath, filename) {
    return new Promise((resolve, reject) => {
        try {
            let installerPath = outputLocationPath + '\\' + filename;
            let wut = execSync(`${installerPath} /S`); // Install silently
            console.log('plugin installed')
            resolve();
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}


function uninstallPluginWithInstaller(uninstallerPath) {
    return new Promise((resolve, reject) => {
        try {
            let wut = execSync(`${uninstallerPath} /S`); // Uninstall silently
            console.log('plugin uninstalled')
            resolve();
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

function cleanupPluginCache(outputLocationPath, filename) {
    let installerPath = outputLocationPath + '\\' + filename;
    fs.unlinkSync(installerPath);
    console.log('plugin cleanup done')
}

process.on('message', async (msg) => {

    if (msg && msg.action == 'install') {
        await downloadFile(PLUGIN_URL, DOWNLOAD_CACHE_PATH, 'DoThingsBotInstaller-2.0.0.6.exe');

        // CHECK IF INSTALLER
        await installPluginWithInstaller(DOWNLOAD_CACHE_PATH, 'DoThingsBotInstaller-2.0.0.6.exe');

        // CHECK IF DLL FLOW

        // -- install plugin from DLL, handle registry

        // CLEANUP

        cleanupPluginCache(DOWNLOAD_CACHE_PATH, 'DoThingsBotInstaller-2.0.0.6.exe');

        await uninstallPluginWithInstaller('C:\\Games\\Decal Plugins\\DoThingsBot\\uninstall.exe');
    }


    readDllProperties();

    // Send status back to main process
    // process.send(`Hash of ${m} is: ${h.digest('hex')}`);
});
