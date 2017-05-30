const logger = require('winston');
const { graphqlFetch } = require('../utils');
const getLatestRelease = require('./feed');

module.exports = async function synchronizeNewReleases() {
  // Get all repositories in db
  // TODO sort by name
  let query = `
    query allRepositories {
      allRepositories {
        id
        name
        releases(orderBy: publishedAt_DESC, first: 1) {
          tagName
        }
      }
    }
  `;
  const data = await graphqlFetch(process.env.GRAPHCOOL_URL, query);
  // TODO check if error
  const repositories = data.data.allRepositories;
  // TODO make groups of 500 requests max
  let promises = repositories.map(repository => getLatestRelease(repository));
  const releases = await Promise.all(promises);
  // Prepare createRelease mutation
  query = `
    mutation createRelease(
      $htmlUrl: String!
      $publishedAt: DateTime!
      $refId: String!
      $tagName: String!
      $type: String!
      $repositoryId: ID
    ) {
      createRelease(
        htmlUrl: $htmlUrl
        publishedAt: $publishedAt
        refId: $refId
        tagName: $tagName
        type: $type
        repositoryId: $repositoryId
      ) {
        id
      }
    }
  `;
  promises = [];
  releases.forEach((release, index) => {
    if (release) {
      // Make a mutation for each new release
      const mutation = graphqlFetch(process.env.GRAPHCOOL_URL, query, {
        htmlUrl: release.htmlUrl,
        publishedAt: release.publishedAt,
        refId: release.refId,
        tagName: release.tagName,
        type: release.type,
        repositoryId: repositories[index].id,
      });
      promises.push(mutation);
    }
  });
  if (promises.length > 0) {
    const insertedReleases = await Promise.all(promises);
    // TODO check errors
    logger.log('info', `${insertedReleases.length} releases inserted`);
  }
};
