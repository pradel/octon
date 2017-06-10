import * as rp from 'request-promise';
import { Release, Repository } from '../types';
import { parseXmlString } from '../utils';

function formatTag(tag: any): Release {
  // TODO get real refId
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

async function getAtomTags(repository: Repository): Promise<any> {
  const data: string = await rp(
    `https://github.com/${repository.name}/tags.atom`
  );
  const xml = await parseXmlString(data);
  return xml.feed;
}

export default async function getLatestRelease(
  repository: Repository
): Promise<Release | null> {
  let data;
  try {
    data = await getAtomTags(repository);
  } catch (err) {
    // HTTP 451 Unavailable For Legal Reasons https://en.wikipedia.org/wiki/HTTP_451
    if (err.statusCode === 451) {
      return null;
    }
    throw err;
  }
  // If no tags
  if (data.entry && data.entry[0]) {
    const tag = formatTag(data.entry[0]);
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
}
