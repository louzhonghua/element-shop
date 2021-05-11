import {requestEle} from "@/network/request-ele";

//获取某日API请求量
export function singleDayRequest(date) {
    return requestEle({
        method:'get',
        url:'/statis/api/'+date+'/count'
    })
}
//获取所有API请求量
export function allAPIRequest() {
    return requestEle({
        method:'get',
        url:'/statis/api/count'
    })
}
//某日新增用户
export function userRegister(date) {
    return requestEle({
        method:'get',
        url:'/statis/user/'+date+'/count'
    })
}
//所有用户注册量
export function allUserRegister() {
    return requestEle({
        method:'get',
        url:'/v1/users/count'
    })
}
//新增订单数
export function dayAddOrderCount(date) {
    return requestEle({
        method:'get',
        url:'statis/order/'+date+'/count'
    })
}
//总的订单数
export function allOrderCount() {
    return requestEle({
        method:'get',
        url:'/bos/orders/count'
    })
}
//某天管理员注册量
export function dayAdminCount(date) {
    return requestEle({
        method:'get',
        url:'/statis/admin/'+date+'/count'
    })
}
//获取管理员数量
export function allAdminCount() {
    return requestEle({
        method:'get',
        url:'/admin/count'
    })
}