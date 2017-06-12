import { request } from 'graphql-request';
import * as xml2js from 'xml2js';
import { User, Release } from './types';

export function parseXmlString(data: string): Promise<any> {
  return new Promise((resolve, reject) => {
    xml2js.parseString(data, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

export async function getUser(userId: string, fields: string): Promise<User> {
  const query = `
    query User($userId: ID!) {
      User(id: $userId) {
        ${fields}
      }
    }
  `;
  const data: any = await request(process.env.GRAPHCOOL_URL, query, {
    userId,
  });
  return data.User;
}

export async function getUserReleases(
  userId: string,
  fields: string
): Promise<Release[]> {
  const query = `
    query allReleases($userId: ID!) {
      allReleases(
        orderBy: publishedAt_DESC
        first: 40
        filter: {
          repository: {
            users_some: {
              id: $userId
            }
          }
        }
      ) {
        ${fields}
      }
    }
  `;
  const data: any = await request(process.env.GRAPHCOOL_URL, query, {
    userId,
  });
  return data.allReleases;
}
