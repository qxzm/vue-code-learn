import Dep from './Dep'
import {arrayMethods} from './array'

// 检测 __proto__ 是否可用
const hasProto = '__proto__' in {}
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

export default class Observer {
    constructor (value) {
        this.value = value

        if (!Array.isArray(value)) {
            this.walk(value)
        } else {
            const augment = hasProto
                ? protoAugment
                : copyAugment

            // value.__proto__ = arrayMethods
            augment(value, arrayMethods, arrayKeys)
        }
    }

    walk (obj) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i], obj[keys[i]])
        }
    }
}

function defineReactive (data, key, val) {
    // 递归子属性
    if (typeof val === 'object') {
        new Observer(val)
    }

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

function protoAugment (target, src, keys) {
    target.__proto__ = src
}

function copyAugment (target, src, keys) {
    for (let i = 0, len = keys.length; i < len; i++) {
        const key = keys[i]
        def(target, key, src[key])
    }
}
