const logger = require('winston');
const { graphqlFetch } = require('./utils');
const syncUserRepositories = require('./github/sync-user-repositories');

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
    const data = await graphqlFetch(process.env.GRAPHCOOL_URL, query, {
      id: req.body.userId,
    });
    // TODO check if errors
    const user = data.data.User;
    // User not found
    if (!user) {
      res.json({ success: false, message: 'Invalid params' });
      return;
    }
    // TODO check lastGithubSyncAt is not < 2h
    await syncUserRepositories(user);
    res.json({ success: true });
  } catch (err) {
    logger.log('error', '/api/sync-stars', err);
    res.json({ success: false, message: err.message });
  }
}

exports.apiSyncUserRepositories = apiSyncUserRepositories;
