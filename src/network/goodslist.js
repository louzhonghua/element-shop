import {request} from "@/network/request";

//商品列表数据
export function getGoodsList(paramsInfo) {
    return request({
        method:'get',
        url:'/goods',
        params:paramsInfo
    })
}
//删除商品
export function deleteGoods(id) {
    return request({
        method:'delete',
        url:'/goods/'+id
    })
}
//编辑提交商品
export function editSubmitGoods(id,editInfo) {
    return request({
        method:'put',
        url:'/goods/'+id,
        data:editInfo
    })
}