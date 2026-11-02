<template>
    <div class="login-container">
      <div class="login-card">
        <h1>🚀 大学生 AI 行程规划助手</h1>
        <p class="subtitle">登录后开始定制你的专属旅程！</p>
        <el-form :model="form" label-position="top" style="margin-top: 30px;">
          <el-form-item label="用户名">
            <el-input v-model="form.username" placeholder="请输入用户名" size="large" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password size="large" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" :loading="loading" @click="handleLogin" style="width: 100%;">
              {{ loading ? '登录中...' : '登 录' }}
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="large" @click="handleRegister" style="width: 100%;">注册新账号</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  
  const router = useRouter()
  const loading = ref(false)
  const form = reactive({ username: '', password: '' })
  
 // 找到你 Login.vue 里的 handleLogin 函数，修改成功后的回调：

const handleLogin = async () => {
  // ...前面的校验代码...
  try {
    const res = await axios.post('http://127.0.0.1:5000/api/auth/login', {
      username: form.username,
      password: form.password
    });

    if (res.data.code === 200) {
      // ==========================================
      // 🚀 关键：登录成功后，保存 Token 到浏览器缓存
      // ==========================================
      localStorage.setItem('token', res.data.data.token);
      
      ElMessage.success('登录成功，正在跳转...');
      router.push('/'); // 登录成功后，强制跳转到首页
    } else {
      ElMessage.error(res.data.msg || '登录失败');
    }
  } catch (error) {
    ElMessage.error('网络请求失败，请检查后端服务');
  }
};
  
  const handleRegister = async () => {
    if (!form.username || !form.password) return ElMessage.warning('请输入用户名和密码')
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/auth/register', form)
      if (res.data.code === 200) {
        ElMessage.success('注册成功，请直接登录')
      } else {
        ElMessage.error(res.data.msg || '注册失败')
      }
    } catch (error) {
      ElMessage.error('网络错误，请检查后端服务')
    }
  }
  </script>
  
  <style scoped>
  .login-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  .login-card {
    background: #fff;
    border-radius: 16px;
    padding: 40px;
    max-width: 420px;
    width: 100%;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
  h1 { text-align: center; font-size: 24px; color: #1a1a1a; margin-bottom: 5px; }
  .subtitle { text-align: center; color: #666; margin-bottom: 30px; font-size: 14px; }
  </style>