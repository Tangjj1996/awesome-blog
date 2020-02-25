# 灵活运用js ---原生篇

## 1. 手写一个Promise
**Promise**是es6中的一个重要语法，在日常开发中非常常用，在Promise出现之前，函数只能通过callback的形式调用表示函数的执行顺序，而层层回调又不可避免地造成回调地狱，代码变得非常不好维护，也不美观。Promise解决了这一痛点，很多常见的库比如`axios`都是基于Promise结合`ajax`进行封装的，当然Promise作用不止于此，咱们现在就通过Promise的外在表现，从零开始构建出一个完整的Promise构造函数，暂且把它称作**MyPromise**吧:tada:

### 1.1 Fn同步执行

Promise内的函数是同步执行的，那么以下代码应该先打印111，再打印222

```js
let a = new Promise((resolve, reject) => {
    console.log(111)  
})

console.log(222)
```

那么我们的MyPromise也应该如此

```js
function MyPromise (fn) {
  fn()
}

let a = new MyPromise((resolve, reject) => {
    console.log(111) // -> 先打印 1111
})

console.log(222)  // 再打印 222
```

### 1.2 then方法接受resolve或者reject方法的参数

在Promise中，then的第一个参数接收resolve的参数值，即成功的回调；then的第二个参数接收reject的参数值，即失败的回调。

所以呢，我们定义两个变量，`value`保存resolve或者reject的参数，`status`保存调用的状态，是一个布尔值，当调用resolve时为`true`，调用reject函数时为`false`

那么代码实现为

```js
function MyPromise(fn) {
    let value = undefined  // 保存resolve/reject的参数
    let status = null  // 保存状态 -> true | false

    fn(resolve, reject)

    function resolve(val) {
        value = val
        status = true
    }

    function reject(reason) {
        value = reason
        status = false
    }

    function handler(deffer) {
        if (status === true) {
            deffer['onFulFilled'] && deffer['onFulFilled'](value)
            return
        } 

        if (status === false) {
            deffer['onRjected'] && deffer['onRejected'](value)
            return
        }
    }

    this.then = function (onFulFilled, onRejected) {
        let deffer = { onFulFilled, onRejected }
        handler(deffer)
    }

    this.catch(error) {
        if (tyof error === 'function') {
            this.then(null, error)
        }
    }
}

let test = new MyPromise((resolve, reject) => {
    resolve(111)
})

test.then(res => {
    console.log(res)
}, err => {
    console.log(err)
})
```

但是这样有一个问题，当你重新实例化一个构造函数的时候，resolve和reject会相互覆盖。

比如

```js
let test1 = new MyPromise((resolve, reject) => {
	resolve(111)
	reject(222)
})

test1.then(res => {
    console.log(res)
}, err => {
    console.log(err)  // status会被fn函数参数后执行覆盖，所以只会打印 222
})
```

在实际的Promise函数中，resolve和reject只会执行其中的某一项，当没有判断条件的时候，会输出第一次执行的函数参数。

那么我们需要一个变量`isExe`来保存执行状态，如果resolve或reject有一方执行，就把`isExe`设为`true`

```js
...省略重复部分
let isExe = false

function resolve(val) {
    if (!isExe) {
        value = val
        status = true
        isExe = true  // 只要执行就把isExe设为true,并且不再执行reject方法体的内容
    }
}

function reject(reason) {
    if (!isExe) {
        value = reason
        status = false
        isExe = true
    }
}
```

### 1.3 异步调用函数

前面我们说了，Promise最常用的地方是处理回调，特别是异步回调，能很友好地解决回调地狱的问题，从未增加代码的可阅读性以及更容易维护，这是Promise的重点，采用了发布订阅（观察者）模式实现！假设resolve函数并不是直接调用的，而是一个异步调用的形式，比如这种

```js
new Promise((resolve, reject) => {
    setTimeout(() => {
        resovle(111)
    }, 1000)
}).then(res => { console.log(res) })
```

显然，我们还需要一个数组`deffers`来保存then的回调，当异步函数真正执行时，再根据`status`来输出不同的`value`。为了安全起见，将上述的handler函数改写，

```js
let deffers = []

function resolve(val) {
    if (!isExe) {
        value = val
        status = true
        isExe = true
        finnal(deffers)
    }
}

function reject(reason) {
    if (!isExe) {
        value = reason
        status = false
        isExe = true
        finnal(deffers)  
    }
}

function finnal(deffers) {  // 遍历执行deffers数组
    for (let i = 0, len = deffers.length i < len; i++) {
        handler(deffers[i])
    }
}

function handler(deffer) {
    if (status === true) {
        deffer['onFullFilled'] && deffer['onFullFilled'](value)
        return
    }
    
    if (status === false) { // status声明未赋值，如果then存在第二个参数，那么会执行输出undefined，此处增加判断条件可避免这种情况
        deffer['onRejected'] && deffer['onRejected'](value)
        return
    }
}

this.then = function(onFullFilled, onRejected) {
    let deffer = { onFullFilled, onRejected }
    deffers.push(deffer)
    handler(deffer)
}
```

完整代码（未完待续...）
```js
function Mypromise(fn) {
    let value = undefined
    let status = null
    let isExe = false
    let deffers = []

    function resolve(val) {
        if (!isExe) {
            value = val
            status = true
            isExe = true
            final(deffers)  // 异步时候保证then链在status之后执行
        }
    }

    function rejected(reason) {
        if (!isExe) {
            value = reason
            status = false
            isExe = true
            final(deffers)
        }
    }

    function handle(deffer) {
        if(status === true) {  // 判断条件，如果是异步此处的status为null
            deffer['onFulFilled'] && deffer['onFulFilled'](value)
        }

        if(status === false) {
            deffer['onRejected'] && deffer['onRejected'](value)
        }
    }

    function final(deffers) {
        deffers.forEach(deffer => handle(deffer))
    }

    this.then = (onFulFilled, onRejected) => {
        const curPromise = new Mypromise((resolve, rejected) => {
            setTimeout(() => {
                const deffer = { onFulFilled, onRejected }
                deffers.push(deffer)
                const result =  handle(deffer)  
                resolvePromise(curPromise, result, resolve, rejected)                
            }, 0);
        })

        return curPromise
    }

    this.catch = (error) => {
        if (typeof error === 'function') {
            this.then(null, error)
        }
    }

    fn(resolve, rejected)
}

const resolvePromise = (curPromise, result, resolve, rejected) => {
    // ...
}

const p = new Mypromise((resolve, rejected) => {
    resolve(22)
})

p.then(res => 1).then(res => console.log(res))
```

## 2. 手写可改变作用域的三个方法call、apply以及bind

```js
Function.prototype.myCall = function(context, ...args) {
    context = (typeof context === 'object' ? context : window)
    
    const key = Symbol()
    context[key] = this
    
    const result = context[key](...args)
    delete context[key]
    
    return result
}

Function.prototype.myApply = function(context, args) {
    context = (typeof context === 'object' ? context : window)
    
    const key = Symbol()
    context[key] = this
    
    const result = context[key](...args)
    delete context[key]
    
    return result
}

Function.prototype.myBind = function(context) {
    context = (typeof context === 'object' ? context : window)
    
    return (...args) => {
        this.call(context, ...args)
    }
}
```

## 3. 手写数组常用方法包括slice、filter、reduce等
```js
Array.prototype.myReduce = function(callback) {
    // 保存调用的执行上下文
    let context = this, // 这里指向 -> arr
    // 数组下标
    index = 0,
    // 初值
    prev,
    // 接受返回值
    next

    if (typeof callback !== 'function') { throw new TypeError('参数必须是一个回调函数') }

    if (arguments.length > 1) {
        prev = arguments[1]
    } else {
        prev = context[index]
        index++
    }
    while(index < context.length) {
        next = context[index]   
        // 把执行结果返回给上一个值     
        prev = callback.apply(null, [prev, next, index, context])    
        index++    
    }
    return prev
}

const arr = [1, 2, 3, 4]
arr.myReduce((prev, next) => {
    console.log(prev)
    return prev + next
}, 0)
```

## 4. 正则表达式与replace

replace是js语言中字符串操作必不可少的原生支持的工具函数，支持正则表达式，功能十分强大。

> 语法： str.replace(regexp|substr, newSubStr|function)
> 注意： replace函数不会影响原来的字符串，只会返回一个新的字符串，当你希望得到这个新值，需要重新赋值

简单的就不举例了，需要留意的是，当你把正则作为第一个参数，并且想要全局匹配，需要在正则后面加全局修饰符`/g`

replace的第二个参数是字符串，可以在字符串中使用一些通配符，以`$`开头

|变量名|代表的值|
|:--:|:--|
|$$|插入一个"$"|
|$&|插入匹配的子串|
|$`|插入当前匹配的字串左边的内容|
|$'|插入当前匹配的字串右边的内容|
|$n|假如第一个参数是`RegExp`对象,并且n是小于100的正整数，插入第n个括号匹配的字符串，索引从1开始

举两个例子
```js
// 格式化金钱
// \B非边界
// ?=正向先行断言
// ?!负向先行断言
// 全局匹配money,该非边界符合后面出现1次或多次三个数字，并且末尾不能有数字
// 第一次匹配到3 和 4的非边界，规则是'456'和'789'为两次三个数字，并且'789'后面不包含数字
// 假如第一次匹配到的是1 和 2的非边界，那么'234'和'567'为两次三个数字，但是'567'后面包含了数字'89'
const reg = /\B(?=(\d{3})+(?!\d))/g
const money = '123456789.10'

money.replace(reg, ',')
// 输出
// 123,456,789.10
```

```js
// 格式化字符串变量
// 当匹配到{}变量，如果$1在agruments[0]能找到key,则用value替换，否则把匹配到的字串也就是原来的{}字段，原样返回
String.prototype.format = function () {
    let args = typeof arguments[0] === 'object' ? arguments[0] : arguments

    return this.replace(/\{(.*?)\}/g, (m, p1) => {
        return p1 in args ? args[p1] : m
    })
}

const str = 'name: {name}, age: {age}'
str.format({ name: 'tangj', age: 25 })
// 输出
// name: tangji, age: 25
```