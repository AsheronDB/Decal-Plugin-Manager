var regedit = require('regedit');

const {
    DECAL_REGISTRY_PATH_32, DECAL_REGISTRY_PATH_64
} = require('../../globals/constants');

const {
    readFileProperties,
    isOSWin64
} = require('../../globals/functions');

const DECAL_REGISTRY_PATH = isOSWin64() ? DECAL_REGISTRY_PATH_64 : DECAL_REGISTRY_PATH_32;
console.log(DECAL_REGISTRY_PATH);

async function getDecalPluginRegistry() {

    let isDecalInstalled = true;

    if (isDecalInstalled) {

        try {
            let pluginsList = await regedit.promisified.list([DECAL_REGISTRY_PATH + '\\Plugins']);


            let plugins = await Promise.all(pluginsList[DECAL_REGISTRY_PATH + '\\Plugins'].keys.map(async (key) => {
                return new Promise(async (resolve) => {
                    let pluginData = await regedit.promisified.list([DECAL_REGISTRY_PATH + '\\Plugins\\' + key]);
                    let pluginObj = pluginData[DECAL_REGISTRY_PATH + '\\Plugins\\' + key];
                    resolve(pluginObj.values);
                });
            }));

            //console.log(plugins);
            // 
            return plugins.filter(plugin => plugin[''].value !== 'Decal Hotkey System');
        } catch (e) {
            console.log('Error while listing keys:', e.message)
        }

    } else {
        console.log('Decal not installed');
    }




}

async function readDllProperties(pluginRegistryInfo) {

    //console.log('READING DLL PROPERTIES')

    let info = pluginRegistryInfo;

    if (!info.Path) {
        console.log('NO PATH')
    }

    if (!info.Assembly) {
        console.log('NO ASSEMBLY')
    }
    let dllPath = `${info.Path.value}\\${info.Assembly.value}`;

    try {
        let tags = await readFileProperties(dllPath);
    
        return tags;
       
    } catch (error) {
        console.log(error);
        return error;
    }


}


function normalizePluginData(data) {

    let obj = {
        name: data.registry[''].value,
        version: data.dll.ProductVersion,
        folder: data.dll.Directory,
        path: data.registry.Path.value,
        copyright: data.dll.LegalCopyright
    };

    return obj;

}

async function getPluginList() {

    let pluginRegistryList = await getDecalPluginRegistry();

    let pluginList = await Promise.all(pluginRegistryList.map(async (plugin) => {

        return new Promise(async (resolve) => {
            let pluginData = {
                registry: plugin,
                dll: await readDllProperties(plugin)
            }

            let obj = normalizePluginData(pluginData);
            resolve(obj);
        });
     
    }));

    return pluginList;

}

module.exports = async function(appPath, localStore) {

    regedit.setExternalVBSLocation(appPath + '/resources/regedit/vbs');

    let plugins = await getPluginList();
    localStore.set('installedPlugins', plugins);
}