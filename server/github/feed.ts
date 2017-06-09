import * as rp from 'request-promise';
import { Release, Repository } from '../types';
import { parseString } from '../utils';

function formatTag(repository: Repository, tag: any): Release {
  // TODO get refId
  const link = tag.link[0].$.href;
  // Get tagName as last part of the url
  let tagName = link.split('/');
  tagName = decodeURIComponent(tagName[tagName.length - 1]);
  return {
    htmlUrl: `https://github.com${link}`,
    publishedAt: tag.updated[0],
    refId: tagName,
    tagName,
    type: 'tag',
  };
}

async function getTags(repository: Repository): Promise<any> {
  const data: string = await rp(`https://github.com/${repository.name}/tags.atom`);
  const xml = await parseString(data);
  return xml.feed;
}

export default async function getLatestRelease(repository: Repository): Promise<Release | null> {
  let data;
  try {
    data = await getTags(repository);
  } catch (err) {
    // HTTP 451 Unavailable For Legal Reasons https://en.wikipedia.org/wiki/HTTP_451
    if (err.statusCode === 451) {
      return null;
    }
    throw err;
  }
  // If no tags
  if (data.entry && data.entry[0]) {
    const tag = formatTag(repository, data.entry[0]);
    // If no releases return new one
    if (repository.releases.length === 0) {
      return tag;
    }
    // If release don't exist in db
    if (tag.tagName !== repository.releases[0].tagName) {
      return tag;
    }
  }
  return null;
};
