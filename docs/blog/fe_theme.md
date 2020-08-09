# 聊聊前端换肤

网站更换主题色一直是前端开发的热门话题，一般来说有四种方式

## 1. 多写几套样式

这是比较容易想到的，并且早前网站业务不复杂的时候大家也是这么做的。例如我们想要点击不同的按钮，更换不同的主题

- theme-red.css
- theme-blue.css
- theme-yellow.css

这种办法优点在于简单，我们只需要根据不同的类名限定样式，更换的时候替换类名就行。缺点也很明显：

1. 样式重复，假如有几十个样式，就需要几十个样式文件，代码十分臃肿
2. 切换生硬，一般来说，如果css样式不是嵌入到`<style>`文件或者内敛样式，就会有闪屏现象
3. 还是样式重复的问题，因为有很多情况公共样式是不需要修改的，我们只需更改几个特别的变量，比如颜色、宽高、背景等等

所以，如果你的项目是通过cli工具集成的，采用这种办法就太低效了...

## 2. Element-UI的实现

element的实现方式相对来说就高级多了，具体情况请查看相关的[issus](https://github.com/ElemeFE/element/issues/3054)

实现其实很暴力：

1. [先把默认主题文件中涉及到颜色的css值替换成关键词](https://github.com/ElementUI/theme-preview/blob/master/src/app.vue#L250-L274)

2. [根据用户选择的主题色生成一系列对应的颜色值](https://github.com/ElementUI/theme-preview/blob/master/src/utils/formula.json)

3. [把关键词再换回刚刚生成的相应的颜色值](https://github.com/ElementUI/theme-preview/blob/master/src/utils/color.js)

4. [直接在页面上加`style`标签，将生成的样式填进去](https://github.com/ElementUI/theme-preview/blob/master/src/app.vue#L198-L211)

大致思路就是先确定一个主色`primary`，然后其他的颜色依赖这个主色，这里调用了一个css函数计算库`css-color-function`，当主色变化，其他的颜色自动计算得出最新的颜色渲染到`<style>`中

这里要注意我们把css样式渲染到`<head>`中首次追加，之后都是替换

```js
writeNewStyle() {
    let cssText = this.originalStyle;
    Object.keys(this.colors).forEach(key => {
        cssText = cssText.replace(new RegExp('(:|\\s+)' + key, 'g'), '$1' + this.colors[key]);
    });
    if (this.originalStylesheetCount === document.styleSheets.length) {
        const style = document.createElement('style');
        style.innerText = cssText;
        document.head.appendChild(style);  // 在mounted挂载的时候就追加style
    } else {
        document.head.lastChild.innerText = cssText;  // 如果已经存在了相应的style标签，之后只需要替换style中的内容即可
    }
}
```
如`Element-UI`所说，实现原理很暴力，直接插入到页面中，这种实现方式优点就是所有的要修改css样式都保存在一个配置对象中，相对第一种代码的耦合性减少了很多，我们只需要依赖主色`primary`利用css-color-function修改相应的颜色就行了，而且扩展性也很不错，对于颜色修改少的项目挺合适的。

那么它的缺点也很明显了，你需要自己设计出一套主题样式，这对于个人来说还是挺麻烦的，可以你要一直更改参数值使得整套主题不会那么突兀。还有就是因为是直接操作dom，可能还是会有闪屏现象

## 3. Antd实现方式

如果你的项目的样式预处理器是`less`，那么你可以试试`antd`修改主题的方式，我最近也在写一个用`antd`作为UI库的个人项目，就是利用这种方式实现的，[感兴趣的可以看看](https://github.com/Tangjj1996/TJ-antd-pro#23-antd%E5%8A%A8%E6%80%81%E4%BF%AE%E6%94%B9%E4%B8%BB%E9%A2%98)

[less文档](https://www.html.cn/doc/less/usage/#using-less-in-the-browser)有详细的使用教程，大概就是你把`less.js`直接通过`<script>`标签引入到项目中，它会自动找到`less`样式标签（这需要你以`<link rel='stylesheet/less'>`引入），并且使用已编译的css同步创建`<style>`标签。

::: tip 提示
通过`<link>`标签在`html`引入，要注意位置，如果你是在`<head>`中，很可能会被后来生成的样式文件干扰，最好放在`<body>`中或者设置一下引入的顺序
:::

## 4. css自定义变量的方式

css变量声明使用`--`（例如`--main-color`），由var()函数获取值（例如`color: var(--main-color)`）。css变量受级联的约束，并从其父级继承值，大多数情况下我们都需要全局css变量，所以在声明的时候`:roor{--main-color: brown}`

当你希望使用局部变量，只需要将变量定义在该元素选择器内部即可

你也可以使用`js`来改变变量

```js
// 设置
document.body.style.setProperty('--main-color', "red")

// 获取
document.body.style.getPropertyValue("--main-color")

// 删除
document.body.style.removeProperty('--mian-color')
```

你的项目可能是cli工具集成的，一般都会自动使用`postcss`，然而`postcss`会将css自定义变量直接编译成确定值，而不是保存值，也就是说它直接计算出`var(--main-color)`，这时就需要`postcss插件`为我们保存自定义的变量

使用[postcss-custom-properties](https://github.com/postcss/postcss-custom-properties),设置`preserve=true`

我们可以采用`Element-UI`的思路，设置一个主色，其他的颜色依赖主色引入`css-color-function`进行颜色的计算。

```js
document.body.style.setProperty('--main-color', color.convert(`color(${value} tint(90%))`))
```

## 总结

个人最倾向于第三种方式，如果你的项目使用了`less`，那就直接使用`less.modifyVars()`来动态修改主色吧，快捷方便。如果使用的是`sass/scss/stylus`，那就试试`css变量`的方式，如果你是新手不会配置`postcss插件`或者懒得配置，那就使用`Element-UI`的暴力办法:rofl: