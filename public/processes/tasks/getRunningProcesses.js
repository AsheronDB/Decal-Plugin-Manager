const { execSync } = require('child_process');

const {
    TASKLIST_PATH, AC_CLIENT_FILENAME, DECAL_AGENT_FILENAME
} = require('../../globals/constants');

function getTaskList() {
    return execSync(TASKLIST_PATH).toString();
}

function isACClientRunning(processes) {
    return processes.includes(AC_CLIENT_FILENAME);
}

function isDecalRunning(processes) {
    return processes.includes(DECAL_AGENT_FILENAME);
}

module.exports = async function (localStore) {

    let processes = getTaskList();
    localStore.set('programs.decal.running', isDecalRunning(processes));
    localStore.set('programs.acclient.running', isACClientRunning(processes));

}


