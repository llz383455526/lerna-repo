import {ajax} from '../service'
import {baseUrl} from '../config/address'
import {showNotify} from '../plugin/utils-notify'
import {showLoading, hideLoading} from '../plugin/utils-loading'

function requestBefore(param = {}, withLoading = false) {
    if (param.noLoading) {
        delete param.noLoading;
    } else {
        if(!withLoading) {
            showLoading(param.loadingText);
        }
        delete param.loadingText;
    }
    return param;
}

function showErrorToast(show, res, errorCallback, reject) {
    hideLoading();
    if (show) {
        let msg = res.message || res.msg;
        if (res.code === undefined) {
            let obj = res.response || res.responseText;
            if (obj) {
                try {
                    msg = JSON.parse(obj).message || JSON.parse(obj).msg;
                } catch (error) {
                    console.log(error);
                }
            }
        }
        if (msg) {
            if(res.message != "无效的授权码！"){
                showNotify('error', msg);
            }
        } else {
            showNotify('error', '服务器打盹了哦，请稍后再试~');
        }
    }
    if (errorCallback) {
        reject(res);
    }
}

function post(url, param, withLoading = false) {
    return new Promise((resolve, reject) => {
        param = requestBefore(param, withLoading);
        ajaxAction('post', url, param, resolve, reject, true, false, withLoading);
    });
}

//post请求，当http状态不等于200或者code不等于200时候， 请对reject进行捕获, 如果想不弹出错误Toast，请在参数传递 hideErrorToast:true
function postWithErrorCallback(url, param) {
    return new Promise((resolve, reject) => {
        param = requestBefore(param);
        let hideErrorToast = param.hideErrorToast;
        delete param.hideErrorToast;
        ajaxAction('post', url, param, resolve, reject, !hideErrorToast, true);
    });
}

//post请求，当http状态不等于200或者code不等于200时候， 不进行错误提示， 这情况用于定制错误状态情况，请对reject进行捕获
function postButNoErrorToast(url, param) {
    return new Promise((resolve, reject) => {
        param = requestBefore(param);
        ajaxAction('post', url, param, resolve, reject, false, true);
    });
}

function get(url, param, withLoading = false) {
    return new Promise((resolve, reject) => {
        param = requestBefore(param, withLoading);
        ajaxAction('get', url, param, resolve, reject, true, false, withLoading);
    })
}

//get请求，当http状态不等于200或者code不等于200时候， 请对reject进行捕获, 如果想不弹出错误Toast，请在参数传递 hideErrorToast:true
function getWithErrorCallback(url, param) {
    return new Promise((resolve, reject) => {
        param = requestBefore(param);
        let hideErrorToast = param.hideErrorToast;
        delete param.hideErrorToast;
        ajaxAction('get', url, param, resolve, reject, !hideErrorToast, true);
    });
}

//get请求，当http状态不等于200或者code不等于200时候， 不进行错误提示， 这情况用于定制错误状态情况，请对reject进行捕获
function getButNoErrorToast(url, param) {
    return new Promise((resolve, reject) => {
        param = requestBefore(param);
        ajaxAction('get', url, param, resolve, reject, false, true);
    });
}

function ajaxAction(requestType, url, param, resolve, reject, showToast, needCallback, withLoading) {
    ajax(requestType, url, param, res => {
        if(!withLoading) hideLoading()
        if (res.code === 200) {
            resolve(res.data);
        } else {
            if (res.status === 0) {
                res.message = '提交失败，请重新提交'
                showErrorToast(showToast, res, needCallback, reject);
                return false
            }
            if (res.status === 401) {
                showLoading({
                    text: '页面正在跳转'
                });
                setTimeout(() => {
                    /*showAlert({
                     msg:'登录超时，请重新登陆！',
                     confirmButtonText:'确定',
                     confirmCallback:() => {
                     window.location.href = '/login'
                     }
                     });*/
                    hideLoading();
                    window.location.href = '/login'
                }, 1000)
            } else if (res.status === 429) {
                res.message = '请求太频繁了,休息一下吧！'
                showErrorToast(showToast, res, needCallback, reject);
            } else if (res.status === 403) {
                res.message = '没有权限！'
                showErrorToast(showToast, res, needCallback, reject);
            } else {
                showErrorToast(showToast, res, needCallback, reject);
            }
        }
    })
}

function formPost(url, param) {
    return new Promise((resolve, reject) => {
        //param = requestBefore(param);
        showLoading('上传中')
        ajaxAction('form', url, param, resolve, reject, true, false);
    });
}

function importPost(url, param, withLoading = false) {
    return new Promise((resolve, reject) => {
        //param = requestBefore(param);
        if(!withLoading) {
            showLoading('上传中')
        }
        ajaxAction('import', url, param, resolve, reject, true, false, withLoading);
    });
}

export {
    post,
    get,
    postWithErrorCallback,
    postButNoErrorToast,
    getWithErrorCallback,
    getButNoErrorToast,
    formPost,
    importPost
}


















