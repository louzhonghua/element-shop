import {request} from "@/network/request";

//分类参数管理 参数列表
export function getParamsList(id,activeName) {
    return request({
        method:'get',
        url:'/categories/'+id+'/attributes',
        params:{
            sel:activeName
        }
    })
}
//添加动态参数或者静态属性
export function addParams(id,name,sel) {
    return request({
        method:'post',
        url:'/categories/'+id+'/attributes',
        data: {
            attr_name:name,
            attr_sel:sel
        }
    })
}
//编辑提交参数
export function editSubmissionParameters(id,attrId,paramsInfo) {
    return request({
        method:'put',
        url:'/categories/'+id+'/attributes/'+attrId,
        data:paramsInfo
    })
}