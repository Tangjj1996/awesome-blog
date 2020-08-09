# Vue开发知识点收集（可能有用）

## 1. v-if在组件和dom节点的应用

 `v-if`在vue框架中是非常常见的指令，当然最常见的知识点应该是与`v-show`之间的区别，一句话总结就是`v-if`会真正的销毁重建组件或节点，而`v-show`只是把`style`样式中的`display: none`而已。但是，我们今天的关注点不在这，而是`v-if`写在组件中与写在`dom`节点有什么区别呢？

比如这样(伪码演示)

```vue
// eg.1
// app.vue
<hello-world v-if='visible'/>
    
// HelloWorld.vue
<div>Hello World</div>
```

```vue
// eg.2
// app.vue
<hello-world />
    
// HelloWorld.vue
<div v-if='visible'>Hello World</div>
```

::: tip Vue官网解释

 `v-if` 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。

 `v-if` 也是**惰性的**：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。
:::

所以如果`v-if`用在组件上，那么条件块中的组件生命周期会在为`true`时重新执行；而如果仅仅作用在`dom`节点上(如上面的eg.2)，只会有节点的销毁和重建，组件的生命周期只会加载一次。为了符合你预期效果，不再浪费生命中的三个小时（别问我怎么知道的...），请务必在组件外部而不是在组件内的根节点上使用!!!

但是考虑封装性我们还是会把`v-if`写在组件的内部，这时候，通常的策略就是监听组件上的`prop`值做相应的同步。这样有一个特点，因为组件已经加载成功，所以组件的`data`数据不会因为`prop`值的改变而初始化（除非**watch**监听有相应的变化），起到的缓存上一次操作的效果。

## 2. require.context自动导入
使用`vuex`导入不同的`modules`总是很烦，每次都要在文件头中不停`import`不同的模块，当你增加模块还得再引入一遍；类似的情况还有，当你想在当前页面使用子组件，你总是要引用 -> 注册 -> 使用，每增加一个子组件都要这么来一遍，很繁琐。如果你有这样的困惑，不妨了解下这个API：

**require.context(directory, useSubdirectories, regExp)**

这是`webpack`的一个api，通过执行函数获取一个特定的上下文，实现自动化导入，不再需要每次显式地调用import来导入模块。其中

**directory**  --- 读取文件的路径

**useSubdirectories** --- 布尔值，是否遍历文件的子目录

**regExp** --- 匹配文件的正则

该函数会返回一个webpackContext函数，同时这个函数还有一个keys属性（没错，在Js语法中函数是可以拥有属性的，大部分函数至少有一个name和prototype属性，匿名函数没有name箭头函数和new之后返回的函数没有prototype），并且这个keys属性也是一个方法，调用返回该目录下文件名.

webpackContext函数会直接输出文件导出的内容，但是因为es6的import / export default 语法，当你真正想拿到里面内容的时候，还需要取这个对象的`default`属性。建议把所有需要导出的内容都写在`export default`中，统一处理

所以，你大概可以写成这样
```js
const webpackContext = require.context('./tree', false, /\.js/i)

const res = webpackContext.keys().reduce((module, pathname) => {
    const key = pathname.replace(/^\.\/(.*)\.\w+$/, "$1")
    module[key] = webpackContext(pathname)['default'] 

    return module    
}, {})
```

## 3. 高阶组件属性中的$attrs和$listeners

这两个API都是2.4.x新增的，`$attrs`包含父作用域中不作为prop被识别（且获取），即父组件传入子组件没有主动获取的props，除了class和style。当一个组件没有声明任何prop时，这里会包含所有父作用域的绑定，并且可以通过`v-bind="$attrs"`，传入内部组件

父组件 -> 子组件1 -> 子组件1-1

父组件传入子组件1的props，子组件1没有主动获取，即子组件1中没有接受这些prop，当你在子组件1使用`$attrs`可以直接把父组件的props传给子组件1-1。这在高级组件还是挺有用的，你需要借助子组件1进行props转发，不用每一层都把父组件的props写上

`$listeners`和`$attrs`用法相似，只不过这时候它转发的是包含父作用域中（不包含`.native`修饰器的）`v-on`事件监听器。它可以通过`v-on="$listeners"`传入内容组件

## 4. 动态路由addRouter

## 5. 自定义icon组件

## 6. 图片懒加载
