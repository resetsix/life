<template>
  <div class="plume-bulletin-item interactive">
    <div class="bulletin-title">公告牌 🍭</div>
    <div class="bulletin-content" v-html="welcomeMessage"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import $ from "jquery";

const welcomeMessage = ref("请稍候...");
const ownerLng = 104.187751;
const ownerLat = 30.563255;

function fetchLocation() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "get",
      url: "https://apis.map.qq.com/ws/location/v1/ip",
      data: { key: "4VPBZ-X2SKT-AV3XI-LFSCM-HB6A3-STBT2", output: "jsonp" },
      dataType: "jsonp",
      success: resolve,
      error: reject,
    });
  });
}

function getDistance(lng1, lat1, lng2, lat2) {
  const R = 6371;
  const { sin, cos, asin, PI, hypot } = Math;
  const getPoint = (lng, lat) => {
    lng *= PI / 180;
    lat *= PI / 180;
    return { x: cos(lat) * cos(lng), y: cos(lat) * sin(lng), z: sin(lat) };
  };
  const a = getPoint(lng1, lat1);
  const b = getPoint(lng2, lat2);
  const c = hypot(a.x - b.x, a.y - b.y, a.z - b.z);
  return Math.round(asin(c / 2) * 2 * R);
}

function getTimeGreeting() {
  const hour = new Date().getHours();
  const greetings = {
    morning: "<span>上午好</span>，一日之计在于晨！",
    noon: "<span>中午好</span>，该摸鱼吃午饭啦！",
    afternoon: "<span>下午好</span>，懒懒地睡个午觉吧！",
    tea: "<span>三点几啦</span>，一起饮茶呀！",
    evening: "<span>傍晚好</span>，夕阳无限好！",
    night: "<span>晚上好</span>，夜生活嗨起来！",
    late: "夜深了，早点休息少熬夜。",
  };
  if (hour >= 5 && hour < 11) return greetings.morning;
  if (hour >= 11 && hour < 13) return greetings.noon;
  if (hour >= 13 && hour < 15) return greetings.afternoon;
  if (hour >= 15 && hour < 16) return greetings.tea;
  if (hour >= 16 && hour < 19) return greetings.evening;
  if (hour >= 19 && hour < 24) return greetings.night;
  return greetings.late;
}

function getLocationMessage(info) {
  const { nation, province, city } = info.ad_info;

  if (nation !== "中国") {
    const foreignMessages = {
      日本: "よろしく，一起去看樱花吗？",
      美国: "Let us live in peace!",
      英国: "想同你一起夜乘伦敦眼。",
      俄罗斯: "干了这瓶伏特加！",
      法国: "C'est La Vie.",
      德国: "Die Zeit verging im Fluge.",
      澳大利亚: "一起去大堡礁吧！",
      加拿大: "拾起一片枫叶赠予你。",
    };
    return foreignMessages[nation] || "带我去你的国家逛逛吧！";
  }

  const cityMessages = {
    江苏省: {
      南京市: "这是我挺想去的城市啦。",
      苏州市: "上有天堂，下有苏杭。",
      default: "散装是必须要散装的。",
    },
    河南省: {
      郑州市: "豫州之域，天地之中。",
      南阳市: "臣本布衣，躬耕于南阳。此南阳非彼南阳！",
      驻马店市: "峰峰有奇石，石石挟仙气。嵖岈山的花很美哦！",
      开封市: "刚正不阿包青天。",
      洛阳市: "洛阳牡丹甲天下。",
      default: "可否带我品尝河南烩面啦？",
    },
    四川省: {
      成都市: "不吃火锅就吃烤匠。",
      绵阳市: "不看秋景就错过了绵阳。",
      自贡市: "恋上恐龙就来自贡。",
      泸州市: "泸州老窖喝不喝嘛。",
      德阳市: "德阳瓜子一口停不下来。",
      广元市: "广元豆腐鲜香可口。",
      遂宁市: "遂宁蒸菜回味无穷。",
      内江市: "内江豆花细腻入味。",
      乐山市: "乐山大佛震撼心灵。",
      宜宾市: "宜宾竹编工艺精湛。",
      南充市: "南充糖蒜甜脆可口。",
      达州市: "达州竹笋清香爽口。",
      雅安市: "雅安牛肉面鲜香美味。",
      阿坝藏族羌族自治州: "阿坝藏羌文化神秘迷人。",
      甘孜藏族自治州: "甘孜藏寨原生态风情。",
      凉山彝族自治州: "525喝不喝嘛。",
      default: "可否带我品尝四川火锅啦？",
    },
    甘肃省: {
      兰州市: "吃牛肉面喝甜胚子。",
      嘉峪关市: "长城雄关嘉峪天下。",
      金昌市: "金昌金山璀璨夺目。",
      白银市: "白银古镇历史悠久。",
      定西市: "浪漫的定西。",
      酒泉市: "吃牛肉面喝甜胚子。",
      天水市: "麻辣烫吃不喽。",
      武威市: "沙漠奇观天梯山石窟！",
      张掖市: "七彩丹霞马蹄寺前！",
      平凉市: "崆峒问道腔山滴翠！",
      庆阳市: "董志塬上香包飘香！",
      陇南市: "官鹅沟里宕昌古梯田！",
      临夏回族自治州: "太子山下花儿飞扬！",
      甘南藏族自治州: "拉卜楞寺郎木寺畔！",
      default: "羌笛何须怨杨柳，春风不度玉门关。",
    },
  };

  if (cityMessages[province]) {
    return cityMessages[province][city] || cityMessages[province].default;
  }

  const provinceMessages = {
    北京市: "北——京——欢迎你~~~",
    天津市: "讲段相声吧。",
    河北省: "山势巍巍成壁垒，天下雄关。铁马金戈由此向，无限江山。",
    山西省: "展开坐具长三尺，已占山河五百余。",
    内蒙古自治区: "天苍苍，野茫茫，风吹草低见牛羊。",
    辽宁省: "我想吃烤鸡架！",
    吉林省: "状元阁就是东北烧烤之王。",
    黑龙江省: "很喜欢哈尔滨大剧院。",
    上海市: "众所周知，中国只有两个城市。",
    浙江省: "东风渐绿西湖柳，雁已还人未南归。",
    安徽省: "蚌埠住了，芜湖起飞。",
    福建省: "井邑白云间，岩城远带山。",
    江西省: "落霞与孤鹜齐飞，秋水共长天一色。",
    山东省: "遥望齐州九点烟，一泓海水杯中泻。",
    湖北省: "来碗热干面！",
    湖南省: "74751，长沙斯塔克。",
    广东省: "老板来两斤福建人。",
    广西壮族自治区: "桂林山水甲天下。",
    海南省: "朝观日出逐白浪，夕看云起收霞光。",
    贵州省: "茅台，学生，再塞200。",
    云南省: "玉龙飞舞云缠绕，万仞冰川直耸天。",
    西藏自治区: "躺在茫茫草原上，仰望蓝天。",
    陕西省: "来份臊子面加馍。",
    青海省: "牛肉干和老酸奶都好好吃。",
    宁夏回族自治区: "大漠孤烟直，长河落日圆。",
    新疆维吾尔自治区: "驼铃古道丝绸路，胡马犹闻唐汉风。",
    台湾省: "我在这头，大陆在那头。",
    香港特别行政区: "永定贼有残留地鬼嚎，迎击光非岁玉。",
    澳门特别行政区: "性感荷官，在线发牌。",
    default: "带我去你的城市逛逛吧！",
  };

  return provinceMessages[province] || provinceMessages.default;
}

async function initialize() {
  try {
    const res = await fetchLocation();
    if (res.status !== 0) throw new Error(res.message);
    const info = res.result;
    const dist = getDistance(
      ownerLng,
      ownerLat,
      info.location.lng,
      info.location.lat
    );
    const pos = info.ad_info.province
      ? `${info.ad_info.province} ${info.ad_info.city} ${info.ad_info.district}`.trim()
      : info.ad_info.nation;
    const locationDesc = getLocationMessage(info);
    const timeGreeting = getTimeGreeting();

    welcomeMessage.value = `<b>欢迎来自 <span class="highlight">${pos}</span> 的小伙伴！<br/> ${timeGreeting} 您现在距离博主约 <span class="highlight">${dist}</span> 公里，${locationDesc}</b>`;
  } catch (error) {
    console.error("获取位置信息失败:", error);
    welcomeMessage.value = "哎呀，网络开小差了，但依然热烈欢迎您的到来！";
  }
}

onMounted(initialize);
</script>

<style scoped>
.plume-bulletin-item {
  position: relative;
  padding-inline: 8px;
  padding-block: 4px;
  background-color: transparent;
  font-size: 15px;
  line-height: 1.7;
}

.bulletin-title {
  padding-block: 6px;
  font-weight: 500;
  font-size: large;
  margin-bottom: 4px;
}

.bulletin-content {
  color: var(--vp-c-text-1);
}

.bulletin-content :deep(.highlight) {
  color: var(--theme-color, #3eaf7c);
  font-weight: 600;
}

.bulletin-content :deep(span) {
  color: var(--theme-color, #3eaf7c);
}

@media (max-width: 768px) {
  .plume-bulletin-item {
    font-size: 14px;
    padding: 10px;
  }
}
</style>