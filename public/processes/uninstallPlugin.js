
const fs = require('fs');
const Axios = require('axios');
const Store = require('electron-store');
const { execSync } = require('child_process');

let appPath = process.argv[3];
const localStore = new Store({ cwd: appPath });

const DOWNLOAD_CACHE_PATH = `${appPath}\\Download_Cache\\`;


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
    console.log('message event in installPlugin')
    console.log(msg);


    if (msg) {

        
        await downloadFile(msg.data.installerUrl, DOWNLOAD_CACHE_PATH, msg.data.installerFilename);

        // CHECK IF INSTALLER
        await installPluginWithInstaller(DOWNLOAD_CACHE_PATH, msg.data.installerFilename);

        // CHECK IF DLL FLOW

        // -- install plugin from DLL, handle registry

        // CLEANUP

        cleanupPluginCache(DOWNLOAD_CACHE_PATH, msg.data.installerFilename);

        //await uninstallPluginWithInstaller('C:\\Games\\Decal Plugins\\DoThingsBot\\uninstall.exe');
    }



    process.send({ status: 'finished' });
});

process.send({ status: 'ready' });