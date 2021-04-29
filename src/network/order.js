import {request} from "@/network/request";

//获取订单信息
export function getOrder() {
    return request({
        method:'get',
        url:'/kuaidi/1106975712662'
    })
}