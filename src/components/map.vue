<template>
  <div class="Map">
    <div id="container"></div>
  </div>
</template>

<script setup>
import {onMounted, ref, watch, defineProps, getCurrentInstance, watchEffect, computed} from "vue";
import { useStore } from 'vuex';
import apiServer from "@/components/ApiServer";
// 词云图
const poiId = ref(4011649);
const store = useStore();
// 两店对比
const poiId_1_2 = ref([]);

// 高德地图密钥配置
window._AMapSecurityConfig = {
  securityJsCode: 'ff2f1a40f44f7c8e2b7ccde3204fb113', // 密钥
};

// 高德地图API URL
const url = 'https://webapi.amap.com/maps?v=1.4.15&key=0ea58e23ebdbea8952691f2e3b7ec47a&callback=onLoad';


// 获取后端数据的URL
let props = defineProps({
  map_data:{
    type: String,// 参数类型
    required: true,//是否必传
    default: `${apiServer.apiUrl}/map`,//默认值
  },
})

// 地图查找
const shop_name = computed(()=> store.state.shop_name)

const fetchData =  async () => {
  try {
    // 发起POST请求
    const response = await fetch(props.map_data, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shop_name: shop_name.value,
      }),
    });

    if (!response.ok) {
      throw new Error('网络请求失败');
    }

    // 解析JSON响应
    const data = await response.json();

    // 获取标记点数据
    const markersList = data.data.markers;

    // 更新locations数组
    const locations = markersList.map(marker => ({
      position: marker.position,
      title: marker.value,
      poiId: marker.poiId,
      content: marker.name, // 根据需要自定义内容
    }));

    // 调用初始化地图的函数，并传入更新后的locations数组
    initMap(locations);

  } catch (error) {
    console.error('获取数据时发生错误:', error);
  }
};

const initMap = (locations) => {
  console.log('Initial poiId:', poiId.value);
  // 初始化地图
  let map = new AMap.Map('container', {
    zoom: 11,
    center: [104.741776, 31.492213],
    viewMode: '2D',
  });

  // 使用locations数组创建标注和信息窗体
  locations.forEach(location => {
    const marker = new AMap.Marker({
      position: location.position,
      title: location.title,
      map: map,
    });

    const infoWindow = new AMap.InfoWindow({
      content: location.content,
      offset: new AMap.Pixel(0, -30),
    });

    // 双击-两店对比
    marker.on("dblclick", function (e) {
      // 处理双击事件
      const selectedLocation = {
        position: [e.lnglat.getLng(), e.lnglat.getLat()],
        title: "所选点",
        poiId: poiId.value, // 可以将其设置为现有的 poiId 或生成新的
        content: "所选点", // 根据需要自定义内容
      };

      // 将所选点添加到数组中
      poiId_1_2.value.push(selectedLocation.poiId);
      // 记录所选 poiId
      console.log("所选 poiId_1_2:", poiId_1_2.value);
      // 触发 Vuex Mutation 更新 setPoiId_1_2
      store.commit('setPoiId_1_2', poiId_1_2.value);
    });

    // 单机词云事件
    marker.on('click', function () {
      // 在点击时获取 content
      poiId.value = location.poiId;
      console.log('poiId:', poiId.value);
      // 触发 Vuex Mutation 更新 poiId
      store.commit('setPoiId', poiId.value);
    });

    marker.on('mouseover', function () {
      infoWindow.open(map, marker.getPosition());
    });
    marker.on('mouseout', function () {
      infoWindow.close();
    });
  });
};

// watch 函数用于监视 map_data 的变化
watchEffect(async () => {
  // 处理 map_data 变化的逻辑
  console.log('map_data 变化了：', props.map_data);
  window.onLoad = fetchData();
});


// 在组件挂载时加载高德地图API
onMounted(() => {
  const jsapi = document.createElement('script');
  jsapi.charset = 'utf-8';
  jsapi.src = url;
  // 添加onload事件处理程序
  jsapi.onload = () => {
    // 在地图API加载完成后调用fetchData
    fetchData();
  };

  document.head.appendChild(jsapi);
});

// 导入边框组件
import { BorderBox9 as DvBorderBox9 } from '@kjgl77/datav-vue3';
import { BorderBox10 as DvBorderBox10 } from '@kjgl77/datav-vue3';

</script>

<style scoped>
#container {
  width: 100%;
  height: 60vh;
}

.Map {
  border: 2px solid #3498db;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  padding: 20px;
}

:deep(.amap-logo),
:deep(.amap-copyright) {
  display: none !important;
}
</style>