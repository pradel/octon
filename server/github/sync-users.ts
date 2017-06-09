import { request } from 'graphql-request';
import * as logger from 'winston';
import { User } from '../types';
import syncUserRepositories from './sync-user-repositories';

export default async function synchronizeUsers() {
  // Get all users in db
  const query = `
    query allUsers {
      allUsers {
        id
        username
      }
    }
  `;
  let data: any = await request(process.env.GRAPHCOOL_URL, query);
  // TODO check if error
  const users: User[] = data.allUsers;
  const promises = users.map(syncUserRepositories);
  data = await Promise.all(promises);
  logger.log('info', `${data.length} users updated`);
}
