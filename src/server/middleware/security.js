/* @flow */

import uuid from 'uuid';
import hpp from 'hpp';
import helmet from 'helmet';
import type { Middleware, $Request, $Response, NextFunction } from 'express';
import config from '../../../config';

const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      'fonts.googleapis.com',
      'https://www.google-analytics.com/analytics.js',
      'data:',
      'cdn.polyfill.io',
      "'unsafe-eval'",
      // $FlowFixMe
      (req, res) => `'nonce-${res.locals.nonce}'`,
    ],
    styleSrc: [
      "'self'",
      // Webpack generates JS that loads our CSS, so this is needed:
      "'unsafe-inline'",
      'blob:',
      'fonts.googleapis.com',
    ],
    imgSrc: [
      "'self'",
      'https://www.google-analytics.com',
      'data:',
    ],
    // Note: Setting this to stricter than * breaks the service worker. :(
    // I can't figure out how to get around this, so if you know of a safer
    // implementation that is kinder to service workers please let me know.
    connectSrc: ['*'], // ["'self'", 'ws:'],
    fontSrc: ["'self'", 'data:', 'fonts.gstatic.com'],
    objectSrc: ["'self'"],
    mediaSrc: ["'self'"],
    childSrc: ["'self'"],
  },
};


// Add any additional CSP from the static config.
Object.keys(config.cspExtensions).forEach((key) => {
  if (cspConfig.directives[key]) {
    cspConfig.directives[key] = cspConfig.directives[key]
      .concat(config.cspExtensions[key]);
  } else {
    cspConfig.directives[key] = config.cspExtensions[key];
  }
});

if (process.env.NODE_ENV === 'development') {
  // When in development mode we need to add our secondary express server that
  // is used to host our client bundle to our csp config.
  Object.keys(cspConfig.directives).forEach((directive) => {
    cspConfig.directives[directive].push(
      `${config.host}:${config.clientDevServerPort}`,
    );
  });
}

// Attach a unique "nonce" to every response.  This allows use to declare
// inline scripts as being safe for execution against our content security policy.
// @see https://helmetjs.github.io/docs/csp/
function nonceMiddleware(req: $Request, res: $Response, next: NextFunction) {
  res.locals.nonce = uuid(); // eslint-disable-line no-param-reassign
  next();
}

const securityMiddleware = [
  nonceMiddleware,

  // Prevent HTTP Parameter pollution.
  // @see http://bit.ly/2f8q7Td
  hpp(),
  helmet.xssFilter(),
  helmet.frameguard('deny'),
  helmet.ieNoOpen(),
  helmet.noSniff(),

  helmet.contentSecurityPolicy(cspConfig),
];

export default (securityMiddleware: Array<Middleware>);
