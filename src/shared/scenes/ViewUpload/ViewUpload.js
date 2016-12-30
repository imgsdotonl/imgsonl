/* @flow */

import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import { Footer, FileUpload, UrlForm, FileViewer } from '../../components/index';
import PageTemplate from '../../theme/Imgsonl';
import { goHome } from '../../state/modules/ui';
import { getImage } from '../../state/modules/file';

type Props = {
  params: Object,
  goHome: Function,
  getImage: Function,
  files: Object
};

@provideHooks({
  fetch: ({ dispatch, params: { imageId } }) => dispatch(getImage(imageId)),
})
class ViewUpload extends Component {
  constructor(props) {
    super();
    (this: any).navigateHome = this.navigateHome.bind(this);
  }
  componentDidMount() {
    const imageId = this.props.params.imageId;
    this.props.getImage(imageId);
  }
  navigateHome() {
    this.props.goHome();
  }
  props: Props;
  render() {
    const { file } = this.props.files;
    return (
      <PageTemplate
        helmetMeta={ <Helmet title="Your image" /> }
        header={
          <AppBar
            title="imgs.onl"
            onTitleTouchTap={ this.navigateHome }
            titleStyle={ { cursor: 'pointer' } }
            showMenuIconButton={ false }
          />
        }
        footer={ <Footer /> }
      >
      <FileViewer { ...file } />
      </PageTemplate>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    files: state.files,
  };
};

export default connect(mapStateToProps, { getImage, goHome })(ViewUpload);
