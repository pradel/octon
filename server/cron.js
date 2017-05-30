const logger = require('winston');
const schedule = require('node-schedule');
const synchronizeNewReleases = require('./github/sync-new-releases');
const synchronizeUsers = require('./github/sync-users');

module.exports = async function startJobs() {
  // Run each hour
  schedule.scheduleJob('30 * * * *', async () => {
    try {
      logger.log('info', 'cron: synchronizeNewReleases start');
      await synchronizeNewReleases();
      logger.log('info', 'cron: synchronizeNewReleases end');
    } catch (err) {
      logger.log('error', 'cron: synchronizeNewReleases error', err);
    }
  });

  // Run each 2 hours
  schedule.scheduleJob('0 */2 * * *', async () => {
    try {
      logger.log('info', 'cron: synchronizeUsers start');
      await synchronizeUsers();
      logger.log('info', 'cron: synchronizeUsers end');
    } catch (err) {
      logger.log('error', 'cron: synchronizeUsers error', err);
    }
  });
};
