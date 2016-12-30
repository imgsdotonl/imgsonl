
export const PROGRESS_UPLOAD = 'PROGRESS_UPLOAD';
export const PROGRESS_PROCESS = 'PROGRESS_PROCESS';
export const PROGRESS_STOPPED = 'PROGRESS_STOPPED';

export const UPDATE_FILES = 'UPDATE_FILES';

export const progressUpload = () => ({ type: PROGRESS_UPLOAD });
export const progressProcess = () => ({ type: PROGRESS_PROCESS });
export const progressStopped = () => ({ type: PROGRESS_STOPPED });

const progressReducer = (state = { active: false, message: '' }, action) => {
    switch (action.type) {
        case PROGRESS_UPLOAD: {
            return Object.assign(
                {},
                state,
                { active: true, message: 'Uploading Files' }
            );
        }
        case PROGRESS_PROCESS: {
            return Object.assign(
                {},
                state,
                { active: true, message: 'Processing …' }
            );
        }
        case PROGRESS_STOPPED: {
            return Object.assign(
                {},
                state,
                { active: false, message: '' }
            );
        }
        default: {
            return state;
        }
    }
};

export default progressReducer;
