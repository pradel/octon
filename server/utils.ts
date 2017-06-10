import * as xml2js from 'xml2js';

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
