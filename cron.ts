const cron = require('node-cron');
const shell = require('shelljs');

cron.schedule('* * * * *',  function(){
    console.log('Running cronjob');
})