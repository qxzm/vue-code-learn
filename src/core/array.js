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
            return original.apply(this, args)
        }
    })
})
