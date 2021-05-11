import axios from 'axios'
import NProgress from 'nprogress'


export function requestEle(config) {
    // 1.创建axios的实例
    const instance = axios.create({
        baseURL: 'https://elm.cangdu.org',
        // baseURL:'http://timemeetyou.com:8889/api/private/v1',
        timeout: 5000

    })

    // 2.axios的拦截器
    // 2.1.请求拦截的作用
    instance.interceptors.request.use(config => {
        NProgress.start()
        return config
    }, err => {
        console.log(err);
    })

    // 2.2.响应拦截
    instance.interceptors.response.use(res => {
        NProgress.done()
        return res.data
    }, err => {
        console.log(err);
    })

    // 3.发送真正的网络请求
    return instance(config)
}
