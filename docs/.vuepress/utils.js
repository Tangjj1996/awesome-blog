const path = require('path')
const fs = require('fs')

const sidebarMap = require('./sidebarMap.js')

exports.interSiderbars = () => {
    const sidebar = {}
    sidebarMap.forEach(( { title, link } ) => {
        const dirpath = path.resolve(__dirname, '../' + link)
        const parent = `/${link}/`
        const children = fs
            .readdirSync(dirpath)
            .filter(item => 
                item.endsWith('.md') && fs.statSync(path.join(dirpath, item)).isFile()
            )
            .sort((prev, next) =>  { return next.includes('README.md') ? 1 : 0})
            .map(item => item.replace(/(README)?(.md)$/i, ''))

        sidebar[parent] = [
            {
                title,
                children,
                collapsable: false
            }
        ]
    })
    return sidebar
}