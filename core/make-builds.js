const {runSimpleTasksSync} = require('./helpers/functions.js');

module.exports.buildApk = async(isInstall = false) => {
    const tasks = await require('./helpers/tasks.js');

    const tasksArr = [
        tasks.changeCapacitorConfig,
        tasks.buildAngular,
        tasks.capacitorCopy,
        // tasks.copyGoogleServicesJSON,
        tasks.buildApk,
        tasks.copyApkToArtifacts
    ];

    if (isInstall) tasksArr.push(tasks.installApk);

    await runSimpleTasksSync(tasksArr);
};
