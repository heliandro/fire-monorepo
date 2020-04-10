const moment = require('moment');
const {FileOperation} = require('../data/enums/file-operation.enum.js');

module.exports = (async() => {
    const {appPath, corePath, artifactsPath,  environment} = require('../../index.js');
    const {transformPathForOS, readAndChangeFile, getNetworkIP} = require('./functions');
    const comand = require('./comands.js');
    const today = moment().format('DD-MM-YYYY_hh-mm-ss');
    const myIP = await getNetworkIP();

    return {
        changeCapacitorConfig: {
            name: '[OS] Configure "capacitor.config.json" file from \"' + environment.capacitorAppName
                + '\" project to ' + (environment.production? 'production':'development with my IP'),
            exec: () => {
                if (environment.production) {
                    return readAndChangeFile(appPath + 'capacitor.config.json', {
                        attrName: 'server',
                        operation: FileOperation.REMOVE
                    });
                }
                return readAndChangeFile(appPath + 'capacitor.config.json', {
                    attrName: 'server',
                    attrValue: {
                        url: `http://${myIP}:4200`,
                        hostname: "app"
                    },
                    operation: FileOperation.ADD
                });
            }
        },
        runNgServe: {
            name: `[Angular CLI] run ng serve on configured ip: ${myIP}`,
            cmd: comand.changeDir(appPath) + ` && ng serve --host ${myIP}`,
            type: 'spawn',
        },
        buildAngular: {
            name: `[Angular CLI] Build angular project for ${environment.production?'production':'development'} to www folder`,
            cmd: comand.changeDir(appPath) + ` && ng ${environment.production?'build --prod':'build'}`
        },
        copyGoogleServicesJSON: {
            name: `[OS] Copy file google-services${environment.production?'-prod':'-dev'}.json`
                + ' to ' + transformPathForOS(appPath, ['android', 'app']) + ' folder',
            cmd: comand.copyFileTo(
                transformPathForOS(corePath, ['configuration']) + `google-services${environment.production?'-prod':'-dev'}.json`,
                transformPathForOS(appPath, ['android', 'app']),
                'google-services.json'
            )
        },
        capacitorCopy: {
            name: '[Capacitor] Copy www folder to android project',
            cmd: comand.changeDir(appPath) + ' && npx cap copy android'
        },
        buildApk: {
            name: `[Gradle] Build android project for ${environment.production?'production':'development'} and generate apk file`,
            cmd: comand.changeDir(transformPathForOS(appPath, ['android'])) + ' && gradlew assembleDebug'
        },
        copyApkToArtifacts: {
            name: '[OS] Copy android apk file to '
                + transformPathForOS(artifactsPath, [environment.production?'prod-apks':'debug-apks'])
                + ' folder',
            cmd: comand.copyFileTo(
                transformPathForOS(appPath, ['android', 'app', 'build', 'outputs', 'apk', 'debug']) + 'app-debug.apk',
                    transformPathForOS(artifactsPath, [environment.production?'prod-apks':'debug-apks']),
                `app-debug_${today}.apk`
            )
        },
        installApk: {
            name: '[Gradle] Install android apk on your device',
            cmd: comand.changeDir(transformPathForOS(appPath, ['android'])) + ' && gradlew installDebug'
        }
    };
})();
