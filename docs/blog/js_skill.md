# 灵活运用js技巧

1. 条件判断

编写js代码过程中，少不了逻辑判断，通常都是`if/else`或者`switch`。但是在逻辑复杂的时候，总是会把条件判断语句写的很长，越来越臃肿，难以阅读。

比如

```js
const onBtn = (state) => {
    if (state === 1) {
        gotoPage('success')
    } else if (state === 2)  {
        gotoPage('fail')
    } else if (state === 3) {
        gotoPage('warning')
    } else if (state === 4) {
        gotoPage('loading')
    } else {
        gotoPage('cancel')
    }
}
```
也许你会想到把上述的条件判断使用`switch`改写，的确用`switch`会比`if/else`稍微简介一些，但面对更复杂的逻辑也是很局限的。所以呢，我们可以换一种思路，把这些条件和对应的逻辑保存在一个对象中，再根据实际调用执行

```js
const stateObj = {
    '1': ['success'],
    '2': ['fail'],
    '3': ['warning'],
    '4': ['loading'],
    'default': ['cancel']
}

const onBtn = (state) => {
    const action = stateObj[state] || stateObj['default']

    gotoPage(action[0])
}
```

可以看到，把逻辑保存在一个对象中是会比不断`if/else`或者`switch`要简洁一点，但用数值字符串作为对象的键总是让人觉得奇怪，所以呢，再此基础上进行再次优化。

es6中引入了两种新的数据结构，一种叫`Set`，用来存储不重复的元素，另一种叫`Map`，对象的数据结构是`键-值`，也就是只有字符串或者`symbol`才能作为键值，这给对象带来了很大的局限性，毕竟有很多时候我们希望`值-值`的存储方式，而`Map`就很好地解决了这个问题。

利用Map结构来进行优化

```js
const stateMap = new Map([
    [1, 'success'],
    [2, 'fail'],
    [3, 'warning'],
    [4, 'loading'],
    ['default', 'cancel']
])

const onBtn = (state) => {
    const action = stateMap.get(state) || stateMap.get('default')
    
    gotoPage(action[0])
}
```

这样看起来就好多了，当然实际情况可能是多变的，每一个`state`可能都对应着不同的函数，这时候可以直接把函数保存在`Map`中

```js
const stateMap = new Map([
    [1, () => {}],
    [2, () => {}],
    [3, () => {}],
    [4, () => {}],
    ['default', () => {}],
])

const onBtn = (state) =>  {
    const action = stateMap.get(state) || stateMap.get('default')
    
    action.call(this)
}
```

业务代码中经常会加入身份`identity`和`state`联合判断，按照上述的思想，把所有判断条件都储存到`Map`

```js
const actionsMap = new Map([
    [{identity: 'guest', state: 1}, () => {}],
    [{identity: 'guest', state: 2}, () => {}],
    [{identity: 'guest', state: 3}, () => {}],
    [{identity: 'guest', state: 4}, () => {}],
])

const onBtn = (identity, state) {
    const action = [...actionsMap].filter(([key, value]) => key.identity === identity && key.state === state)
    
    action.forEach(([key, vlaue]) => value.call(this))
}
```

结合正则，可以写的更高级一些，假如`state`**1-3**都是一样的执行函数

```js
const actions = () => {
    const functionA = () => {}
    const functionB = () => {}
    
    return new Map([
        [/guest_[1-3]/, functionA],
        [/guest_4/, functionB]
    ])
}

const onBtn = (identity, state) => {
    const action = [...actions].filter(([key, value]) => key.test(`${identity}_${state}`))
    
    action.forEach(([key, value]) => value.call(this))
}
```

`Map`数据结构给js增加了更多的可能性，以后写逻辑判断可千万别只会`if/else`或者`switch`了，思路开阔一些能让代码变得更简洁，😄