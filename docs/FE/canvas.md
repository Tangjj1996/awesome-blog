# canvas 编程
> const canvas = document.getElemetById('canvas') //获取canvas元素<br>
> const ctx = canvas.getContext('2d')  // 获取2d context对象

## 1. canvas API

```
rect(x, y, width, height) 绘制矩形
fillRect(x, y, width, height)  绘制被填充的矩形
strokeRect(x, y, width, height)  绘制矩形(无填充) 
clearRect(x, y, width, height)  清除指定的矩形内的像素

fill() 填充当前绘图(路径)
stroke() 绘制已定义的路径
beginPath() 起始(重置)当前路径
moveTo(x, y) 将笔触移动到指定的坐标(x, y)
lineTo(x, y) 绘制一条从当前位置到指定的坐标(x, y)的直线
clip() 从原始画布裁剪任意形状和尺寸的区域
quadraticCurveTo() 创建二次贝塞尔曲线
bezieCurveTo() 创建三次贝塞尔曲线
arc(x, y, radius, startAngle, endAngle, anticlockwise) 绘制圆或圆弧
arcTo(x1, y2, x2, y2, radius) 根据给定点画圆弧，再以直线连接两个点
isPointInPath(x, y) 检测指定的点是否在当前路径中，在则返回true

fillStyle 设置或返回用于填充绘画的颜色、渐变或模式
strokeStyle 设置或返回用于笔触的颜色、渐变或模式
shadowColor 设置或返回用于阴影的颜色
shadowBlur 设置或返回用于阴影的模糊级别
shadowOffsetX 设置或返回阴影与形状的水平距离

lineCap 设置或返回线条的结束点样式(butt, round, square)
lineJoin 设置或返回当两条线交汇时，边角的类型(bevel、round、miter)
lineWidth 设置或返回当前的线条宽度
miterLimit 设置或返回最大斜接长度

createLinearGradient(x0, y0, x1, y1) 创建线性渐变
createPattern(image/canvas/video, repeat)  在指定的方向内重复绘制指定的元素
createRadialGradient(x0, y0, r0, x1, y1, r1) 创建径向渐变
addColorStop(stop, color) 规定渐变对象中的颜色和停止位置

font 设置或返回文本内容的当前字体属性(和css的font一样)
textAlign 设置或返回文本内容的当前对齐方式
textBaseline 设置或返回在绘制文本时使用的当前文本基线
fillText(text, x, y) 在画布上绘制“被填充”的文本
strokeText(text, x, y) 在画布上绘制文本(无填充)
measureText(text) 返回包含指定文本宽度的对象(属性width获取宽度)

drawImage(image/canvas, x, y)
drawImage(image/canvas, x, y, width, height)
drawImage(image/canvas, sx, sy, sWidth, sHight, dx, dy, dWidth, dHeidht)  在画布上绘制图像、画布或视频

createImageData(width, height) 
createImageData(imageData)  绘制ImageData对象
getImageData(x, y, width, height) 返回ImageData对象，该对象为画布上指定的矩形复制像素数据
putImageData(ImageData, x, y)
putImageData(ImageData, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) 把图像数据放回画布上
width 返回ImageData对象的宽度
height 返回ImageData对象的高度
data 返回一个对象，包含指定的ImageData对象的图像数据

globalAlpha 设置或返回绘图的当前alpha或透明度
globalCompositeOperation 设置或返回新图像如何绘制到已有的图像上

scale(x, y) 缩放当前绘画
translate(x, y) 重新设置画布上的(0, 0)位置
rotate(angle) 选择当前绘图，单位为“弧度”，角度转弧度公式(degress*Math.PI / 180)
transform(m11, m12, m21, m22, dx, dy)替换绘图的当前转换矩阵
setTransform() 将当前转换重置为单元矩阵，然后运行transform()

save() 保存当前环境状态
restore() 恢复之前保存过的路径状态和属性

getContext('2d') 获取2d对象
toDataURL() 将canvas转换成图片，返回地址
```

## 2. 触摸事件

> touchstart touchmove touchend 触摸事件和鼠标事件最大的区别在于，触摸有可能会在同一时间有多个触摸点，而鼠标永远都是只有一个触摸点

## 3. transform(a, b, c, d, e, f)
> a, d 水平、垂直缩放
> b, c 水平、垂直倾斜
> e, f 水平、垂直位移

## 4. fillStyle
> 线性渐变 Linear Gradient
> *step 1* let grd = context.createLinearGradient(xstart, ystart, xend, yend)
> *step 2* grd.addColorStop(stop, color) stop 关键帧 -> 0~1

注意两点：
1. 当渐变没有覆盖canvas，其余部分按最后stop的渐变显示
2. 当渐变超过canvas，超过部分会被截断

> 径向渐变 Radial Gradient
> *step 1* let grd = context.createRadialGradient(x0, y0, r0, x1, y1, r1)
> *step 2* grd.addColorStop(stop, color)

> 图片填充 createPattern(img, repeat-style) repeat-style: no-repeat repeat-x repeat-y repeat

## 5. font
> 默认值："20px sans-serif"
> context.font = font-style font-variant font-weight font-size font-

- font-style: normal (Default) italic (斜体字) oblique (倾斜字体)

- font-variant: normal (Default) small-caps

- font-weight: lighter normal (Default) bold bolder 

> 100 200 300 400 (normal)
> 500 600 700 (bold)
> 800 900

- font-size: 20px (Defalut)

- font-family: @font-face

## 6. text 对齐
> textAlign: left center right 给定坐标为基准点
> textBaseline: top middle bottom 给定坐标点为基准点 alphabetic (Default) 针对拉丁文 ideographic 针对方块字 hanging 针对印度文

## 7. 文本的度量
> context.measureText(string).width 暂时没有height

## 8. 阴影
> context.shadowColor 颜色

> context.shadowOffsetX x轴偏移
> context.shadowOffsetY y轴偏移

> context.shadowBlur 模糊值

## 9. global 样式
> globalAlpha 不透明度
> globalCompositeOperation = "source-over" (Default) destination-over 前绘制压在后绘制上

- source-over (Default)
- source-atop
- source-in
- source-out

- destination-over
- destination-atop
- destination-in
- destination-out

- lighter 交叉
- copy 复制后一个
- xor 异或

## 10. 剪辑区域
> context.clip() 制造一个剪辑区域，绘制的渲染区域只能在clip内

## 11. 非零环绕
> 图形内部的绘制方向与外部不同，则会认为内部是0，当使用fill填充时，只会填充中间为1的部分，即剪纸效果

## 12. canvasRenderingContext2D 原型对象
> 把自定义的方法挂在到原型上 canvasRenderingContext2D.prototype 

## 13. 绘制图像
> context.drawImage(image, x, y)
> context.drawImage(image, x, y, width, height)
> context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)  将原图像的某个部分渲染到 canvas 中的destination指定位置