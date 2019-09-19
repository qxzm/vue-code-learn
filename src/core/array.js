const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const arrayMethodForObserve = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']
arrayMethodForObserve.forEach(function (method) {
    const original = arrayProto[method]
    Object.defineProperty(arrayMethods, method, {
        enumerable: false,
        writable: true,
        configurable: true,
        value: function mutator (...args) {
            const ob = this.__ob__
            let inserted
            switch (method) {
                case 'push':
                case 'unshift': {
                    inserted = args
                    break
                }
                case 'splice': {
                    inserted = args.slice(2)
                    break
                }
            }
            if (inserted) ob.observeArray(inserted) // 新增的数据加入监听
            ob.dep.notify()
            return original.apply(this, args)
        }
    })
})
