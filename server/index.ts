import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import 'isomorphic-fetch';
import * as next from 'next';
import { resolve } from 'path';
import * as logger from 'winston';
import { apiSyncUserRepositories } from './api';
import cron from './cron';

dotenv.config();
const dev = process.env.NODE_ENV !== 'production';
const dir = resolve(__dirname, '..', 'client');
const app = next({ dev, dir });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(cookieParser());
  server.use(bodyParser.json());

  server.post('/api/sync-stars', apiSyncUserRepositories);

  server.get('*', (req, res) => {
    handle(req, res);
  });

  server.listen(3000, () => {
    logger.log('info', 'App listening on port 3000!');

    // Start cron tasks
    cron();
  });
});
