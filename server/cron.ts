import * as schedule from 'node-schedule';
import * as logger from 'winston';
import synchronizeNewReleases from './github/sync-new-releases';
import synchronizeUsers from './github/sync-users';
import notification from './notifications';

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

  schedule.scheduleJob('0 13 * * *', async () => {
    try {
      logger.log('info', 'cron: dailyNotification start');
      await notification('daily');
      logger.log('info', 'cron: dailyNotification end');
    } catch (err) {
      logger.log('error', 'cron: weeklyNotification error', err);
    }
  });

  schedule.scheduleJob('0 13 * * 6', async () => {
    try {
      logger.log('info', 'cron: weeklyNotification start');
      await notification('weekly');
      logger.log('info', 'cron: weeklyNotification end');
    } catch (err) {
      logger.log('error', 'cron: weeklyNotification error', err);
    }
  });

  // TODO check each day:
  // - no repositories have same type and refId
  // - no releases have same repository and refId
  // - no repositories without at least one user
}
