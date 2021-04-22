import {request} from "@/network/request";

export function getUserList(query,page,size) {
    return request({
        method:'get',
        url:'/users',
        params:{
            query: query,
            pagenum: page,
            pagesize: size
        }
    })
}

export function userState(userinfo) {
    return request({
        method:'put',
        url:`users/${userinfo.id}/state/${userinfo.mg_state}`,
        // params:{
        //     uId:userinfo.id,
        //     type:userinfo.mg_state
        // }
    })
}

export function addUserRequest(username,password,email,mobile) {
    return request({
        method:'post',
        url:'/users',
        data:{
            username:username,
            password:password,
            email:email,
            mobile:mobile
        }
    })
}
export function getUserId(id) {
    return request({
        method:'get',
        url:'/users/'+id,
    })
}

export function editUserInfo(id,email,mobile) {
    return request({
        method:'put',
        url:'/users/'+id,
        data:{
            email:email,
            mobile:mobile
        }
    })
}

//删除用户
export function deleteUser(id) {
    return request({
        method:'delete',
        url:'/users/'+id
    })
}

//分配用户角色
export function distributeUserRole(id,rid) {
    return request({
        method:'put',
        url:'/users/'+id+'/role',
        data:{
            rid
        }
    })
}