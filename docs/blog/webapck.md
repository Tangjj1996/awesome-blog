# webpack踩坑记

## tip

> HtmlWebpackPlugin config 参数妙用

当`public/index.html`受多个环境的影响，可能不同的业务需要引入不同的`css`或`js`以及一些可配置项

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <% if(htmlWebpackPlugin.options.config.header) { %>
    <link ref='stylesheet' type="text/css" href="./header.css">
    <% }%>
    <title><%= (htmlWebpackPlugin.options.config.title)%></title>
</head>
<body>
    Tangj
    <% if(htmlWebpackPlugin.options.config.header) { %>
    <script src="./header.min.js" type="text/javascript"></script>
    <% } %>
</body>
</html>
```

可以把配置内容放在`public`文件夹下，方便理解和修改

```js
// config.js
module.exports = {
    dev: {
        template: {
            title: '你好',
            header: false,
            footer: false
        }
    },
    build: {
        template: {
            title: '我不是很好',
            header: true,
            footer: false
        }
    }
}
```

然后根据环境的不同，选择相应的模板