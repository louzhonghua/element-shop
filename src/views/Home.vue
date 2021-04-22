<template>
  <div class="home">
    <el-container class="section">
      <el-header class="header">
        <div>
          <span>首页</span>
        </div>
        <el-button type="info" @click="exitLogin">退出</el-button>
      </el-header>
      <el-container class="container">

        <el-aside :width="_widthSet" class="aside">
          <div class="toggle-button" @click="_collapse">| | |</div>
          <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#20A0FF"
              :unique-opened="true"
              :collapse="isCollapse"
              :collapse-transition="false"
              :router="true"
              :default-active="activePath">
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i :class="menuObj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
                            @click="saveActiveState('/'+subItem.path)">
                <template slot="title">
                  <i class="iconfont icon-user"></i>
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>

          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
import {getMenuList} from '@/network/login'

import Header from "@/components/common/Header";
export default {
  name: "Home",
  components:{
    Header
  },
  data() {
    return {
      menuList:[],
      menuObj:{
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-lock_fill',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse:false,
      activePath:''
    }
  },
  computed:{
    _widthSet() {
      return this.isCollapse ? '64px' : '200px'
    }
  },
  created() {
    this._getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath')

  },
  mounted() {
  },
  methods:{
    exitLogin() {
      window.sessionStorage.clear();
      this.$router.push('/login')
    },
    async _getMenuList() {
       await getMenuList().then(res=>{
        if (res.meta.status!==200) return this.$message.error('请求数据失败')
        this.menuList = res.data;
      })
    },
    _collapse() {
       this.isCollapse = !this.isCollapse
    },
    _getNavActive() {

    },
    saveActiveState(state) {
      window.sessionStorage.setItem('activePath',state)
      this.activePath = state;
    }
  }
}
</script>

<style scoped>
.section ,.home {
  height: 100%;
}
.header {
  background-color: #EFF2F7;
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  align-items: center;
}
.aside {
  background-color: #48566A;
}
.container {
  background-color: #F6F4EC;
}
.iconfont {
  padding-right: 20px;
}
.el-menu {
  border-right: none;
}
.toggle-button {
  background-color: gainsboro;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
</style>