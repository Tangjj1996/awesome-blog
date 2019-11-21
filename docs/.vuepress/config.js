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
            { text: "技术", link: '/technology/mysql' },
            { text: "blog", link: '/blog/vueSkill' },
            { text: "成长", link: '/growth/thinkMore' },
            { text: "心情", link: '/journal/happyDay' },
        ],
        // 侧边栏
        sidebar: {
            '/technology/': [
                {
                    title: '文档',
                    collapsable: false,
                    children: [
                        ['/technology/mysql', 'mysql简单介绍']
                    ]
                }
            ],
            '/blog/': [
                {
                    title: '博客',
                    collapsable: false,
                    children: [
                        ['/blog/vueSkill', 'VUE开发技巧'],
                        ['/blog/promise', '手写一个Promise'],
                        ['/blog/permission', '前端权限校验的四种常见用法']
                    ]
                }
            ],
            '/growth/': [
                {
                    title: '成长路上',
                    collapsable: false,
                    children: [
                        ['/growth/thinkMore', '😄']
                    ]
                }
            ],
            '/journal/': [
                {
                    title: '日志',
                    collapsable: false,
                    children: [
                        ['/journal/happyDay', '😀']
                    ]
                }
            ]
        },
        // 侧边栏提取深度
        sidebarDepth: 2,
        // 最近更新
        lastUpdated: 'Last Updated'
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