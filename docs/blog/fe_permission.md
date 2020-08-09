# 聊聊前端权限控制

一般业务，权限控制分为四大类：接口权限、按钮权限、页面权限、路由权限

## 1. 接口权限

### 原则

接口权限是最为常用的一种，通常采用jwt形式验证，没有通过返回404 Authentication Required,`返回登录页重新登录`

登录完成，拿到`Token`将token保存（cookie或者sessionStorage）,每次登录的时候头部携带token（通过axios请求拦截实现）

```js
const { token } = login()
cookie.set('token', token)
axios.interceptors.request.use(config => {
    config.headers['token'] = cookie.get("token")
    return config
})
axios.interceptors.response.use(res => {
    // token过期
    if (res.data.code === 40099 || res.data.code === 40098) {
        router.push("/login")
    }
})
```

## 2.按钮权限

### 原则

一个页面会有新增，删除，编辑等等按钮。不同用户对应不同的操作权限

按照Linux文件权限分级规则，假定权限码为：0 -> 不可见，1 -> 可见不可编辑，1 >> 1 -> 可见可编辑

提前和后端约定好按钮的名字，后端返回一个按钮权限列表，根据权限列表使用v-if指令或者绑定disabled属性达到响应的权限效果

最好的是自己写一个自定义权限指令，实质就是根据响应权限操作dom

比如概览页面的编辑按钮，名字先和后端定义好叫做overview-edit

```js
// overview.vue overview是概览页面的路由名
<button v-auth='edit' />
 
// util.js 全局注册自定义指令
Vue.directive('auth', {
    inserted: function (el, binding, vnode) {
        const optName = binding.arg
        const authName = `${routeName}-${optName}` // 这里根据路由名和操作类型拼出按钮名 overview-edit
        const btnAuthList = store.state.auth.btnAuthList
        if (btnAuthList[authName] === 0) { // 按钮权限为0则移除dom
            el.parentNode.removeChild(el)
        }else if (btnAuthList[authName] === 1) { // 按钮权限为1则禁用按钮
            vnode.componentInstance.disabled = true
        }
    }
})

// 登录的时候接受按钮权限并存在vuex里面
const { btnAuthList } = login()
vuex.state.btnAuthList = btnAuthList
```

## 3. 页面权限（菜单权限）

### 原则

获取菜单权限列表，动态递归生成菜单

这个菜单权限列表是可以后台直接返回的，也可以是注册路由的时候写在meta里面的菜单信息，后台返回路由权限，根据meta信息动态算出菜单权限

至于菜单肯定是根据菜单权限递归生成

```js
// 如果是定义在route信息里面会是这种样子
// 我们可以根据后端返回的路由权限结合meta算出来菜单权限
{
    name: 'xxx',
    path: 'xxx',
    meta: {
        role: ['xxx', 'xxx', 'xxx'], // 角色权限
        MenuIcon: 'xxxx', // 菜单图标
        MenuTitle: 'xxx'  // 菜单名
    }
}

// 当然也可以麻烦后台直接生成菜单权限返回
const { menuList } = login()
// 存vuex里
vuex.state.menuList = menuList
// 在侧边栏或者顶部菜单组件里动态生成菜单
// 这里基本都是用的UI库，比如elmenet-ui的NavMenu来实现
<navMenu :menuList="menuList" />
```

## 4. 路由权限

### 原则

上面的菜单权限虽然做到能看不见菜单，但是可以通过直接输入URL的方式去没有权限的页面，这种情况需要靠设计路由权限来阻止

一般有两个方案：

1. 常用的，先注册好所有的路由，然后获取有资格访问的路由权限列表，最后直接通过Router.beforeEach来判断，每次跳路由的时候判断是否在权限列表里，在的话放行，不再就提示权限不够。优点：简单暴力，不会跳到404页面（因为去的路由能在路由规则里找到） 缺点：由于初始化了所有路由，运行的时候会挂在不必要的路由
2. 先只注册基本路由，然后获取路由权限列表，借助route.add()API根据权限列表有权限的路由动态注册到路由规则上，优缺点与第一种正好相反

```js
const { routeAuthList } = login()
const whiteList = ['/login', '/', '/404']

// 合并生成总路由
whiteList = whiteList.contact(routeAuthList)
// 存vuex
vuex.state.whiteList = whiteList
// 路由守卫判断
router.beforeEach((ro, from, next) => {
    // 权限校验
    let pass = whiteList.include(to)
    if (!pass) {
        return console.log("无权访问")
    }
    next()
})
```

