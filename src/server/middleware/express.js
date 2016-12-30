import bodyParser from 'body-parser';
import compression from 'compression';
import busboy from 'connect-busboy';

export default (app) => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, Cache-Control, X-Requested-With, Content-Type, Accept');
    next();
  });
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: true, limit: '6mb' }));
  // parse application/anything+json
  app.use(bodyParser.json({ type: 'application/*+json', limit: '6mb' }));
  // parse application/json
  app.use(bodyParser.json({ type: 'application/json', limit: '6mb' }));
  // parse text/plain
  app.use(bodyParser.text({ type: 'text/plain', limit: '6mb' }));
  // parse anything else
  app.use(bodyParser.raw({ limit: '6mb' }));
  app.use(busboy({
    limits: {
      fileSize: 5242880,
    },
  }));
};
