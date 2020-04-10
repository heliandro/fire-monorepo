const capBuildModule = require('./core/make-builds');
const capServerModule = require('./core/cap-app-server');
const {transformPathForOS} = require('./core/helpers/functions');

// Project path
const projectPath = __dirname;

// Environment
const environment = {
    production: false,
    capacitorAppName: 'app-angular'
};

module.exports = {
    environment,
    appPath: transformPathForOS(projectPath, [environment.capacitorAppName]),
    //functionsPath: transformPathForOS(projectPath, ['functions']),
    corePath: transformPathForOS(projectPath, ['core']),
    //gcpIntegrationNodePath: transformPathForOS(projectPath, ['gcp-app-engine']),
    //gcpWebAngularPath: transformPathForOS(projectPath, ['gcp-hosting']),
    //sharedLibPath: transformPathForOS(projectPath, ['shared-lib']),
    artifactsPath: transformPathForOS(projectPath, ['artifacts']),
    // ========================================
    // Functions
    // ========================================
    runServer: () => capServerModule.runServer(),
    buildApk: (isInstall) => capBuildModule.buildApk(isInstall)
};
