import axios from 'axios'

export function request(config) {
    // 1.创建axios的实例
    const instance = axios.create({
        baseURL: 'http://106.53.73.30:8888/api/private/v1',
        // baseURL:'http://timemeetyou.com:8889/api/private/v1',
        timeout: 50000

    })

    // 2.axios的拦截器
    // 2.1.请求拦截的作用
    instance.interceptors.request.use(config => {
        config.headers.Authorization = window.sessionStorage.getItem('token');

        return config
    }, err => {
        // console.log(err);
    })

    // 2.2.响应拦截
    instance.interceptors.response.use(res => {
        return res.data
    }, err => {
        console.log(err);
    })

    // 3.发送真正的网络请求
    return instance(config)
}
