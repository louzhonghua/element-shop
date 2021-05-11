import {request} from "@/network/request";

//添加商品网络请求
export function addGoods(goodsInfo) {
    return request({
        method:'post',
        url:'/goods',
        data:goodsInfo
    })
}