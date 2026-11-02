<template>
    <div class="main-container">
      <div class="page-card">
        <h1>🚀 大学生AI行程规划助手</h1>
        <p class="subtitle">输入你的需求，一键生成完美的穷游/旅行计划！</p>
  
        <!-- 输入区域 -->
        <el-form :model="form" label-position="top" style="margin-top: 30px;">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="目的地">
                <el-input v-model="form.destination" placeholder="例如：西安、大理" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="天数">
                <el-input-number v-model="form.days" :min="1" :max="30" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="总预算 (元)">
                <el-input-number v-model="form.budget" :min="0" :step="100" size="large" />
              </el-form-item>
            </el-col>
          </el-row>
  
          <el-form-item label="你的偏好 (可多选)">
            <el-checkbox-group v-model="form.preferences">
              <el-checkbox value="自然风光">自然风光</el-checkbox>
              <el-checkbox value="历史人文">历史人文</el-checkbox>
              <el-checkbox value="地道美食">地道美食</el-checkbox>
              <el-checkbox value="网红拍照">网红拍照</el-checkbox>
              <el-checkbox value="极限穷游">极限穷游</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
  
          <el-form-item>
            <el-button type="primary" size="large" :loading="loading" @click="handleGenerate" style="width: 100%;">
              {{ loading ? 'AI正在全力规划中...' : '👇 点击生成专属行程' }}
            </el-button>
          </el-form-item>
        </el-form>
  
        <!-- 结果展示区域 -->
        <div v-if="result && result.schedule" class="result-box">
          <el-divider content-position="left">✨ 您的智能行程规划结果</el-divider>
  
          <div class="plan-header">
            <h3>📍 {{ result.destination }} {{ result.days }}天深度游计划</h3>
            <p>💰 预估总预算：{{ result.total_budget }} 元 (日均 {{ result.daily_budget }} 元)</p>
          </div>
  
          <el-timeline style="margin-top: 30px;">
            <el-timeline-item
              v-for="(day, index) in result.schedule"
              :key="index"
              :timestamp="'第 ' + day.day + ' 天'"
            >
              <el-card shadow="hover">
                <!-- 1. 交通与地图导航 -->
                <div class="card-section" style="border-bottom: 1px dashed #dcdfe6; padding-bottom: 15px; margin-bottom: 15px;">
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <p style="font-weight: bold; font-size: 16px; color: #409EFF;">🚗 智能交通指南</p>
                    <a
                      :href="navUrl(day)"
                      target="_blank"
                      rel="noopener"
                      class="nav-btn"
                    >
                      🗺️ 一键导航去景点
                    </a>
                  </div>
                  <p style="margin-top: 8px; font-size: 14px; color: #606266;">
                    推荐方式：{{ day.transport?.route || '暂无推荐' }} | 预计花费：{{ day.transport?.cost || '—' }}
                  </p>
                </div>
  
                <!-- 2. 上午活动 -->
                <div class="card-section">
                  <p style="font-weight: bold;">🌅 {{ day.morning?.time || '上午' }}</p>
                  <p style="margin: 8px 0; color: #303133;">活动安排：<strong>{{ day.morning?.activity || '—' }}</strong></p>
                  <p style="color: #67C23A; font-size: 13px;">📸 摄影建议：{{ day.morning?.photo_tip || '—' }}</p>
                  <p style="color: #E6A23C; font-size: 13px; margin-top: 5px;">👥 人流预测：{{ day.morning?.crowd || '—' }}</p>
                </div>
  
                <!-- 3. 下午活动 -->
                <div class="card-section" style="margin-top: 15px;">
                  <p style="font-weight: bold;">☀️ {{ day.afternoon?.time || '下午' }}</p>
                  <p style="margin: 8px 0; color: #303133;">活动安排：<strong>{{ day.afternoon?.activity || '—' }}</strong></p>
                  <p style="color: #67C23A; font-size: 13px;">📸 摄影建议：{{ day.afternoon?.photo_tip || '—' }}</p>
                  <p style="color: #E6A23C; font-size: 13px; margin-top: 5px;">👥 人流预测：{{ day.afternoon?.crowd || '—' }}</p>
                </div>
  
                <!-- 4. 晚上活动 -->
                <div class="card-section" style="margin-top: 15px;">
                  <p style="font-weight: bold;">🌙 {{ day.evening?.time || '晚上' }}</p>
                  <p style="margin: 8px 0; color: #303133;">活动安排：<strong>{{ day.evening?.activity || '—' }}</strong></p>
                  <p style="color: #E6A23C; font-size: 13px; margin-top: 5px;">👥 人流预测：{{ day.evening?.crowd || '—' }}</p>
                </div>
  
                <!-- 5. 住宿与美食推荐 -->
                <div class="card-section" style="margin-top: 20px; background-color: #f4f4f5; padding: 15px; border-radius: 8px;">
                  <p><strong>🏨 住宿推荐：</strong>{{ day.accommodation || '—' }}</p>
                  <p style="margin-top: 8px;"><strong>🍜 必吃美食：</strong>{{ day.food || '—' }}</p>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          <!-- ========================================== -->
<!-- 一键打卡区域 -->
<!-- ========================================== -->
<div class="check-in-box" style="margin-top: 30px; text-align: center;">
  <button @click="handleCheckIn" :disabled="isCheckingIn" class="check-in-btn">
    {{ isCheckingIn ? '📍 正在定位...' : '📍 我到了！打卡获取周边推荐' }}
  </button>
  <p v-if="errorMsg" class="error-tip">{{ errorMsg }}</p>
</div>

<!-- 推荐结果卡片 -->
<div v-if="recommendation" class="recommend-card">
  <el-divider content-position="left">🎯 当前位置推荐</el-divider>
  <el-card shadow="hover">
    <h3 style="color: #409EFF; margin-bottom: 15px;">📍 {{ recommendation.city }}</h3>
    
    <div class="rec-item">
      <span class="rec-label">🍜 美食推荐</span>
      <span class="rec-value">{{ recommendation.food }}</span>
    </div>
    <div class="rec-item">
      <span class="rec-label">🏛️ 景点推荐</span>
      <span class="rec-value">{{ recommendation.spots }}</span>
    </div>
    <div class="rec-item">
      <span class="rec-label">📖 历史人文</span>
      <span class="rec-value">{{ recommendation.history }}</span>
    </div>
  </el-card>
</div>
        </div>
      </div>
    </div>
    <!-- 底部固定导航栏 -->
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
  </template>
  
  <script setup>
  import { reactive, ref } from 'vue';
  import axios from 'axios';
  import { ElMessage } from 'element-plus';
  
  // 后端地址：优先读取环境变量，回退到本地
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000';
  
  // 表单数据
  const form = reactive({
    destination: '',
    days: 3,
    budget: 1500,
    preferences: []
  });
  
  const loading = ref(false);
  const result = ref(null);
  // 打卡相关状态
const isCheckingIn = ref(false);
const errorMsg = ref('');
const recommendation = ref(null);

// 一键打卡获取推荐
const handleCheckIn = async () => {
  errorMsg.value = '';
  recommendation.value = null;

  if (!navigator.geolocation) {
    errorMsg.value = '您的浏览器不支持定位功能，请使用 Chrome 或 Edge 浏览器。';
    return;
  }

  isCheckingIn.value = true;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      console.log('获取到位置:', latitude, longitude);

      try {
        const res = await axios.post(`${API_BASE}/api/plan/checkin`, {
          lat: latitude,
          lng: longitude
        });

        if (res.data.code === 200) {
          recommendation.value = res.data.data;
          ElMessage.success('打卡成功！已为你生成周边推荐');
        } else {
          errorMsg.value = res.data.msg;
        }
      } catch (error) {
        console.error(error);
        errorMsg.value = '获取推荐失败，请检查网络或后端服务。';
      } finally {
        isCheckingIn.value = false;
      }
    },
    () => {
      errorMsg.value = '定位失败，请在浏览器中允许使用位置权限。';
      isCheckingIn.value = false;
    }
  );
};
  
  // 生成高德搜索链接（目的地 + 上午活动，安全编码）
  const navUrl = (day) => {
    const keyword = `${result.value?.destination || ''} ${day.morning?.activity || ''}`.trim();
    return `https://uri.amap.com/search?keyword=${encodeURIComponent(keyword)}`;
  };
  
  // 调用后端接口
  const handleGenerate = async () => {
    if (!form.destination) {
      ElMessage.warning('请先输入一个目的地哦！');
      return;
    }
  
    loading.value = true;
    try {
      const res = await axios.post(`${API_BASE}/api/plan/generate`, form);
      if (res.data.code === 200) {
        result.value = res.data.data;
        ElMessage.success('行程规划成功！');
      } else {
        ElMessage.error(res.data.message || '生成失败，请稍后重试');
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        ElMessage.error(`请求失败（${error.response.status}），请检查后端服务`);
      } else {
        ElMessage.error('生成失败，请确保后端程序正在运行！');
      }
    } finally {
      loading.value = false;
    }
  };
  import { useRouter, useRoute } from 'vue-router';

const router = useRouter();

// 定义底部导航栏的路由和图标
const tabBarConfig = [
  { path: '/', icon: '🗺️', label: '行程规划' },
  { path: '/explore', icon: '🔥', label: '发现本地' },
  { path: '/profile', icon: '👤', label: '我的' }
];

// 导航跳转函数
const handleTabClick = (path) => {
  router.push(path);
};
  </script>
  
  <style scoped>
  .main-container {
    display: flex;
    justify-content: center;
    align-items: flex-start; /* 长结果不再被垂直居中裁切 */
    min-height: 100vh;
    background-color: #f0f2f5;
    padding: 20px;
  }
  
  .page-card {
    background: white;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    max-width: 800px;
    width: 100%;
    margin: 20px 0;
  }
  
  .nav-btn {
    display: inline-block;
    padding: 6px 14px;
    background-color: #e6f2ff;
    color: #409eff;
    border: 1px solid #b3d8ff;
    border-radius: 4px;
    text-decoration: none;
    font-size: 13px;
    transition: all 0.3s;
  }
  .nav-btn:hover {
    background-color: #409eff;
    color: #fff;
  }
  
  .plan-header {
    margin-bottom: 20px;
  }
  .plan-header p {
    color: #666;
    margin-top: 10px;
  }
  
  h1 {
    text-align: center;
    color: #1a1a1a;
    margin-bottom: 5px;
  }
  .subtitle {
    text-align: center;
    color: #666;
    margin-bottom: 30px;
  }
  
  .result-box {
    animation: fadeIn 0.5s;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .check-in-btn {
  padding: 14px 40px;
  font-size: 16px;
  background: linear-gradient(135deg, #ff6600, #ff8800);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(255, 102, 0, 0.3);
}
.check-in-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 102, 0, 0.4);
}
.check-in-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
.error-tip {
  margin-top: 10px;
  color: #f56c6c;
  font-size: 14px;
}
.recommend-card {
  margin-top: 20px;
  animation: fadeIn 0.5s;
}
.rec-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  padding: 10px;
  background-color: #f9fafc;
  border-radius: 6px;
}
.rec-item:last-child {
  margin-bottom: 0;
}
.rec-label {
  font-weight: bold;
  color: #606266;
  min-width: 100px;
  font-size: 14px;
}
.rec-value {
  color: #303133;
  font-size: 14px;
  flex: 1;
}
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
}

.tab-item.active {
  color: #409EFF;
}

.tab-icon {
  font-size: 20px;
  margin-bottom: 2px;
}

.tab-label {
  font-size: 10px;
}

  </style>