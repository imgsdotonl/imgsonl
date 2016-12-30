/* @flow */

import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';

import type { ReactChildren } from '../../types/react';
import { safeConfigGet } from '../../core/utils/config';
import Notifications from '../Notification';

import '../../theme/styles/main.scss';

type Props = {
  children: ReactChildren,
  dispatch: Function,
  location: Object,
};

// @provideHooks({
//   fetch: ({ dispatch }) => {
//     return Promise.all([
//       dispatch(fetchSettingsIfNeeded()),
//       dispatch(fetchMenusIfNeeded()),
//       dispatch(fetchPagesIfNeeded()),
//     ]);
//   },
// })
class App extends Component {
  props: Props;
  render() {
    return (
    <div>
      <Helmet
        htmlAttributes={ safeConfigGet(['htmlPage', 'htmlAttributes']) }
        titleTemplate={ safeConfigGet(['htmlPage', 'titleTemplate']) }
        defaultTitle={ safeConfigGet(['htmlPage', 'defaultTitle']) }
        meta={ safeConfigGet(['htmlPage', 'meta']) }
        link={ safeConfigGet(['htmlPage', 'links']) }
        script={ safeConfigGet(['htmlPage', 'scripts']) }
      />
      { React.Children.toArray(this.props.children) }
      <Notifications />
    </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    notifications: state.notifications,
  };
}

export default connect(mapStateToProps)(App);
