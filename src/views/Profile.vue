<template>
    <div class="profile-container">
      <!-- 头部用户信息 -->
      <div class="header">
        <div class="avatar">
          <span>👤</span>
        </div>
        <h2>我的行程管家</h2>
        <p class="user-name">用户名：{{ username }}</p>
      </div>
     
      <!-- 功能菜单区 -->
      <div class="content">
        <h3>📌 个人中心</h3>
        
        <div class="menu-list">
          <!-- 新增：我的行程 -->
          <div class="menu-item" @click="goToPage('/my-trips')">
            <div class="item-left">
              <span class="icon">🎒</span>
              <span class="item-text">我的行程</span>
            </div>
            <span class="item-arrow">&gt;</span>
          </div>
  
          <!-- 新增：我的收藏 -->
          <div class="menu-item" @click="goToPage('/favorites')">
            <div class="item-left">
              <span class="icon">❤️</span>
              <span class="item-text">我的收藏</span>
            </div>
            <span class="item-arrow">&gt;</span>
          </div>
  
          <!-- 新增：设置 -->
          <div class="menu-item" @click="goToPage('/settings')">
            <div class="item-left">
              <span class="icon">⚙️</span>
              <span class="item-text">系统设置</span>
            </div>
            <span class="item-arrow">&gt;</span>
          </div>
  
          <!-- 原有的：退出登录 -->
          <div class="menu-item logout-item" @click="handleLogout">
            <div class="item-left">
              <span class="icon">🚪</span>
              <span class="item-text">退出登录</span>
            </div>
            <span class="item-arrow">&gt;</span>
          </div>
        </div>
      </div>
  
      <!-- 底部固定导航栏 (保持不变) -->
      <div class="bottom-tabbar">
        <div 
          class="tab-item" 
          v-for="tab in tabBarConfig" 
          :key="tab.path"
          :class="{ active: $route.path === tab.path }"
          @click="handleTabClick(tab.path)"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </div>
      </div>
    </div>
  </template>
    
  <script setup>
  import { ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { ElMessage } from 'element-plus'; // 引入提示框
    
  const router = useRouter();
  const route = useRoute();
    
  // 获取用户名
  const username = ref(localStorage.getItem('username') || '111');
    
  // 底部导航栏配置
  const tabBarConfig = [
    { path: '/', icon: '🗺️', label: '行程规划' },
    { path: '/explore', icon: '🔥', label: '发现本地' },
    { path: '/profile', icon: '👤', label: '我的' }
  ];
    
  // 点击跳转处理
  const handleTabClick = (path) => {
    if (route.path !== path) {
      router.push(path);
    }
  };
  
  // 🚀 新增：普通菜单跳转占位符
  const goToPage = (path) => {
    ElMessage.info('该功能正在开发中...');
    // 如果以后做好了，把上面那行删掉，换成 router.push(path) 即可
  };
    
  // 🚀 完善：退出登录函数
  const handleLogout = () => {
    // 1. 清除缓存
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    
    // 2. 提示并跳转
    ElMessage.success('已安全退出登录');
    router.replace('/login');
  };
  </script>
    
  <style scoped>
  /* 容器布局 */
  .profile-container {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
    padding-bottom: 90px; /* 防止被底部导航遮挡 */
    background-color: #f7f8fa; /* 给背景加个浅灰色，更有层次感 */
    min-height: 100vh;
  }
  
  /* 头部样式 */
  .header {
    text-align: center;
    margin-bottom: 30px;
    padding-top: 20px;
  }
  .avatar {
    width: 80px;
    height: 80px;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    margin: 0 auto 15px;
    border: 2px solid #409EFF;
    box-shadow: 0 4px 10px rgba(64, 158, 255, 0.2);
  }
  .user-name {
    color: #666;
    font-size: 14px;
    margin-top: 5px;
  }
  h2 {
    margin: 0;
    font-size: 20px;
    color: #333;
  }
  
  /* 内容卡片样式 */
  .content {
    background: white;
    border-radius: 16px;
    padding: 10px 20px; /* 调整内边距 */
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  .content h3 {
    font-size: 16px;
    color: #333;
    margin: 15px 0;
    padding-left: 5px;
  }
  
  /* 菜单列表样式 */
  .menu-list {
    display: flex;
    flex-direction: column;
  }
  
  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #f5f5f5;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .menu-item:last-child {
    border-bottom: none;
  }
  
  .menu-item:active {
    opacity: 0.7; /* 点击时的反馈效果 */
  }
  
  .item-left {
    display: flex;
    align-items: center;
  }
  
  .icon {
    margin-right: 12px;
    font-size: 18px;
  }
  
  .item-text {
    color: #333;
    font-size: 15px;
  }
  
  .item-arrow {
    color: #ccc;
    font-weight: bold;
    font-size: 14px;
  }
  
  /* 退出登录特殊样式 */
  .logout-item .item-text {
    color: #ff4d4f; /* 红色文字提醒 */
  }
  .logout-item .icon {
    filter: grayscale(100%); /* 让图标稍微灰一点 */
  }
  
  /* 底部导航栏样式 (保持不变) */
  .bottom-tabbar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    z-index: 1000;
  }
  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    color: #999;
    transition: all 0.3s;
    flex: 1;
  }
  .tab-item.active {
    color: #409EFF;
  }
  .tab-icon {
    font-size: 22px;
    margin-bottom: 2px;
  }
  .tab-label {
    font-size: 11px;
  }
  </style>