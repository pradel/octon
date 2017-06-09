import * as schedule from 'node-schedule';
import * as logger from 'winston';
import synchronizeNewReleases from './github/sync-new-releases';
import synchronizeUsers from './github/sync-users';

export default function startJobs(): void {
  // Run each 1 hours
  schedule.scheduleJob('30 */1 * * *', async () => {
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
}
