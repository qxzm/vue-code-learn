import {parsePath} from "./util"

export default class Watcher {
    constructor (vm, expOrFn, cb) {
        this.vm = vm

        // 执行getter就可以拿到值
        this.getter = parsePath(expOrFn)
        this.cb = cb
        this.value = this.get()
    }

    get () {
        window.target = this
        let value = this.getter.call(this.vm, this.vm)
        window.target = undefined
        return value
    }

    update () {
        const oldValue = this.value
        this.value = this.get()
        this.cb.call(this.vm, this.value, this.oldValue)
    }
}
