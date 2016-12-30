/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Helmet from 'react-helmet';

import PageTemplate from '../../theme/Imgsonl';
import { Grid, Row, Col, Footer, FileUpload, UrlForm, FileViewer } from '../../components/index';
import { uploadFile, uploadUrl } from '../../state/modules/file';
import { goHome } from '../../state/modules/ui';
import Progress from '../../components/Progress';

type Props = {
  loaded: Boolean,
  handleUpload: Function,
  uploadFile: Function,
  uploadUrl: Function,
  goHome: Function,
  files: Object,
  dispatch: Function
};

class Home extends Component {
  constructor(props) {
    super();
    (this: any).handleSubmit = this.handleSubmit.bind(this);
    (this: any).handleUpload = this.handleUpload.bind(this);
    (this: any).navigateHome = this.navigateHome.bind(this);
  }

  props: Props;

  handleUpload(payload) {
    this.props.uploadFile(payload);
  }
  handleSubmit(values) {
    this.props.uploadUrl(values);
  }
  navigateHome() {
    this.props.goHome();
  }
  render() {
    return (
      <PageTemplate
        header={ <AppBar title="imgs.onl" titleStyle={ { cursor: 'pointer' } } showMenuIconButton={ false } /> }
        helmetMeta={ <Helmet title="Home" /> }
        footer={ <Footer /> }
      >
      <Grid>
        <Row>
            <Col xs={ 12 }>
              <Row xsCenter>
                <Col xs={ 6 }>
                  <FileUpload handleUpload={ this.handleUpload } />
                  <UrlForm onSubmit={ this.handleSubmit } />
                </Col>
              </Row>
            </Col>
        <Col sm={ 12 } md={ 6 }>
          {
            !this.props.files.file.filepath
            ? null
            : <FileViewer filepath={ this.props.files.file.filepath } />
          }
        </Col>
        </Row>
      </Grid>
      { this.props.progress.active ? <Progress message={ this.props.progress.message } /> : null }
      </PageTemplate>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ui: state.ui,
    files: state.files,
    progress: state.progress,
  };
};

export default connect(mapStateToProps, { uploadFile, uploadUrl, goHome })(Home);
