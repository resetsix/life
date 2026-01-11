<template>
  <div class="bulletin-inner-body">
    <div class="inner-title">传送门 🪐</div>

    <!-- 内容切换动画 -->
    <transition name="fade-quick" mode="out-in">
      <div v-if="loading" class="inner-loading">
        <div class="loading-dot"></div>
        <span>正在星际定位...</span>
      </div>

      <div v-else class="inner-content">
        <p class="geo-line">
          欢迎来自
          <span class="highlight-cyan">{{ locationInfo.pos }}</span> 的小伙伴！
        </p>
        <p class="time-line" v-html="timeGreeting"></p>
        <p class="fun-line">
          你距离博主约
          <span class="highlight-cyan">{{ locationInfo.dist }}</span> 公里，{{
            locationInfo.funMsg
          }}
        </p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';

const loading = ref(true);
const timeGreeting = ref('');
const locationInfo = reactive({ pos: '', dist: 0, funMsg: '' });

const OWNER_COORD = { lng: 104.187751, lat: 30.563255 };
const TENCENT_KEY = '4VPBZ-X2SKT-AV3XI-LFSCM-HB6A3-STBT2';

// --- 时间问候语配置 ---
const TIME_GREETINGS = [
  {
    range: [0, 5],
    text: '夜深了，<span>星星都睡了</span>，你怎么还没睡？早点休息，熬夜掉头发哦。',
  },
  {
    range: [5, 9],
    text: '<span>早上好呀！</span> 一日之计在于晨，今天也要元气满满！',
  },
  {
    range: [9, 11],
    text: '<span>上午好！</span> 工作/学习累了就站起来扭扭脖子，别总盯着屏幕。',
  },
  {
    range: [11, 13],
    text: '<span>中午好！</span> 忙碌一上午，该去给大脑和身体“充电”了，干饱饭才能更有动力！',
  },
  {
    range: [13, 15],
    text: '<span>午后好！</span> 适合来一杯冰美式，赶走午后的瞌睡虫。',
  },
  {
    range: [15, 16],
    text: '<span>三点几啦！</span> 喂！饮茶先啦！做咁多都系冇用嘅！',
  },
  {
    range: [16, 19],
    text: '<span>傍晚好！</span> 抬头看看窗外，也许有很美的晚霞。',
  },
  {
    range: [19, 24],
    text: '<span>晚上好！</span> 忙碌了一天，欢迎回到属于你的技术自留地。',
  },
];

/** 匹配当前时间的问候语 */
function getTimeGreeting() {
  const hour = new Date().getHours();
  const greeting = TIME_GREETINGS.find(
    (item) => hour >= item.range[0] && hour < item.range[1]
  );
  return greeting ? greeting.text : '<span>你好！</span> 欢迎来到我的博客。';
}

/** 深度定制地理位置文案 */
function getLocationMessage(info) {
  const { nation, province, city } = info.ad_info;

  if (nation !== '中国') {
    const foreignMessages = {
      日本: 'よろしく，一起去看樱花吗？',
      美国: '跨越太平洋的访问，不容易呀！',
      俄罗斯: '苏卡不列！干了这瓶伏特加！',
      法国: "C'est La Vie，生活莫过于此。",
    };
    return foreignMessages[nation] || `来自 ${nation} 的朋友，跨越重洋辛苦啦！`;
  }

  const cityData = {
    四川省: {
      成都市: '不吃火锅就吃烤匠，巴适得板！',
      绵阳市: '科技之城，马家巷的小吃真的香。',
      自贡市: '恐龙之乡，冷吃兔儿辣得跳！',
      乐山市: '我看你挺有慧根，要不要来碗钵钵鸡？',
      宜宾市: '五粮液的酒香，熏醉了长江头。',
      default: '天府之国，美景美食都在向你招手。',
    },
    重庆市: {
      重庆市: '8D魔幻之都，导航在这里都要哭，火锅还是要吃老火锅！',
      万州区: '想去吃正宗的万州烤鱼了。',
      default: '勒里是重庆，非去不可！',
    },
    湖北省: {
      武汉市: '热干面配上蛋酒，这就是大武汉的早晨。',
      宜昌市: '三峡人家，看一江春水向东流。',
      十堰市: '武当山上，是否还有张三丰的传说？',
      default: '荆楚大地，人杰地灵。',
    },
    甘肃省: {
      兰州市: '牛肉面记得叫“一细”，加肉加蛋才完美。',
      天水市: '麻辣烫替我多加点辣，最近火得一塌糊涂！',
      敦煌市: '大漠孤烟直，莫高窟的飞天在等你。',
      default: '丝绸之路，驼铃阵阵，羌笛无须怨杨柳。',
    },
    云南省: {
      昆明市: '春城无处不飞花，来碗过桥米线吗？',
      大理白族自治州: '苍山雪，洱海月，生活在这里很慢。',
      default: '彩云之南，小心菌子（幻觉）哦！',
    },
    贵州省: {
      贵阳市: '肠旺面和酸汤鱼，贵州人的宝藏美食。',
      安顺市: '黄果树瀑布真的很壮观，湿身了没？',
      default: '山水黔境，多彩贵州。',
    },
  };

  const provinceData = {
    北京市: '北京欢迎你，在故宫的红墙下许个愿吧！',
    上海市: '魔都的节奏快，记得停下来喝杯咖啡。',
    浙江省: '西湖的水，我的泪，今天的风儿甚是喧嚣。',
    湖南省: '臭豆腐配剁椒鱼头，湖南人就是“耐得烦”。',
    山东省: '浩克山东，唯有豪爽与大葱不可辜负。',
    陕西省: '肉夹馍配凉皮，再来瓶冰峰，嘹咋咧！',
    台湾省: '我在这头，大陆在那头，期待相见。',
    default: '带我去你的城市逛逛吧，一定很美！',
  };

  const provMatch = cityData[province];
  if (provMatch) {
    return provMatch[city] || provMatch.default;
  }
  return provinceData[province] || provinceData.default;
}

// --- 基础逻辑函数 ---
function fetchJSONP(url, params) {
  return new Promise((resolve) => {
    const cb = `jsonp_${Date.now()}`;
    const s = document.createElement('script');
    window[cb] = (d) => {
      document.body.removeChild(s);
      delete window[cb];
      resolve(d);
    };
    s.src = `${url}?${new URLSearchParams({ ...params, callback: cb })}`;
    document.body.appendChild(s);
  });
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

onMounted(async () => {
  try {
    timeGreeting.value = getTimeGreeting();
    const res = await fetchJSONP('https://apis.map.qq.com/ws/location/v1/ip', {
      key: TENCENT_KEY,
      output: 'jsonp',
    });
    if (res.status === 0) {
      const { location, ad_info } = res.result;
      locationInfo.pos = ad_info.province
        ? `${ad_info.province}·${ad_info.city}`
        : ad_info.nation;
      locationInfo.dist = getDistance(
        OWNER_COORD.lat,
        OWNER_COORD.lng,
        location.lat,
        location.lng
      );
      locationInfo.funMsg = getLocationMessage(res.result);
    }
  } catch (e) {
    locationInfo.funMsg = '欢迎造访我的精神世界。✨';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.bulletin-inner-body {
  padding: 4px 0;
  color: #fff;
}

.inner-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 16px;
  letter-spacing: 1px;
}

.inner-content {
  font-size: 14px;
  line-height: 1.8;
}

.inner-content p {
  margin: 8px 0;
}

.highlight-cyan {
  color: #60efff;
  font-weight: 600;
  border-bottom: 1px solid rgba(96, 239, 255, 0.4);
}

:deep(span) {
  color: #ff5e98;
  font-weight: 600;
}

.inner-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  color: rgba(255, 255, 255, 0.5);
}

.loading-dot {
  width: 6px;
  height: 6px;
  background: #60efff;
  border-radius: 50%;
  animation: pulse 1s infinite alternate;
}

@keyframes pulse {
  from {
    opacity: 0.3;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1.2);
  }
}

.fade-quick-enter-active,
.fade-quick-leave-active {
  transition: opacity 0.3s;
}
.fade-quick-enter-from,
.fade-quick-leave-to {
  opacity: 0;
}
</style>
