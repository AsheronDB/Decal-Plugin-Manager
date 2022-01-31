const fs = require('fs');
const Store = require('electron-store');


let appPath = process.argv[3];
const localStore = new Store({ cwd: appPath });

const { getRunningProcesses, getDecalInfo, getInstalledPlugins } = require('./tasks');

const TASK_TIMER_MS = 10000;

async function runTasks() {
    await getRunningProcesses(localStore);
    await getDecalInfo(appPath, localStore);
    await getInstalledPlugins(appPath, localStore);
}

function runTimer() {
    setTimeout(async () => {
        await runTasks();
        runTimer();
    }, TASK_TIMER_MS);
}

process.on('message', async (msg) => {
    console.log('worker timer started')
    await runTasks();
    runTimer();
});

process.send({ status: 'ready' });