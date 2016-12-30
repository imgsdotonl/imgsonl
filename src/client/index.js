/* @flow */
/* eslint-disable global-require */

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Router from 'react-router/lib/Router';
import match from 'react-router/lib/match';
import browserHistory from 'react-router/lib/browserHistory';
import applyRouterMiddleware from 'react-router/lib/applyRouterMiddleware';
import { compose } from 'ramda';
import after from 'lodash/after';
import { syncHistoryWithStore } from 'react-router-redux';
import useScroll from 'react-router-scroll/lib/useScroll';
import WebFontLoader from 'webfontloader';
import { trigger } from 'redial';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ReactGA from 'react-ga';

import AppRoot from '../shared/components/AppRoot';
import App from '../shared/components/App';
import configureStore from '../shared/state/store';
import ApiClient from '../shared/core/api/apiClient';
import createRoutes from '../shared/scenes';
import ReactHotLoader from './components/ReactHotLoader';

// Required for Material-UI
injectTapEventPlugin();
// Load fonts
WebFontLoader.load({
  google: { families: ['Roboto Slab:100,400,700', 'Roboto:300,400,700'] },
});

// Get the DOM Element that will host our React application.
const container = document.querySelector('#app');
// Superagent helper
const apiClient = new ApiClient();

const preloadedState = window.PRELOADED_STATE;
const store = configureStore(preloadedState, browserHistory, apiClient);
const history = syncHistoryWithStore(browserHistory, store);
const routes = createRoutes(store, history);
const { dispatch } = store;

function triggerLocals(event) {
  return function() {
    const { components, location, params } = this.state;
    trigger(event, components, { dispatch, location, params });
  };
}

const onRouteUpdate = compose(
  after(2, triggerLocals('defer')),
  after(3, triggerLocals('fetch')),
);
function renderApp(TheApp) {
  render(
      <ReactHotLoader>
        <AppRoot store={ store }>
            <Router
              history={ history }
              routes={ routes }
              helpers={ apiClient }
              onUpdate={ onRouteUpdate }
              render={ applyRouterMiddleware(useScroll()) }
            />
        </AppRoot>
      </ReactHotLoader>,
      container,
    );
}

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./index.js');
  module.hot.accept(
    '../shared/scenes',
    () => renderApp(require('../shared/scenes').default),
  );
}

// Execute the first render of our app.
renderApp(App);
ReactGA.initialize('UA-28905817-9');
ReactGA.pageview(window.location.pathname);
