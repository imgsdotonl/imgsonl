/* eslint-disable no-unused-vars */
const path = require('path');
const _ = require('lodash');
const appRoot = require('app-root-dir');

const appRootDir = appRoot.get();
const pjson = require('../package.json');
require('dotenv').load({ silent: true });

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    root: appRootDir,
    port: process.env.API_PORT || 2121,
    host: process.env.API_HOST || 'localhost',
    ip: process.env.IP || '0.0.0.0',
    app: pjson.name,
    version: pjson.version,
    prefix: '/api/v1',
    dateFormat: 'yyyy-MM-dd',
    timeZone: '-07:00',
    logger: {
      console: true,
      file: false,
    },
    body: {
      limit: '6mb',
    },
  },
};

module.exports = _.merge(config.all, config[config.all.env]);
// export default module.exports;
