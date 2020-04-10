const {runServerTask} = require('./helpers/functions.js');

module.exports.runServer = async() => {
  const tasks = await require('./helpers/tasks.js');

  const tasksArr = [
    tasks.runNgServe
  ];

  tasksArr.forEach(task => {
    runServerTask(task.cmd);
  })
};

