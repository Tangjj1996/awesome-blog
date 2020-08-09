# Viewport

## meta标签

> <meta name='viewport' content="width=device-width,initial-scale=1,user-scalable=no">

- px 逻辑像素
- dp 设备像素、物理像素
- ppi 屏幕每英寸像素数量
- dpr 设备像素所方比 dpr = (dp ^ 2) / px
- iphone5: 4英寸，1136 * 640， 分辨率320*568px如何计算出来的？

||ldpr|mdpr|hdpr|xdpr|
|---|---|---|---|---|---|---|---|
|ppi|120|160|240|320|
|默认缩放比|0.75|1.0|1.5|2.0|

ppi计算公式，(dp^2+dp^2)开方除以4英寸

根据dpr=dp/px，得出iphone5分辨率