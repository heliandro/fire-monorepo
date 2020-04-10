const { exec, spawn } = require('child_process');
const os = require('os');
const net = require('net');
const fs = require('fs');
const ps = require('ps-node');
const {performance} = require('perf_hooks');
const {Platforms} = require('../data/enums/platorm.enum');
const {FileOperation} = require('../data/enums/file-operation.enum');
const {Colors} = require('../data/enums/colors.enum');


// FILE HELPERS
const _execCommand = (cmd) => {
    return new Promise((resolve, reject) => {
         exec(cmd, (err, stdout, stderr) => err
            ? reject(({ isSuccess: false, log: err}))
            : resolve(({ isSuccess: true, log: stdout ? stdout : stderr}))
         );
    });
};

const _taskSuccess = (arrParam, task) => {
    return Array.isArray(arrParam) && arrParam.length > 0
        ? [...arrParam, {name: task.name, isSuccess: true}] : [{name: task.name, isSuccess: true}];
};

const _taskFail = (arrParam, task) => {
    return Array.isArray(arrParam) && arrParam.length > 0
        ? [...arrParam, {name: task.name, isSuccess: false}] : [{name: task.name, isSuccess: false}];
};

// only for windows 10
const _lookActiveProcess = () => {
    ps.lookup({command: 'node', psargs: '--debug'},  (err, listOfProcess) => {
        if (err) throw new Error(err);

        listOfProcess.forEach((process) => {
            if (process) console.log('PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments);
        });
    });
};


// ===== FUNCTIONS ===========================================
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x); // thanks to Eric Elliott

const colorLog = (color, text) => console.log(`\x1b[${color}${text}\x1b[0m`);

const myOS = {
    isWindowns: os.platform().includes(Platforms.WINDOWNS),
    isMac: os.platform().includes(Platforms.MAC),
    isLinux: os.platform().includes(Platforms.LINUX)
};

const transformPathForOS = (path, plusPathArr) => {
    if (!path) throw Error('transformPathForOS::invalid parameters.');
    // 1º create separator path
    // 2º add separator in path if necessary
    // 3º join array path with separator
    // 4º finally concat all in new path string
    return pipe(
    (data) => ({...data, separator: myOS.isWindowns ? '\\' : '/'}) ,
        (data) =>  ({...data, path: data.path.charAt(data.path.length-1).includes(data.separator) ? data.path : data.path + data.separator}),
        (data) => ({ ...data, plusPath: Array.isArray(data.plusPathArr) ? plusPathArr.join(data.separator) + data.separator : '' }),
        (data) => myOS.isWindowns ? data.path + data.plusPath : data.path.replace(/\\/g, '/') + data.plusPath
    )({path, plusPathArr})
};

const readAndChangeFile = (filePath, arguments) => {

    if (!filePath || !arguments.operation || !arguments.attrName)
        throw Error('readAndChangeFile::invalid parameters.');

    try {
        const fileData = fs.readFileSync(filePath);

        let newFileData = {};
        switch (arguments.operation) {
            case FileOperation.ADD: {
                newFileData = {
                    ...JSON.parse(fileData),
                    [arguments.attrName]: !!arguments.attrValue ? arguments.attrValue: ''
                };
                break;
            }
            case FileOperation.REMOVE: {
                console.log('entrou no remove!!!');
                const { [arguments.attrName]: undefined, ...fileDataAux } = JSON.parse(fileData);
                newFileData = { ...fileDataAux };
                break;
            }
            default: {
                console.log('readAndChangeFile::operation not found!');
                // ...
            }
        }

        fs.writeFileSync(filePath, JSON.stringify(newFileData));

        return {
            oldData: JSON.parse(fileData),
            newData: newFileData,
            isSuccess: true
        }
    } catch (err) {
        throw Error('readAndChangeFile::error', err);
    }

};

const getNetworkIP = () => {
    const socket = net.createConnection(80, 'www.google.com');
    return new Promise((resolve, reject) => {
        socket.on('connect', () => {
            const myIP = socket.address().address;
            socket.end();
            resolve(myIP);
        });
        socket.on('error', err => reject(err));
    });
};

const runSimpleTasksSync = async (tasks) => {
    if (!Array.isArray(tasks)) {
        return Promise.reject('tasks is not an array');
    }

    const start = performance.now();
    colorLog(Colors.ORANGE, '\nWait a few seconds...\n');

    let result = await tasks.reduce(async(p, task) => {
        let accumulatorPromiseArr = await p;
        try {
            if (!(!task.cmd || !task.exec)) {
                return _taskFail(accumulatorPromiseArr, task);
            }
            let result = task.cmd ? await _execCommand(task.cmd) : await task.exec();
            console.log(result.log ? result.log : '');
            return result || result.isSuccess
                ? _taskSuccess(accumulatorPromiseArr, task)
                : _taskFail(accumulatorPromiseArr, task);
        } catch (err) {
            console.error(err.log ? err.log : '');
            return _taskFail(accumulatorPromiseArr, task);
        }
    }, Promise.resolve([]));

    console.log('\n');
    result.forEach(task => colorLog(
        task.isSuccess ? Colors.GREEN : Colors.RED,
        `${task.name} | ${task.isSuccess ? 'SUCCESS!' : 'FAIL!'}`
    ));

    const end = performance.now();
    colorLog(Colors.ORANGE, `\nFinished in: ${((end-start)).toFixed(3)}ms`);
    return result;
};

const runServerTask = (cmd) => {
    const listener = spawn(cmd, [], {shell: true});
    listener.stdout.on('data', data => colorLog(Colors.GREEN, `${data}`));
    listener.stderr.on('data', data => colorLog(Colors.RED, `${data}`));
    listener.on('close', (code) => colorLog(Colors.ORANGE, `child process terminated with code ${code}`));
    listener.on('exit', (code, signal) => colorLog(Colors.ORANGE, `child process terminated due to receipt of signal ${signal}`));
};

module.exports = {
    pipe,
    colorLog,
    myOS,
    transformPathForOS,
    readAndChangeFile,
    getNetworkIP,
    runSimpleTasksSync,
    runServerTask,
};
