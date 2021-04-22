import {request} from "@/network/request";


export function adminLogin(username,password){
    return request(
        {
            method:'post',
            url: '/login',
            params: {username,password}
        }
    )
}

export function getMenuList() {
    return request({
        method:'get',
        url:'/menus',

    })
}