<template>
  <div class="welcome">
      <el-button type="primary" @click="toCountUp">点击跳转到自动累加器页</el-button>
      <el-button type="primary" @click="toSwiper">点击前往轮播图组件</el-button>
      <count-up :end="2500" :duration="2"></count-up>
      <div style="width: 100px;height: 50px"></div>
      <div class="userData">
        <span>当日数据:<p>{{ singleDayCount }}</p></span>
        <span>新增用户:<p>{{curDayRegister}}</p></span>
        <span>新增订单:<p>{{dayAddOrderCount}}</p></span>
        <span>新增管理员:<p>{{dayAdminCount}}</p></span>
        <span>总数据:<p>{{ allCount }}</p></span>
        <span>注册用户:<p>{{allUserCount}}</p></span>
        <span>订单:<p>{{allOrderCount}}</p></span>
        <span>管理员:<p>{{allOrderCount}}</p></span>
      </div>
      <tendency :sevenDay="sevenDay" :sevenData="sevenData"></tendency>
  </div>
</template>

<script>
import CountUp from "@/components/common/CountUp";
import {singleDayRequest,allAPIRequest,userRegister,
        allUserRegister,dayAddOrderCount,allOrderCount,dayAdminCount
          ,allAdminCount} from '@/network/ele/singleDayRequest'
import {TimeFormat} from '@/ultils/format_date'
import Tendency from "@/components/common/Tendency";
export default {
  name: "Welcome",
  components: {Tendency, CountUp},
  data() {
    return {
      singleDayCount:0,
      allCount:0,
      currentTime:null,
      curDayRegister:0,
      allUserCount:0,
      dayAddOrderCount:0,
      allOrderCount:0,
      dayAdminCount:0,
      allAdminCount:0,
      sevenDay:[],
      sevenData:[]
    }
  },
  created() {
    this._singleDayRequest()
    this._allAPIRequest()
    this.getCurTime()
    this._userRegister()
    this._allUserRegister()
    this._dayAddOrderCount()
    this._allOrderCount()
    this._dayAdminCount()
    this._allAdminCount()
  },
  mounted() {
    this.getSevenData()
  },
  methods:{
    getCurTime() {
      let times = (new Date()).getTime()
      let curDate=TimeFormat(times,'yyyy-MM-dd')
      this.currentTime=curDate
      for (let i=6;i>-1;i--) {
        const date = TimeFormat(((new Date()).getTime()-86400000*i),'yyyy-MM-dd')
        this.sevenDay.push(date)
      }
      console.log(this.sevenDay)
    },
    toCountUp() {
      this.$router.push('/welcome/countUp')
    },
    _singleDayRequest() {
      singleDayRequest(this.currentTime).then(res=>{
        this.singleDayCount=res.count
      })
    },
    //所有的API请求
    _allAPIRequest() {
      allAPIRequest().then(res=>{
        this.allCount=res.count
      })
    },
    //当日注册量
    _userRegister() {
      userRegister(this.currentTime).then(res=>{
        this.curDayRegister = res.count
      })
    },
    //所有用户注册量
    _allUserRegister() {
      allUserRegister().then(res=>{
        this.allUserCount = res.count
      })
    },
    //单日新增订单数
    _dayAddOrderCount() {
      dayAddOrderCount(this.currentTime).then(res=>{
        this.dayAddOrderCount = res.count
      })
    },
    //总的订单数
    _allOrderCount() {
      allOrderCount().then(res=>{
        this.allOrderCount = res.count
      })
    },
    //单日新增管理员数目
    _dayAdminCount() {
      dayAdminCount(this.currentTime).then(res=>{
        this.dayAdminCount = res.count
      })
    },
    //所有管理员数量
    _allAdminCount() {
      allAdminCount().then(res=>{
        if (res.status!==1) return this.$message.error('请求数据失败')
        this.allAdminCount = res.count
      })
    },
    //获取近七天每一天的用户信息
    async getSevenData() {
      //声明一个二维数组用于存放每一天的用户信息
      const apiArr = [[],[],[]]
      this.sevenDay.forEach(item=>{
        apiArr[0].push(userRegister(item))
        apiArr[1].push(dayAddOrderCount(item))
        apiArr[2].push(dayAdminCount(item))
      })
      //将上面的promise放到一个数组里面
      const allArr = [...apiArr[0],...apiArr[1],...apiArr[2]]
      //利用promiseAll发送所有的请求
      Promise.all(allArr).then(res=>{
        //将请求到的数据7个一组进行划分
        const resArr = [[],[],[]]
        res.forEach((item,index)=>{
          if (item.status==1) {
            resArr[Math.floor(index/7)].push(item.count)
          }
        })
        this.sevenData = resArr

      })
    },
    //前往轮播图组件
    toSwiper() {
      this.$router.push('/welcome/swiper')
    }
  }
}
</script>

<style scoped>
  .userData {
    display: flex;
    flex-wrap: wrap;
    padding-left: 50px;
    margin-top: -40px;
  }
  .userData span {
    display: inline-block;
    width: 200px;
    border: 1px solid #E5E9F2;
    padding: 10px 10px;
    border-radius: 6px;
    margin: 10px 10px;
    background-color: #E5E9F2;
  }
  .userData span p {
    font-size: 20px;
    font-weight: bold;
  }
  span:nth-child(1) {
    font-size: 22px;
    color: #F5F5F5;
    background-color: #FF9800;
    border: 1px solid #FF9800;
  }
  span:nth-child(5) {
    font-size: 22px;
    color: #F5F5F5;
    background-color: #20A0FF;
    border: 1px solid #20A0FF;
  }
  #main {
    padding-top: 20px;
  }

</style>