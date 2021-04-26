import {request} from "@/network/request";

//商品分类数据列表
export function goodsCateDataList(queryInfo) {
    return request({
        method:'get',
        url:'/categories',
        params:queryInfo
    })
}
//添加分类
export function addCate(requestParams) {
    return request({
        method:'post',
        url:'/categories',
        data:requestParams,
    })
}