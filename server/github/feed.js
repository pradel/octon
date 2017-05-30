const rp = require('request-promise');
const parseString = require('xml2js').parseString;

const parseStringP = data =>
  new Promise((resolve, reject) => {
    parseString(data, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });

function formatTag(repository, tag) {
  // TODO get refId
  const link = tag.link[0].$.href;
  // Get tagName as last part of the url
  let tagName = link.split('/');
  tagName = decodeURIComponent(tagName[tagName.length - 1]);
  return {
    refId: tagName,
    tagName,
    htmlUrl: `https://github.com${link}`,
    type: 'tag',
    publishedAt: tag.updated[0],
  };
}

async function getTags(repository) {
  const data = await rp(`https://github.com/${repository.name}/tags.atom`);
  const xml = await parseStringP(data);
  return xml.feed;
}

module.exports = async function getLatestRelease(repository) {
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
