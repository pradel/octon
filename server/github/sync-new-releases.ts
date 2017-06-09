import { request } from 'graphql-request';
import * as logger from 'winston';
import { Release, Repository } from '../types';
import getLatestRelease from './feed';

export default async function synchronizeNewReleases(): Promise<void> {
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
  const data: any = await request(process.env.GRAPHCOOL_URL, query);
  const repositories: Repository[] = data.allRepositories;
  // TODO make groups of 500 requests max
  let promises = repositories.map((repository) => getLatestRelease(repository));
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
  releases.forEach((release: Release, index: number) => {
    if (release) {
      // Make a mutation for each new release
      const mutation: Promise<Release> = request(process.env.GRAPHCOOL_URL, query, {
        htmlUrl: release.htmlUrl,
        publishedAt: release.publishedAt,
        refId: release.refId,
        repositoryId: repositories[index].id,
        tagName: release.tagName,
        type: release.type,
      });
      promises.push(mutation);
    }
  });
  if (promises.length > 0) {
    const insertedReleases = await Promise.all(promises);
    logger.log('info', `${insertedReleases.length} releases inserted`);
  }
};
