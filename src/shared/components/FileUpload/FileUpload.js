import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import RaisedButton from 'material-ui/RaisedButton';
import ActionUpload from 'material-ui/svg-icons/file/cloud-upload';
import styled from 'styled-components';


const styles = {
  button: {
    margin: 12,
  },
  dropZone: {
    display: 'flex',
    width: '100%',
    height: '350px',
    border: '2px dashed #fff',
    color: '#fff',
    justifyContent: 'space-around',
  },
  helpText: {
    alignSelf: 'center',
  },
};

const TextBlock = styled.footer`
  color: #fff;
`;
class FileUpload extends Component {
  constructor(props) {
    super();

    this.state = {
      files: [],
    };

    this.onDrop = this.onDrop.bind(this);
    this.onOpenClick = this.onOpenClick.bind(this);
  }

  onDrop(files) {
    this.setState({
      file: files[0],
    });
    const payload = files[0];
    this.props.handleUpload(payload);
  }
  onOpenClick() {
    this.dropzone.open();
  }

  render() {
    return (
      <div>

        <Dropzone
          className="the-drop"
          ref={ (node) => {
            this.dropzone = node;
          } }
          multiple={ false }
          onDrop={ this.onDrop }
          accept="image/*"
          maxSize={ 5242880 }
          style={ styles.dropZone }
        >
          <div style={ styles.helpText }>
          <p className="drop">Drop an image here or select one from your computer. <br />It will upload right away.</p>
          </div>
        </Dropzone>

        <RaisedButton
          icon={ <ActionUpload /> }
          label="Browse PC"
          onClick={ this.onOpenClick }
          primary
          style={ styles.button }
        />
          </div>
    );
  }
}
export default FileUpload;
