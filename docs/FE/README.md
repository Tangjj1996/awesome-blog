# Vue源码浅析

## 双向绑定

Vue的双向绑定绑定原理是通过`Object.defineProperty`实现的，每次获取`getter`和重新赋值`setter`都会进行相应的操作

```js
// 大致思路先捋一下，有空再组织语言
function observe(obj) {
    if (!obj || typeof obj !== 'object') {
        return false
    }

    Object.keys(obj).forEach(key => {
        defineRetive(obj, key, obj[key])    
    })
}

function defineRetive (obj, key, val) {
    // 递归
    observe(obj[key])

    let dep = new Dep()

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,

        get: function() {
            // 访问值时就把这个watcher放进dep里
            Dep.target && dep.addSubs(Dep.target)
            return val
        },

        set: function(newValue) {
            val = newValue
            // 更新的时候调用update执行notify函数最终执行update函数
            dep.update(val)
        }
    })
}

class Dep {
    constructor() {
        this.subs = []
    }

    addSubs(watcher) {
        this.subs.push(watcher)
    }

    update(val) {
        this.subs.forEach(sub => sub.notify(val))
    }
}

Dep.target = null

class Watcher {
    constructor(obj, key, cb) {
        Dep.target = this
        this.obj = obj
        this.key = key
        this.cb = cb
        this.value = obj[key]
        Dep.target = null
    }

    notify(val) {
        this.value = val
        this.cb(val)
    }
}

function update(val) {
    console.log(val)
}

let data = { name: 'TangJ' }
observe(data)

new Watcher(data, 'name', update)
data.name = 'xxx'
```