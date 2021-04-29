import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const Login   = ()=>import('@/views/Login')
const Home    = ()=>import('@/views/Home')
const Welcome = ()=>import('@/views/Welcome')
const UserList= ()=>import('@/components/content/user/UserList')
const PowerList=()=>import('@/views/PowerList')
const PowerRoleList=()=>import('@/views/PowerRoleList')
const Goods_cate=()=>import('@/views/goods/Goods_cate')
const CateParams=()=>import('@/views/goods/CateParams')
const GoodsList =()=>import('@/views/goods/GoodsList')
const GoodsAddPage=()=>import('@/views/goods/GoodsAddPage')
const Order       =()=>import('@/views/order/Order')

const routes = [
  {
    path: '',
    redirect:'/login'
  },
  {
    path:'/login',
    component:Login
  },
  {
    path: '/home',
    component:Home,
    redirect: '/welcome',
    children:[
      {
        path:'/welcome',
        component:Welcome
      },
      {
        path: '/users',
        component:UserList
      },
      {
        path: '/rights',
        component:PowerList
      },
      {
        path: '/roles',
        component:PowerRoleList
      },
      {
        path: '/categories',
        component:Goods_cate
      },
      {
        path: '/params',
        component:CateParams
      },
      {
        path:'/goods',
        component:GoodsList
      },
      {
        path: '/goods/add',
        component:GoodsAddPage
      },
      {
        path:'/orders',
        component:Order
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode:'history'
})

router.beforeEach((to, from, next) => {
  if (to.path==='/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login')
  next()
})

export default router
