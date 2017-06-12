import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import 'isomorphic-fetch';
import * as next from 'next';
import { resolve } from 'path';
import * as logger from 'winston';
import { apiSyncUserRepositories, apiRssFeed } from './api';
import cron from './cron';

// TODO add sentry to catch errors (client + server)

const dev = process.env.NODE_ENV !== 'production';
const dir = resolve(__dirname, '..', 'client');
const app = next({ dev, dir });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(cookieParser());
  server.use(bodyParser.json());

  server.post('/api/sync-stars', apiSyncUserRepositories);

  server.get('/users/:userId/rss', apiRssFeed);

  server.get(
    '/release/:repositoryType/:repositoryName1/:repositoryName2/:releaseTagName',
    (req, res) => {
      const actualPage = '/release';
      const queryParams = {
        repositoryType: req.params.repositoryType,
        repositoryName: `${req.params.repositoryName1}/${req.params
          .repositoryName2}`,
        releaseTagName: req.params.releaseTagName,
      };
      app.render(req, res, actualPage, queryParams);
    }
  );

  server.get('*', (req, res) => {
    handle(req, res);
  });

  server.listen(3000, () => {
    logger.log('info', 'App listening on port 3000!');

    // Start cron tasks
    cron();
  });
});
