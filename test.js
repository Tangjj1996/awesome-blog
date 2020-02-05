const result = 'name: {name}, age: {age}, friend: {friend}'

String.prototype.format = function () {
    let args = typeof arguments[0] === 'object' ? arguments[0] : arguments

    return this.replace(/\{(.*?)\}/g, (m, p1) => {
        return p1 in args ? args[p1] : m
    })
}

const money = '123456789.10'
const reg = /\B(?=(\d{3})+(?!\d))/g

console.log(result.format({ name: 'tangj', age: 25 }))