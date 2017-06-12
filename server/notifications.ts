import { request } from 'graphql-request';
import * as subDays from 'date-fns/sub_days';
import * as format from 'date-fns/format';
import { User, Release } from './types';
import { dailyUpdate } from './emails';

async function getUsers(type: string): Promise<User[]> {
  if (type === 'daily') {
    const query = `
      query allUsers($dailyNotification: Boolean) {
        allUsers(filter: {
          dailyNotification: $dailyNotification
        }) {
          id
          email
        }
      }
    `;
    const data: any = await request(process.env.GRAPHCOOL_URL, query, {
      dailyNotification: true,
    });
    return data.allUsers;
  }
  const query = `
    query allUsers($weeklyNotification: Boolean) {
      allUsers(filter: {
        weeklyNotification: $weeklyNotification
      }) {
        id
        email
      }
    }
  `;
  const data: any = await request(process.env.GRAPHCOOL_URL, query, {
    weeklyNotification: true,
  });
  return data.allUsers;
}

async function getReleases(type: string, user: User): Promise<Release[]> {
  const now = new Date();
  // Daily
  let startDate = subDays(now, 1);
  if (type === 'weekly') {
    startDate = subDays(now, 7);
  }
  const query = `
    query allReleases($userId: ID!, $startDate: DateTime!, $now: DateTime!) {
      allReleases(
        orderBy: publishedAt_DESC
        filter: {
          publishedAt_gte: $startDate
          publishedAt_lt: $now
          repository: {
            users_some: {
              id: $userId
            }
          }
        }
      ) {
        id
        tagName
        htmlUrl
        publishedAt
        repository {
          id
          name
          avatar
          htmlUrl
        }
      }
    }
  `;
  const data: any = await request(process.env.GRAPHCOOL_URL, query, {
    userId: user.id,
    startDate,
    now,
  });
  return data.allReleases;
}

export default async function notification(type: string): Promise<void> {
  const users = await getUsers(type);
  users.forEach(async user => {
    let releases: any[] = await getReleases(type, user);
    if (releases.length > 0) {
      releases = releases.map(release => {
        release.publishedAt = format(release.publishedAt, 'ddd DD MMM - h.mma');
        return release;
      });
      await dailyUpdate(type, user, releases);
    }
  });
}
