const logger = require('winston');
const getLatestRelease = require('./feed');
const { graphqlFetch } = require('../utils');

const githubGraphqlUrl = 'https://api.github.com/graphql';

function formatRepository(repo) {
  return {
    refId: repo.id,
    name: `${repo.owner.login}/${repo.name}`,
    avatar: repo.owner.avatarUrl,
    htmlUrl: repo.url,
    type: 'github',
    releases: [],
  };
}

async function getAllUserStars(user, after) {
  const query = `
    query getAllUserStars {
      user(login: "${user.username}") {
        login
        starredRepositories(first: 100 ${after ? `after: "${after}"` : ''}) {
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            node {
              id
              name
              url
              owner {
                login
                avatarUrl
              }
            }
          }
        }
      }
    }
  `;

  let data = await fetch(githubGraphqlUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  });
  data = await data.json();
  if (!data.data) {
    console.error(data);
    throw new Error('getAllUserStars failed');
  }
  data = data.data.user.starredRepositories;
  // Format repositories
  let repositories = data.edges.map(({ node }) => formatRepository(node));
  // Fetch for each new page
  // Limit to 1000 stars
  if (data.pageInfo.hasNextPage && repositories.length < 1000) {
    const ret = await getAllUserStars(user, data.pageInfo.endCursor);
    repositories = repositories.concat(ret);
  }
  return repositories;
}

async function getExistingRepositories(repositoriesRefIds) {
  const query = `
    query allRepositories($repositoriesRefIds: [String!]) {
      allRepositories(filter: {
        refId_in: $repositoriesRefIds
      }) {
        id
        refId
      }
    }
  `;
  const data = await graphqlFetch(process.env.GRAPHCOOL_URL, query, {
    repositoriesRefIds,
  });
  // TODO check if errors
  return data.data.allRepositories;
}

async function addNewRepositories(user, repositories) {
  const query = `
    mutation addNewRepositories($repositories: [UserrepositoriesRepository!]) {
      updateUser(id: "${user.id}", repositories: $repositories) {
        id
        repositories {
          id
          refId
        }
      }
    }
  `;
  const data = await graphqlFetch(process.env.GRAPHCOOL_URL, query, {
    repositories,
  });
  // TODO check if errors
  return data.data.updateUser.repositories;
}

async function linkRepositories(user, repositoriesIds) {
  const query = `
    mutation linkRepositories($repositoriesIds: [ID!], $lastGithubSyncAt: DateTime) {
      updateUser(id: "${user.id}", repositoriesIds: $repositoriesIds, lastGithubSyncAt: $lastGithubSyncAt) {
        id
        repositories {
          id
          refId
        }
      }
    }
  `;
  const data = await graphqlFetch(process.env.GRAPHCOOL_URL, query, {
    repositoriesIds,
    lastGithubSyncAt: new Date(),
  });
  // TODO check if errors
  return data.data.updateUser.repositories;
}

module.exports = async function synchronizeUserStars(user) {
  // Fetch user starred repositories
  const githubRepositories = await getAllUserStars(user);
  // Find all repositories already in database
  const repositoriesRefIds = githubRepositories.map(repo => repo.refId);
  let existingRepositories = await getExistingRepositories(repositoriesRefIds);
  // Remove them to insert only new ones
  let mapFunc = repo => repo.refId;
  const existingRepositoriesRefIds = existingRepositories.map(mapFunc);
  const filterFunction = repo => existingRepositoriesRefIds.indexOf(repo.refId) === -1;
  const githubRepositoriesToInsert = githubRepositories.filter(filterFunction);
  // If repositories are not found in db add them
  if (githubRepositoriesToInsert.length > 0) {
    // For new repositories get latest release
    mapFunc = repository => getLatestRelease(repository);
    const promises = githubRepositoriesToInsert.map(mapFunc);
    const data = await Promise.all(promises);
    githubRepositoriesToInsert.forEach((repository, index) => {
      if (data[index]) {
        githubRepositoriesToInsert[index].releases[0] = data[index];
      }
    });
    const insertedRepositories = await addNewRepositories(user, githubRepositoriesToInsert);
    const message = `${user.username} - ${githubRepositoriesToInsert.length} repositories inserted`;
    logger.log('info', message);
    existingRepositories = existingRepositories.concat(insertedRepositories);
  }
  // TODO update db only if stars have changed
  // Link existing and new repositories to the user
  const existingRepositoriesIds = existingRepositories.map(repo => repo.id);
  await linkRepositories(user, existingRepositoriesIds);
  logger.log('info', `${user.username} - ${existingRepositoriesIds.length} repositories linked`);
};
