import Dep from './Dep'
import {arrayMethods} from './array'

// 检测 __proto__ 是否可用
const hasProto = '__proto__' in {}
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

export default class Observer {
    constructor (value) {
        this.value = value
        this.dep = new Dep() // array 新增
        def(value, '__ob__', this)

        if (!Array.isArray(value)) {
            this.walk(value)
        } else {
            const augment = hasProto
                ? protoAugment
                : copyAugment

            // value.__proto__ = arrayMethods
            augment(value, arrayMethods, arrayKeys)
            this.observeArray(value)
        }
    }

    walk (obj) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i], obj[keys[i]])
        }
    }

    observeArray (items) {
        for (let i = 0, l = items.length; i < l; i++) {
            observe(items[i])
        }
    }
}

function defineReactive (data, key, val) {
    // 递归子属性
    // fn observe代替
    // if (typeof val === 'object') {
    //     new Observer(val)
    // }

    let childOb = observe(val)
    let dep = new Dep()
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            // 保存依赖
            dep.depend()

            // 对子元素是obj的递归
            if (childOb) {
                childOb.dep.depend()
            }
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

// 尝试为value创建一个Observer的实例，如果创建成功则返回实例，如果存在实例则直接返回实例
function observe (value, asRootData) {
    if (!isObject(value)) return

    let ob
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__
    } else {
        ob = new Observer(value)
    }

    return ob
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

function def (obj, key, value, enumerable) {
    Object.defineProperty(data, key, {
        enumerable: !!enumerable,
        configurable: true,
        writable: true,
        value: value
    })
}
