const os = require('os');
const {Platforms} = require('../data/enums/platorm.enum');
const platform = os.platform();

module.exports = {
    changeDir: (dirPath) => 'cd ' + dirPath, // windows e linux is 'cd'
    copyFileTo: (file, toPath, newName) => {
        const command = platform.includes(Platforms.WINDOWNS) ? 'xcopy' : 'cp';
        const options = platform.includes(Platforms.WINDOWNS) ? '* /Y' : '';
        return command + ' ' + file + ' ' + toPath + (!!newName ? newName + options : '')
    },
};
