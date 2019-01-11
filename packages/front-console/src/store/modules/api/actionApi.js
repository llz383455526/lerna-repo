import {get} from '../../api';

/**
 * 返回一个Promise 针对二次接口调用场景
 * @param {*} callback 在action里面直接要执行的异步操作 返回resolve
 */
export function returnPromise(callback) {
    return new Promise((resolve, reject) => {
        try {
            callback(resolve);
        } catch(err) {
            reject(err)
        }
    })
}

export function cacheArray(arr, action, cache = true) {
    console.log(arr)
}

/**
 * 缓存vuex里的字符数据 cache为true的时候默认先拿原始数据
 * @param {*} str 原始state的值
 * @param {*} action 异步ajax所需的参数 url:请求地址 param:请求参数 resPath:后端数据返回的path(key)值
 * @param {*} cache 是否使用本地(vuex.state)的默认值
 */
export function cacheGetString(str, action, cache = true) {
    return new Promise((resolve, reject) => {
        if (str.length === 0) {
            get(action.url, action.param).then(data => {
                if (action.resPath) {
                    resolve(data[action.resPath]);
                } else {
                    resolve(data);
                }
            }).catch((err) => {
                reject(err);
            })
        } else {
            resolve(str);
        }
    })
}

// post

// formdata

export default {
    returnPromise,
    cacheArray,
    cacheGetString
}