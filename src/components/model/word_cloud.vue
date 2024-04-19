<template>
  <div small-bg style="display: flex;align-items: center;justify-content: center;">
    <dv-decoration7 style="width:350px;height:30px; ">
      <div color-white font-300>
        <h1 class="ziti">{{ shop_name }}</h1>
      </div>
    </dv-decoration7>
  </div>

  <div v-if="loading" ref="wordcloudRef" class="loader "></div>
  <div v-else ref="wordcloudRef" class="wordcloud mt-2"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import { useStore } from 'vuex';
import { BorderBox10 as DvBorderBox10 } from '@kjgl77/datav-vue3'
import apiServer from "@/components/ApiServer";

const store = useStore();
const poiId = computed(() => store.state.poiId);
const wordcloudRef = ref();
const loading = ref(false);
const shop_name = ref()
const fetchData = async () => {
  console.log("poiId.value",poiId.value)
  try {
    loading.value=true;
    const response = await axios.post(`${apiServer.apiUrl}/word_cloud`, {
      poiId: poiId.value,
    });
    loading.value=false;
    const data = response.data.data;
    shop_name.value = response.data.shop_name;
    console.log('name:', response.data.shop_name);
    console.log('词云图数据:', data);
    setTimeout(() => {
      initWordCloud(data);
    }, 1000);
  } catch (error) {
    console.error('获取数据时出错:', error.message);
    console.error('错误详情:', error);
  }
};

const initWordCloud = (data: any, max = 72) => {
  const myChart = echarts.init(wordcloudRef.value);
  const option = {
    title: {
      text: '关键词',
      show: false,
    },
    tooltip: {},
    series: [
      {
        type: 'wordCloud',
        shape: 'circle',
        left: 'center',
        top: 'center',
        width: '75%',
        height: '60%',
        right: null,
        bottom: null,
        sizeRange: [14, max],
        rotationRange: [-45, 45],
        rotationStep: 15,
        gridSize: 12,
        drawOutOfBound: false,
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          color: function () {
            return 'rgb(' + [
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160),
            ].join(',') + ')';
          },
          emphasis: {
            shadowBlur: 2,
            shadowColor: '#333',
          },
        },
        data: data,
      },
    ],
  };

  option && myChart.setOption(option);
  window.addEventListener('resize', () => {
    if (myChart) {
      myChart.resize();
    }
  });
};

// 监听 poiId 的变化，变化时触发 fetchData
watch(poiId, fetchData, { immediate: true });


</script>

<style lang="scss" scoped>
.wordcloud {
  //background-color: dodgerblue;
  background-color: white;
  border-radius: 9999px;
  width: 100%;
  height: 100%;
}
.ziti{
  font-weight: bold;
  font-size: 15px;
  text-align: center;
}
.loader {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: auto;
  margin-top: 50px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
