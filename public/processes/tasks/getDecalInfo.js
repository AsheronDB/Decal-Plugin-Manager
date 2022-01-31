const regedit = require('regedit');




const {
    readFileProperties,
    isOSWin64
} = require('../../globals/functions');

const {
    DECAL_AGENT_FILENAME, DECAL_REGISTRY_PATH_32, DECAL_REGISTRY_PATH_64
} = require('../../globals/constants');

const DECAL_REGISTRY_PATH = isOSWin64() ? DECAL_REGISTRY_PATH_64 : DECAL_REGISTRY_PATH_32;
const DECAL_REGISTRY_AGENT_PATH = DECAL_REGISTRY_PATH + '\\Agent';

console.log('getDecalInfo');

async function getDecalRegistry() {

    let isDecalInstalled = true;

    if (isDecalInstalled) {

        try {

            let obj = {};

            let decalRegistryAgent = await regedit.promisified.list([DECAL_REGISTRY_AGENT_PATH]);

            console.log('Decal registry agenth path')
            let decalInfoObj = decalRegistryAgent[DECAL_REGISTRY_AGENT_PATH];
            
            console.log(decalInfoObj);

            if (decalInfoObj.exists) {

                let decalAgentFilePath = `${decalInfoObj.values['AgentPath'].value}\\${DECAL_AGENT_FILENAME}`;
                let decalAgentProps = await readFileProperties(decalAgentFilePath);

                obj = {
                    installed: true,
                    version: decalAgentProps['ProductVersionNumber'],
                    copyright: decalAgentProps['LegalCopyright'],
                    directory: decalAgentProps['Directory']
                };

            } else {
                obj.installed = false;
            }


            // console.log();

            
            return obj;
        } catch (e) {
            console.log('Error while listing keys:', e.message)
        }

    } else {
        console.log('Decal not installed');
    }
}


module.exports = async function (appPath, localStore) {

    regedit.setExternalVBSLocation(appPath + '/resources/regedit/vbs');

    let decalInfo = await getDecalRegistry();
    localStore.set('programs.decal.version', decalInfo.version);
    localStore.set('programs.decal.copyright', decalInfo.copyright);
    localStore.set('programs.decal.directory', decalInfo.directory);
    localStore.set('programs.decal.installed', decalInfo.installed);
}