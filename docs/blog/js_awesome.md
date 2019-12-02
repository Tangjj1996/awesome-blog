# 灵活运用js ---原生篇

## 1. 手写一个Promise
**Promise**是es6中的一个重要语法，在日常开发中非常常用，在Promise出现之前，函数只能通过callback的形式调用表示函数的执行顺序，而层层回调又不可避免地造成回调地狱，代码变得非常不好维护，也不美观。Promise解决了这一痛点，很多常见的库比如`axios`都是基于Promise结合`ajax`进行封装的，当然Promise作用不止于此，咱们现在就通过Promise的外在表现，从零开始构建出一个完整的Promise构造函数，暂且把它称作**MyPromise**吧~

### 1. Fn同步执行

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

### 2. then方法接受resolve或者reject方法的参数

在Promise中，then的第一个参数接收resolve的参数值，即成功的回调；then的第二个参数接收reject的参数值，即失败的回调。

所以呢，我们定义两个变量，`value`保存resolve或者reject的参数，`status`保存调用的状态，是一个布尔值，当调用resolve时为`true`，调用reject函数时为`false`

那么代码实现为

```js
function MyPromise(fn) {
    let value  // 保存resolve/reject的参数
    let status  // 保存状态 -> true | false

    fn(resolve, reject)

    function resolve(params) {
        value = params
        status = true
    }

    function reject(params) {
        value = params
        status = false
    }

    function handler(deffer) {
        status ? deffer['onFullFilled'](value) : deffer['onRejected'](value)
    }

    this.then = function (onFullFilled, onRejected) {
        let deffer = { onFullFilled, onRejected }
        handler(deffer)
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

function resolve(parmas) {
    if (!isExe) {
        value = parmas
        status = true
        isExe = true  // 只要执行就把isExe设为true,并且不再执行reject方法体的内容
    }
}

function reject(parmas) {
    if (!isExe) {
        value = parmas
        status = false
        isExe = true
    }
}
```

### 3. 异步调用函数

前面我们说了，Promise最常用的地方是处理回调，特别是异步回调，能很友好地解决回调地狱的问题，从未增加代码的可阅读性以及更容易维护。假设resolve函数并不是直接调用的，而是一个异步调用的形式，比如这种

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

function resolve(params) {
    if (!isExe) {
        value = parmas
        status = true
        isExe = true
        finnal(deffers)
    }
}

function reject(params) {
    if (!isExe) {
        value = params
        status = false
        isExe = true
        finnal(deffers)  
    }
}

function finnal(deffers) {  // 遍历执行deffers数组
    for (let i = 0; i < deffers.length; i++) {
        handler(deffers[i])
    }
}

function handler(deffer) {
    if (status) {
        deffer['onFullFilled'] && deffer['onFullFilled'](value)
    } else if (status === false) { // status声明未赋值，如果then存在第二个参数，那么会执行输出undefined，此处增加判断条件可避免这种情况
        deffer['onRejected'] && deffer['onRejected'](value)
    }
}

this.then = function(onFullFilled, onRejected) {
    let deffer = { onFullFilled, onRejected }
    deffers.push(deffer)
    handler(deffer)
}
```

## 2. 手写call、apply和bind

```js
Function.prototype.myCall = function(context, ...args) {
    context = (typeof context === 'object' ? context : window)
    
    const key = Symbol()
    context[key] = this
    
    const result = context[key](...args)
    delete context[key]
    
    return result
}

Function.prototype.myBind = function(context, args) {
    context = (typeof context === 'object' ? context : window)
    
    const key = Symbol()
    context[key] = this
    
    const result = context[key](...args)
    delete context[key]
    
    return result
}

Function.prototype.myBind = funtion(context) {
    context = (typeof context === 'object' ? context : window)
    
    return (...args) => {
        this.call(context, ...args)
    }
}
```

