import { get, post } from "../store/api"
import { workflow } from "src/api"
import { Loading } from 'element-ui';

function waitByTaskId(taskId) {
    let loading = Loading.service({ fullscreen: true })
    return new Promise((resolve, reject) => {
        wait(() =>{ return get(workflow.taskEndFlag, { taskId }, true) }).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        }).finally(() => {
            loading.close()
        })
    })
}

async function wait(func) {
    let result, result_1 = false

    function catchErr() {
        return new Promise((resolve, reject) => {
            func().then(data => {
                resolve(data || result_1)
            }).catch(err =>{
                resolve('stop')
            })
        })
    }

    setTimeout(() => {
        result_1 = 'stop'
    }, 1000 * 2)

    while (!result) {
        result = await catchErr()
    }

    return Promise.resolve(result)
}

export { waitByTaskId }