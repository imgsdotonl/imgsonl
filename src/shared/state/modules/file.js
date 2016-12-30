import request from 'superagent';
import fetch from 'isomorphic-fetch';
import ReactGA from 'react-ga';
import { push } from 'react-router-redux';
import { progressUpload, progressProcess, progressStopped } from './progress';

export const UPLOAD_FILE_REQUEST = 'UPLOAD_FILE_REQUEST';
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS';
export const UPLOAD_FILE_FAILURE = 'UPLOAD_FILE_FAILURE';
export const UPLOAD_URL_REQUEST = 'UPLOAD_URL_REQUEST';
export const UPLOAD_URL_SUCCESS = 'UPLOAD_URL_SUCCESS';
export const UPLOAD_URL_FAILURE = 'UPLOAD_URL_FAILURE';
export const LOAD_IMAGE_REQUEST = 'LOAD_IMAGE_REQUEST';
export const LOAD_IMAGE_SUCCESS = 'LOAD_IMAGE_SUCCESS';
export const LOAD_IMAGE_FAILURE = 'LOAD_IMAGE_FAILURE';

const beginUploadFile = () => {
  return { type: UPLOAD_FILE_REQUEST };
};

const uploadFileSuccess = (response: Object) => {
  return {
    type: UPLOAD_FILE_SUCCESS,
    payload: response.body,
  };
};

const uploadFileError = (err) => {
  return {
    type: UPLOAD_FILE_FAILURE,
    error: err,
  };
};

export function uploadFile(payload) {
  return (dispatch) => {
    ReactGA.event({category: 'User', action: 'Upload files' });
    dispatch(progressUpload());
    dispatch(beginUploadFile());
    return request.post('/api/v1/uploads').attach(payload.name, payload)
      .then(response => {
        if (response.status !== 201) {
          dispatch(uploadFileError(response));
        }
        dispatch(progressStopped());
        ReactGA.event({category: 'User', action: 'Files uploaded' });
        dispatch(uploadFileSuccess(response));
        dispatch(push(`/${response.body.imageId}`));
      })
      .catch(err => {
        dispatch(uploadFileError(err));
      });
  };
}
const beginUploadUrl = () => {
  return { type: UPLOAD_URL_REQUEST };
};

const uploadUrlSuccess = (response: Object) => {
  return {
    type: UPLOAD_URL_SUCCESS,
    payload: response.body,
  };
};

const uploadUrlError = (err) => {
  return {
    type: UPLOAD_URL_FAILURE,
    error: err,
  };
};

export function uploadUrl(values) {
  return (dispatch) => {
    dispatch(beginUploadUrl());
    return request.post('/api/v1/uploads/url').send(values)
      .then(response => {
        if (response.status !== 201) {
          dispatch(uploadUrlError(response));
        }
        dispatch(uploadUrlSuccess(response));
        dispatch(push(`/${response.body.imageId}`));
      })
      .catch(err => {
        dispatch(uploadUrlError(err));
      });
  };
}


const requestImage = () => {
  return {
    type: LOAD_IMAGE_REQUEST,
  };
};

const receiveImage = (response) => ({
  type: LOAD_IMAGE_SUCCESS,
  payload: response.body,
});

const failedToReceiveImage = (err) => ({
  type: LOAD_IMAGE_FAILURE,
  error: err,
});

export function getImage(imageId) {
  return dispatch => {
    dispatch(requestImage());
    return request.get(`/api/v1/uploads/${imageId}`)
      .then(response => dispatch(receiveImage(response)))
      .catch(err => {
        dispatch(failedToReceiveImage(err));
      });
  };
}


const initialState = {
  loading: false,
  error: false,
  file: {},
  list: [],
};
function fileReducer(state = initialState, action) {
  switch (action.type) {
    case UPLOAD_FILE_REQUEST:
    case UPLOAD_URL_REQUEST:
    case LOAD_IMAGE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPLOAD_FILE_SUCCESS:
    case UPLOAD_URL_SUCCESS:
    case LOAD_IMAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        file: action.payload,
        ...state.list.push(action.payload),
      };
    case UPLOAD_FILE_FAILURE:
    case UPLOAD_URL_FAILURE:
    case LOAD_IMAGE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    default:
      return state;
  }
}
export default fileReducer;
