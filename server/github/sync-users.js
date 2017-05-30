const logger = require('winston');
const { graphqlFetch } = require('../utils');
const syncUserRepositories = require('./sync-user-repositories');

module.exports = async function synchronizeUsers() {
  // Get all users in db
  const query = `
    query allUsers {
      allUsers {
        id
        username
      }
    }
  `;
  let data = await graphqlFetch(process.env.GRAPHCOOL_URL, query);
  // TODO check if error
  const users = data.data.allUsers;
  const promises = users.map(syncUserRepositories);
  data = await Promise.all(promises);
  logger.log('info', `${data.length} users updated`);
};
