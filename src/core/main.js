import Dep from './Dep'

function defineReactive (data, key, val) {
    let dep = new Dep()

    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            // 保存依赖
            dep.depend()
            return val
        },
        set: function (newVal) {
            if (val === newVal) return
            val = newVal

            // 通知更新
            dep.notify()
        }
    })
}
