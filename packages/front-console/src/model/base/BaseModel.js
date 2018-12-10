
// 必须继承才能使用
class BaseModel {
    // 设置数据
    setDataWithJson (json) {
        return Object.assign(this, json)
    }
    // 根据数据设置对象并获取
    static creatModelWithJson (json) {
        const model = new this()
        model.setDataWithJson(json)
        return model
    }
    // 根据json数组获取数组对象
    static getModelsWithArr (dataArr) {
        if (!Array.isArray(dataArr)) {
            return []
        }
        return dataArr.map((item) => {
            return this.creatModelWithJson(item)
        })
    }

    // 根据传入的数组获取模型
    getJson (keys, json = {}) {
        if (keys instanceof Array) {
            keys.forEach((key) => {
                if (typeof key === 'string') {
                    json[key] = this[key]
                }
            })
        }
        return json
    }
}

export default BaseModel
