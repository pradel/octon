import { request } from 'graphql-request';
import * as logger from 'winston';
import syncUserRepositories from './github/sync-user-repositories';
import { User } from './types';
import { graphqlFetch } from './utils';

async function apiSyncUserRepositories(req, res) {
  // TODO make a webhook from graphcool on user created
  if (!req.body.userId) {
    res.json({ success: false, message: 'Invalid params' });
    return;
  }
  try {
    const query = `
      query User($id: ID) {
        User(id: $id) {
          id
          username
          lastGithubSyncAt
        }
      }
    `;
    const data: any = await request(process.env.GRAPHCOOL_URL, query, {
      id: req.body.userId,
    });
    const user: User = data.User;
    // User not found
    if (!user) {
      res.json({ success: false, message: 'User not found' });
      return;
    }
    // TODO check user.lastGithubSyncAt is not < 2h
    await syncUserRepositories(user);
    res.json({ success: true });
  } catch (err) {
    logger.log('error', '/api/sync-stars', err);
    res.json({ success: false, message: err.message });
  }
}

export { apiSyncUserRepositories };
