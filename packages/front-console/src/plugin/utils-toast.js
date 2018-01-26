import {Message} from 'element-ui';

function showTopToast(type = 'error', msg, duration=3000) {
    let options = {
        message: msg,
        type: type,
        duration: duration,
    }
    Message(options);
}

function showTopErrorToast(msg) {
    let options = {
        message: msg,
        type: 'error'
    }
    Message(options);
}

export {
    showTopToast,
    showTopErrorToast
}
















