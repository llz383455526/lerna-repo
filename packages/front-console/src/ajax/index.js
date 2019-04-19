import { post, get, importPost, getButNoErrorToast, postWithErrorCallback } from "../store/api"

class Ajax {
	static get (url, param = {}, loading = false) {
		return new Promise((resolve, reject) => {
			get(url, param, loading).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	}

	static post (url, param = {}, loading = false) {
		return new Promise((resolve, reject) => {
			post(url, param, loading).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	}

	static importPost (url, param = {}, loading = false) {
		return new Promise((resolve, reject) => {
			importPost(url, param, loading).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	}

	static getButNoErrorToast (url, param = {}, loading = false) {
		return new Promise((resolve, reject) => {
			getButNoErrorToast(url, param, loading).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	}

	static postWithErrorCallback (url, param = {}, loading = false) {
		return new Promise((resolve, reject) => {
			postWithErrorCallback(url, param, loading).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
    }
}

export default Ajax
