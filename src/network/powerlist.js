import {request} from "@/network/request";

export function getPowerList(type) {
    return request({
        method:'get',
        url:'/rights/'+type,
        params:{
            type:type
        }
    })
}

export function getRoleList() {
    return request({
        method:'get',
        url:'roles'
    })
}

//根据用户id请求角色信息
export function lookforRoleInfo(id) {
    return request({
        method:'get',
        url:'/roles/'+id
    })
}

//编辑提交请求
export function editSubmit(id,roleName,roleDesc) {
    return request({
        method:'put',
        url:'/roles/'+id,
        data:{
            roleName,
            roleDesc
        }
    })
}

//添加角色请求
export function addRoleRequest(roleName,roleDesc) {
    return request({
        method:'post',
        url:'/roles',
        data:{
            roleName,
            roleDesc
        }
    })
}

//删除角色请求
export function deleteRoleRequest(id) {
    return request({
        method:'delete',
        url:'/roles/'+id
    })
}

//删除角色指定权限
export function deleteRoleRights(roleId,rightId) {
    return request({
        method:'delete',
        url:'/roles/'+roleId+'/rights/'+rightId
    })
}

//角色授权
export function roleSetRights(roleId,rids) {
    return request({
        method:'post',
        url:'/roles/'+roleId+'/rights',
        data:{
            rids:rids
        }
    })
}