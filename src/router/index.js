import Vue from "vue";
import VueRouter from "vue-router";

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// 路由懒加载
const Login = () => import("views/Login.vue")
const Home = () => import("views/home/Home.vue")
const Welcome = () => import("views/home/Welcome.vue")
const UserList = () => import("views/user/UserList.vue")
const ClassList = () => import("views/class/ClassList.vue")
const ImageList = () => import("views/image/ImageList.vue")
const HealthfromList = () => import("views/healthfrom/HealthfromList.vue")
const HealthView = () => import("views/healthView/HealthView.vue")
const Readlist = () => import("views/readlist/Readlist.vue")
const ListDetail = () => import("views/listDetail/ListDetail.vue")
const AdminUser = () => import("views/adminUser/AdminUser.vue")

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  {
    path: "/home",
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/userList', component: UserList },
      { path: '/classList', component: ClassList },
      { path: '/imageList', component: ImageList },
      { path: '/healthfromList', component: HealthfromList },
      { path: '/healthView', component: HealthView },
      { path: '/readlist', component: Readlist },
      { path: '/listDetail', component: ListDetail },
      { path: '/adminUser', component: AdminUser },
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// 挂载路由导航守卫（ 防跳墙功能 ）
router.beforeEach((to, from, next) => {
  // 如果要访问登录页面就直接放行
  if (to.path === '/login') return next()
  // 否则获取 sessionStorage 中token值进行判断
  const token = window.sessionStorage.getItem('token')
  // 如果没有 token 值表示没有登录，就强制跳转到login页面
  if (!token) return next('/login')
  // 否则就是有 token 值，直接放行
  next()
})

export default router;
