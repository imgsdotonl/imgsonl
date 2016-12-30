import React from 'react';
import { Field, reduxForm } from 'redux-form';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { TextField } from 'redux-form-material-ui';

import Loader from '../Loader';

const UrlForm = (props) => {
  const { handleSubmit } = props;
  return (
    <Paper zDepth={ 1 } style={ { marginTop: '50px', padding: '1em' } }>
    <p>Insert the URL of an image to host from imgs.onl</p>

    <form onSubmit={ handleSubmit }>
      <Field name="url" component={ TextField } type="text" floatingLabelText="Image Url" />
      <div>
      <RaisedButton type="submit" label="Upload" primary />
      </div>
    </form>
    </Paper>
  );
};

export default reduxForm({
  form: 'url',
})(UrlForm);
