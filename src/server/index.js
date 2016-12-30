/* eslint-disable no-console */

import { resolve as pathResolve } from 'path';
import express from 'express';
import appRootDir from 'app-root-dir';
import Raven from 'raven';
import config from '../../config';
import imgsSSR from './middleware/imgsSSR';
import security from './middleware/security';
import clientBundle from './middleware/clientBundle';
import errorHandlers from './middleware/errorHandlers';
import routes from './routes';
import expressMW from './middleware/express';
import { connect } from './db';

if (process.env.NODE_ENV === 'production') {
  Raven.config(`https://${config.ravenKey}:${config.ravenSecret}@sentry.io/121752`).install();
}
// Create our express based server.
const app = express();
app.use(Raven.requestHandler());
// mongo
connect();

app.disable('x-powered-by');
app.set('trust proxy', 'loopback');

expressMW(app);
// Security middlewares.
app.use(...security);

app.use('/api/v1', routes);

// Configure serving of our client bundle.
app.use(config.bundles.client.webPath, clientBundle);

app.use(express.static(pathResolve(appRootDir.get(), './public')));
// The React application middleware.
app.get('*', imgsSSR);

app.use(Raven.errorHandler());
// Error Handler middlewares.
app.use(...errorHandlers);

// Create an http listener for our express app.
const listener = app.listen(config.port, config.host, () =>
  console.log(`Server listening on port ${config.port}`),
);

export default listener;
