import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Explore from '../views/Explore.vue';
import Profile from '../views/Profile.vue';

const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/explore', name: 'Explore', component: Explore, meta: { requiresAuth: true } },
  { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由拦截器：每次跳转前检查是否登录
router.beforeEach((to, from, next) => {
  // 检查 localStorage 里有没有 token
  const token = localStorage.getItem('token');

  // 如果要去的页面需要登录 (meta.requiresAuth 为 true)
  if (to.meta.requiresAuth) {
    // 1. 如果没有 token，强行跳转去登录页
    if (!token) {
      next('/login');
    } else {
      // 2. 有 token，允许通过
      next();
    }
  } else if (to.path === '/login' && token) {
    // 如果已经登录了，却想去 /login，强行踢回首页
    next('/');
  } else {
    // 其他情况（比如去不需要登录的公开页面）直接放行
    next();
  }
});

export default router;