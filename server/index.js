const dotenv = require('dotenv');
require('isomorphic-fetch');
const logger = require('winston');
const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');
const { resolve } = require('path');
const { apiSyncUserRepositories } = require('./api');
const cron = require('./cron');

dotenv.config();
const dev = process.env.NODE_ENV !== 'production';
const dir = resolve(__dirname, '..', 'client');
const app = next({ dev, dir });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
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
