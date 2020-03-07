# 前端面试题
## cookie, session, sessionStroage和localStorage的区别

首先要分清的是，cookies, sessionStorage和localStorage是客户端，session是在服务端。服务端的session机制，session对象数据保存在服务器上。实现上，服务器和浏览器之间仅需传递sesssion id即可，服务器根据session id找到对应用户的session对象。会话数据仅在一段时间内有效，这个时间就是server端设置的session有效期。服务器session存储数据安全一些，一般存放用户信息，浏览器只适合存储一般数据。

其次cookies，sessionStroage和localStorage三者的区别

1. cookie数据始终在同源的http请求中携带（即使不需要），即cookie在浏览器和服务器来回传递。而sessionStorage和localStorage不会自动把数据发给服务器，仅在本地保存。

2. 存储大小限制也不同，cookie数据不能超过4k，同时因为每次Http请求都会携带cookie（这里可能还会追问，cookie是在http报文什么地方，答：cookie是携带在http请求头上的），所以cookie只适合保存很小的数据，比如会话标识sessionStroage和localStorage虽然也有大小限制，但是比cookie大很多，可以达到5M。

3. 数据有效期也不同，cookie在设置的有效期（服务端设置）内有效，不管窗口或者浏览器是否关闭，sessionStroage仅在当前浏览器窗口关闭前有效（也就是说只要这个浏览器窗口没有关闭，即使刷新页面或进入同源另一页面，数据仍然存在。关闭窗口后，sessionStorage即被销毁）；localStorage始终有效，窗口或者浏览器关闭也一直保存

4. Web storage支持事件通知机制，可以将数据更新的通知发送给监听者。如：

```js
window.addEventListener('storage', function (e) { alert(e) })
```

```
Web Storage带来的好处：
减少网络流量：一旦数据保存在本地后，就可以避免再向服务器请求数据，因此减少不必要的数据请求，减少数据在浏览器和服务器间不必要地来回传递

快速显示数据：性能好，从本地读数据比通过网络从服务器获取数据快得多，本地数据可以即时获得。再加上网页本身也可以有缓存，因此整个页面和数据都在本地的话，可以立即显示

临时存储：很多时候数据只需要在用户浏览一组页面期间使用，关闭窗口后数据就可以丢弃了，这种情况使用sessionStorage非常方便
```

## Meta标签

1. 搜索引擎优化（SEO）
2. 定义页面使用语言
3. 自动刷新并指向新的页面
4. 实现网页转换时的动态效果
5. 控制页面缓冲
6. 网页定级评价
7. 控制网页显示的窗口

meta标签的组成：meta标签共有两个属性，它们分别是http-equiv属性和name属性，不同的属性又有不同的参数值，这些不同的参数值就实现了不同的网页功能

1. name属性

- keywords 关键词
- description 描述
- robots 机器人向导，告诉搜索机器人哪些页面需要索引，哪些页面不需要索引
- author 作者
- render 渲染 <meta name='render' content='webkit'> 告诉浏览器渲染模式

2. http-equiv属性

相当于http的文件头作用，它可以向浏览器传回一些有用的信息，以帮助正确和精确地显示内容，与之对应的属性值为content，content中的内容其实就是各个参数的变量值

- X-UA-Compatible 浏览模式 <meta http-equiv="X-UA-Compatile" content="IE-edge">

- Exppires 期限 用于设定网页的到期时间，一旦网页过期，必须到服务器上重新传输 <meta http-equiv='expires' content="Fri ...."> 必须使用GMT的时间格式

- Pragma cache模式 禁止浏览器从本地计算机的缓存中访问页面内容 <meta http-equiv="Pragma" content="no-cache">，这样设定，访问者将无法脱机浏览

- Refresh 刷新 自动刷新并指向新页面 <meta http-equiv="Refresh" content="2;URL=http://www.tangji.com">，其中2是指停留2秒钟后自动刷新到URL网址

- Set-Cookie 如果网页过期，那么存盘的cookie将被删除 <meta http-equiv="Set-Cookie" content="cookievalue=xx;expires=Friday;path=/">

- Window-taget 显示窗口的设定 强制页面在当前窗口以独立页面显示 <meta http-equiv="Window-target" content="_blank">，用来防止别人在框架里调用自己的页面

- content-Type 显示字符集的设定 <meta http-equiv="content-Type" content="text/html;charset=gb2312"> 设定页面使用的字符集

- content-Language 显示语言的设定 <meta http-equiv='Content-Language' content="zh-cn">

- Cache-Control Cache-Control指定请求和响应遵循的缓存机制。在请求消息或响应消息中设置Cache-Control并不会修改另一个消息处理过程中的缓存处理过程。请求时的缓存指令包括no-cache、no-store、max-age、max-stale、min-fresh、only-if-cached，响应消息中的指令包括public、private、no-cache、no-store、no-transform、must-revalidate、proxy-revalidate、max-age。各个消息中的指令含义如下:

Public:指示响应可被任何缓存区缓存
Private:指示对于单个用户的整个或部分响应消息，不能被共享缓存处理。这允许服务器仅仅描述当用户的部分响应消息，此响应消息对于其他用户的请求无效
no-cache指示请求或响应消息不能缓存
no-store用于防止重要的信息被无意的发布。在请求消息中发送将使得请求和响应消息都不使用缓存。
max-age指示客户机可以接收生存期不大于指定时间（以秒为单位）的响应
min-fresh指示客户机可以接收响应时间小于当前时间加上指定时间的响应
max-stale指示客户机可以接收超出超时期间的响应消息。如果指定max-stale消息的值，那么客户机可以接收超出超时期指定值之内的响应消息。

## js基础

闭包：能读取其他函数内部变量的函数

堆栈溢出：不顾堆栈中分配的局部数据块大小，向该数据写入了过多的数据，导致数据越界，结果覆盖了别的数据，在递归中经常发生

内存泄漏是指：用动态存储分配函数内存空间，在使用完毕后未释放，导致一直占据该内存单元，直到程序结束，造成内存泄漏：

- setTimeout 的第一个参数使用字符串而非函数的话，会引发内存泄漏

- 闭包、控制台日志、循环（在两个对象彼此引用且彼此保留时，就会产生一个循环）

防止内存泄漏：

1. 不要动态绑定事件

2. 不要动态添加，或者会被动态移除的dom上绑事件，用事件冒泡在父容器监听事件

3. 如果要违反上面的原则，必须提供destroy方法，保证移除dom后事件也被移除

4. 单例化，少创建dom，少绑事件