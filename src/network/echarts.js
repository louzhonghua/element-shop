import {request} from "@/network/request";

//获取折线图数据
export function foldLineChart() {
    return request({
        method:'get',
        url:'reports/type/1'
    })
}