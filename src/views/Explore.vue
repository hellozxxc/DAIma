<template>
    <div class="explore-container">
      <div class="explore-header">
        <h1>🔥 本地探索发现</h1>
        <p class="subtitle">发现你所在城市的宝藏网红地</p>
      </div>
  
      <el-tabs v-model="activeTab" style="margin-top: 30px;" @tab-click="fetchRecommendations">
        <el-tab-pane label="网红打卡点" name="hotspots" />
        <el-tab-pane label="美食探店" name="food" />
        <el-tab-pane label="历史人文" name="culture" />
      </el-tabs>
  
      <div v-loading="loading" class="card-grid">
        <el-card v-for="item in currentList" :key="item.id" shadow="hover" class="explore-card">
          <div class="card-img-box" :style="{ backgroundColor: item.color }">
            <span class="card-emoji">{{ item.icon }}</span>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ item.name }}</h3>
            <p class="card-desc">{{ item.desc }}</p>
            <div class="card-footer">
              <span class="card-tag">{{ item.tag }}</span>
            </div>
          </div>
        </el-card>
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
  import { ref, reactive, onMounted } from 'vue';
  
  const activeTab = ref('hotspots');
  const loading = ref(false);
  const currentList = ref([]);
  
  // 模拟本地推荐数据（实际项目中可接入地图API或AI推荐接口）
  const mockData = {
    hotspots: [
      { id: 1, icon: '📷', color: '#e6f2ff', name: '长安十二时辰主题街区', desc: '一秒穿越回唐朝，沉浸式唐风市井生活体验地。', tag: '热门影视IP' },
      { id: 2, icon: '✨', color: '#fef0f0', name: '赛格购物中心喷泉', desc: '拥有亚洲最长跨度的室内瀑布，夜晚灯光秀极其出片。', tag: '城市新地标' },
      { id: 3, icon: '🏰', color: '#f0f9eb', name: '大明宫国家遗址公园', desc: '唐帝国的辉煌缩影，适合拍摄大广角的复古大片。', tag: '古风摄影' }
    ],
    food: [
      { id: 1, icon: '🥘', color: '#fdf6ec', name: '小南门夜市', desc: '本地人最爱的深夜食堂，甑糕、油茶麻花、卤汁凉粉。', tag: '地道烟火气' },
      { id: 2, icon: '🍜', color: '#e6f2ff', name: '定家小酥肉', desc: '回民街老字号，绵软的粉蒸肉配米饭，解腻的酸梅汤是灵魂。', tag: '百年老店' },
      { id: 3, icon: '🥢', color: '#fef0f0', name: '惠记粉汤羊血', desc: '重口味爱好者的天堂，麻酱与辣子的完美结合。', tag: '重口必吃' }
    ],
    culture: [
      { id: 1, icon: '📜', color: '#f4f4f5', name: '西安碑林博物馆', desc: '石头上的图书馆，历代书法大家的真迹汇聚于此。', tag: '国宝级文物' },
      { id: 2, icon: '🕌', color: '#fdf6ec', name: '化觉巷清真寺', desc: '中式园林与伊斯兰教建筑的完美融合，闹市中的净土。', tag: '建筑瑰宝' },
      { id: 3, icon: '🍵', color: '#f0f9eb', name: '易俗社文化街区', desc: '百年秦腔戏楼，感受关中大地上最原汁原味的戏曲文化。', tag: '非遗传承' }
    ]
  };
  
  const fetchRecommendations = () => {
    loading.value = true;
    currentList.value = [];
    setTimeout(() => {
      currentList.value = mockData[activeTab.value] || [];
      loading.value = false;
    }, 500); // 模拟网络请求延迟
  };
  
  onMounted(fetchRecommendations);
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
  .explore-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  
  .explore-header {
    text-align: center;
    margin-bottom: 40px;
  }
  
  .explore-header h1 {
    font-size: 32px;
    color: #1a1a1a;
    margin: 0;
  }
  
  .subtitle {
    color: #666;
    margin-top: 10px;
    font-size: 16px;
  }
  
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
    margin-top: 30px;
  }
  
  .explore-card {
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid #ebeef5;
  }
  
  .explore-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.08);
  }
  
  .card-img-box {
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 64px;
  }
  
  .card-content {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .card-title {
    font-size: 18px;
    color: #303133;
    margin: 0 0 8px 0;
    font-weight: 600;
  }
  
  .card-desc {
    font-size: 14px;
    color: #606266;
    line-height: 1.6;
    margin: 0 0 20px 0;
    flex: 1;
  }
  
  .card-footer {
    display: flex;
    justify-content: flex-end;
  }
  
  .card-tag {
    background-color: #ecf5ff;
    color: #409eff;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
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