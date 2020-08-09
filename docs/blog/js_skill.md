# 灵活运用js ---技巧篇

## 1. 条件判断

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

`Map`数据结构给js增加了更多的可能性，以后写逻辑判断可千万别只会`if/else`或者`switch`了，思路开阔一些能让代码变得更简洁:grinning:

## 2. 树节点遍历

复杂组件比如`element-ui`中的`tree`组件少不了要去遍历树节点，根据遍历情况触发相应的规则，可以说遍历算法在前端开发中的地位不低于排序算法，所以特意总结以下开发中常见的几种遍历思路。

遍历分为广度优先遍历和深度优先遍历，深度优先一般递归实现，使用频率高，广度优先遍历一般循环实现，使用频率低。同时深度优先遍历又可以分为先序遍历和后序遍历。

深度优先和广度优先简要概念
- 深度优先： 访问同级子节点，再去访问下一级的子节点，一直访问到再也没有下一级子节点再按照相同的访问规则去访问同级的子节点。先访问根节点再访问子节点的叫先序遍历，先访问子节点最后到根的叫后序遍历。

- 广度优先： 按照**同级顺序**，如果要访问n+1，首先访问n，而不用管n内的子节点。

假设有一个树节点

```js
let tree = [
    {
        id: 1,
        title: '节点1',
        children: [
            {
                id: 2,
                title: '节点1-1'
            }
        ]
    },
    {
        id: 3,
        title: '节点2'
    },
    {
        id: 4,
        title: '节点3',
        children: [
            {
                id: 5,
                title: '节点3-1'
            },
            {
                id: 6,
                title: '节点3-2'
            }
        ]
    }    
]
```
广度优先

```js
// 广度优先
function seniorGround (propTree, func) {
    // node 保存数组第一项数据， list为树节点的拷贝数组
    let node, list = [...propTree]  

    while(node = list.shift()) {
        func(node.title) 
        // 当有子节点，先输出同级节点title，把子节点放进数组最后一项，一直到list为空
        node.children && list.push(...node.children)
    }
}

seniorGround(tree, node => console.log(node))
```

控制台输出
```sh
节点1
节点2
节点3
节点1-1
节点3-1
节点3-2
```

深度优先(先序遍历)

```js
// 深度先序
function deepSequence (propTree, func) {
    propTree.forEach(node => {
        func(node.title)
        node.children && deepSequence(node.children, func)
    })
}

deepSequence(tree, node => console.log(node))
```

深度优先(后序遍历)

```js
// 深度后序  
// 深度后序和先序是一样的，只是函数参数的执行顺序有所区别
// 先序是访问到子节点就先执行函数，再去递归
// 后序是先递归，当到达递归栈顶再执行函数，此时的节点就在最深一级

function deepReverse (propTree, func) {
    propTree.forEach(node => {
        node.children && deepSequence(node.children, func)
        func(node.title)
    })
}

deepReverse(tree, node => console.log(node))
```

递归遍历是最常见的算法，当然也可以用循环,像广度遍历一样维护一个队列

```js
// 深度先序,循环实现
// 思路就是访问到节点，把它子节点放到队列的顶部
// func的参数总是最深度的子节点，然后才是同级节点的下一个节点(next brother)

function deepSequence (propTree, func) {
    let node, list = [...propTree]

    while(node = list.shift()) {
        func(node.title)

        node.children && list.unshift(...node.children)
    }
}

deepSequence(tree, node => console.log(node))
```
## 3. script defer async 差别
![图片](https://umatang.gitee.io/blog/module script.png)