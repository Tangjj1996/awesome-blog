const utils = require('./utils')

module.exports = {
    // 基础配置
    title: "唐吉的进击课堂",
    description: "做一个合格的技术人",
    base: '/',
    head: [
        [
            'link',
            {
                rel: 'icon',
                href: '/avatar.ico'
            }
        ]
    ],

    // 主题配置
    themeConfig: {
        // 顶部导航
        nav: [
            { text: '首页', link: '/' },
            { text: "技术", link: '/technology/' },
            { text: "blog", link: '/blog/' },
            { text: "成长", link: '/growth/' },
            { text: "心情", link: '/journal/' },
        ],
        // 侧边栏
        sidebar: utils.interSiderbars(),

        repo: 'Tangjj1996/awesome-blog',
        // 侧边栏提取深度
        sidebarDepth: 3,
        // 最近更新
        lastUpdated: 'Last Updated',
        // 编辑此页
        editLinkText: '在 GitHub 上编辑此页',
    },

    // webpack 配置
    configureWebpack: {
        resolve: {
            alias: {
                "@pubilc": "./pubilc"
            }
        }
    }
}