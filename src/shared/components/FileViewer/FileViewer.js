import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardMedia } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import ForumIcon from 'material-ui/svg-icons/editor/insert-comment';
import LinkIcon from 'material-ui/svg-icons/content/link';
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import CopyIcon from 'material-ui/svg-icons/content/content-copy';
import ImageIcon from 'material-ui/svg-icons/image/photo';
import CopyToClipboard from 'react-copy-to-clipboard';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';

import { uploadFile, uploadUrl } from '../../state/modules/file';
import FileUpload from '../FileUpload';
import UrlForm from '../UrlForm';
import { Grid, Col, Row } from '../Layout';

const style = {
  marginTop: 250,
  marginRight: 20,
  float: 'right',
};
class FileViewer extends Component {
  constructor(props) {
    super();
    this.state = { value: '', copied: false, open: false };
    (this: any).handleSubmit = this.handleSubmit.bind(this);
    (this: any).handleUpload = this.handleUpload.bind(this);
  }
  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  handleUpload(payload) {
    this.props.uploadFile(payload);
  }
  handleSubmit(values) {
    this.props.uploadUrl(values);
  }
  render() {
    const actions = [
      <FlatButton
        key="1"
        label="Cancel"
        primary
        onTouchTap={ this.handleClose }
      />,
      <FlatButton
        key="2"
        label="Submit"
        primary
        keyboardFocused
        onTouchTap={ this.handleClose }
      />,
    ];
    return (
    <Grid>
      <Row>
        <Col xs={ 12 } md={ 7 }>
          <Card>
            <CardMedia style={ { padding: '1em' } }>
              <img src={ this.props.path } style={ { width: '100%' } } />
            </CardMedia>
          </Card>
        </Col>
        <Col xs={ 12 } md={ 5 }>
         <Paper zDepth={ 2 }>
            <List>
             <ListItem
               disabled
               leftIcon={ <LinkIcon /> }
               secondaryText={ `https://imgs.onl/${this.props.imageId}` }
               primaryText="Share"
               secondaryTextLines={ 2 }
               rightIconButton={
                 <CopyToClipboard text={ `https://imgs.onl/${this.props.imageId}` }
                   onCopy={ () => this.setState({ copied: true }) }
                 ><IconButton><CopyIcon /></IconButton>
                </CopyToClipboard>
              }
             />
            <Divider inset />
            <ListItem
              disabled
              leftIcon={ <ImageIcon /> }
              secondaryText={ `https://imgs.onl/files/${this.props.filename}` }
              primaryText="Direct"
              secondaryTextLines={ 2 }
              rightIconButton={
                <CopyToClipboard text={ `https://imgs.onl/files/${this.props.filename}` }
                  onCopy={ () => this.setState({ copied: true }) }
                ><IconButton><CopyIcon /></IconButton>
               </CopyToClipboard>
             }
            />
            <Divider inset />
            <ListItem
              disabled
              leftIcon={ <ForumIcon /> }
              primaryText="Forum"
              secondaryText={ `[img]https://imgs.onl/files/${this.props.filename}[/img]` }
              secondaryTextLines={ 2 }
              rightIconButton={
                <CopyToClipboard text={ `[img]https://imgs.onl/files/${this.props.filename}[/img]` }
                  onCopy={ () => this.setState({ copied: true }) }
                ><IconButton><CopyIcon /></IconButton>
               </CopyToClipboard>
             }
            />
            </List>
          </Paper>
          <FloatingActionButton style={ style } onTouchTap={ this.handleOpen }>
          <ContentAdd />
        </FloatingActionButton>
        <Dialog
          title="Upload another file"
          actions={ actions }
          modal={ false }
          open={ this.state.open }
          onRequestClose={ this.handleClose }
        >
          <FileUpload handleUpload={ this.handleUpload } style={ { color: '#222' } } />
          <UrlForm style={ { color: '#222' } } onSubmit={ this.handleSubmit } />
        </Dialog>
        </Col>
      </Row>
    </Grid>
    );
  }
}
FileViewer.propTypes = {
  path: PropTypes.string,
  imageId: PropTypes.string,
  uploadFile: PropTypes.func,
  uploadUrl: PropTypes.func,
};
const mapStateToProps = (state) => {
  return {
    ui: state.ui,
    files: state.files,
  };
};

export default connect(mapStateToProps, { uploadFile, uploadUrl })(FileViewer);
