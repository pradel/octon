import { request } from 'graphql-request';
import * as logger from 'winston';
import * as Feed from 'feed';
import * as format from 'date-fns/format';
import syncUserRepositories from './github/sync-user-repositories';
import { User } from './types';
import { getUser, getUserReleases } from './utils';

async function apiSyncUserRepositories(req, res): Promise<void> {
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

async function apiRssFeed(req, res): Promise<void> {
  const userId = req.params.userId;
  try {
    const user = await getUser(
      userId,
      `
      id
      username
    `
    );
    if (!user) {
      res.json({ success: false, message: 'User not found' });
      return;
    }
    const releases = await getUserReleases(
      userId,
      `
      id
      tagName
      htmlUrl
      publishedAt
      repository {
        id
        name
        type
        avatar
        htmlUrl
      }
    `
    );
    const feed = new Feed({
      title: 'Octon',
      description: `Latest releases for ${user.username}`,
      image: `${process.env.BASE_URL}/img/logo.png`,
      id: `${process.env.BASE_URL}/users/${user.id}/rss`,
      link: `${process.env.BASE_URL}/users/${user.id}/rss`,
      updated:
        releases.length > 0 ? new Date(releases[0].publishedAt) : new Date(),
    });
    releases.forEach(release => {
      const date = format(release.publishedAt, 'ddd DD MMM - h.mma');
      const releaseLink = `${process.env.BASE_URL}/release/${release.repository
        .type}/${release.repository.name}/${release.tagName}`;
      feed.addItem({
        title: release.repository.name,
        id: releaseLink,
        link: releaseLink,
        description: `Released ${release.tagName} on ${date}`,
        date: new Date(release.publishedAt),
        image: release.repository.avatar,
      });
    });
    res.set('Content-Type', 'text/xml').send(feed.atom1());
  } catch (err) {
    logger.log('error', `users/${userId}/rss`, err);
    res.json({ success: false, message: err.message });
  }
}

export { apiSyncUserRepositories, apiRssFeed };
