const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const filePath = path.resolve(__dirname, 'build/github-authentication.js');

let file = fs.readFileSync(filePath, 'utf8');

file = file.replace('__GRAPHCOOL_PROJECT_ID__', process.env.GRAPHCOOL_PROJECT_ID);
file = file.replace('__GITHUB_CLIENT_ID__', process.env.GITHUB_CLIENT_ID);
file = file.replace('__GITHUB_CLIENT_SECRET__', process.env.GITHUB_CLIENT_SECRET);

fs.writeFileSync(filePath, file);
