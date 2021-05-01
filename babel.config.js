//项目发布阶段需要使用的babel插件
const prodPlugins =[]
if (process.env.NODE_ENV === 'production') {
    prodPlugins.push('transform-remove-console')
}



module.exports={
    presets: ['@vue/app'],
    plugins: [
        [
            'component',
            {

            }
        ],
        ...prodPlugins,
        "@babel/plugin-syntax-dynamic-import"
    ]
}