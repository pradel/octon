const logger = require('winston');
const schedule = require('node-schedule');
const synchronizeNewReleases = require('./github/sync-new-releases');
const synchronizeUsers = require('./github/sync-users');

module.exports = async function startJobs() {
  // Run each 3 hours
  schedule.scheduleJob('30 */3 * * *', async () => {
    try {
      logger.log('info', 'cron: synchronizeNewReleases start');
      await synchronizeNewReleases();
      logger.log('info', 'cron: synchronizeNewReleases end');
    } catch (err) {
      logger.log('error', 'cron: synchronizeNewReleases error', err);
    }
  });

  // Run each 6 hours
  schedule.scheduleJob('0 */6 * * *', async () => {
    try {
      logger.log('info', 'cron: synchronizeUsers start');
      await synchronizeUsers();
      logger.log('info', 'cron: synchronizeUsers end');
    } catch (err) {
      logger.log('error', 'cron: synchronizeUsers error', err);
    }
  });
};
