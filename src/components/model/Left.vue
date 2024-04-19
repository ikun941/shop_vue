<template>
  <!-- 添加按钮 -->
  <div class="container">
    <!-- 其他内容 -->
    <div class="button-container" gap8 justify-center items-center bg-dark>
      <dv-button :bg="false" @click="methods.clearPoiId()" >清空店铺</dv-button>
    </div>
  </div>
<!--  <button @click="methods.clearPoiId()" class="button">清空</button>-->

  <!-- 雷达图容器 -->
  <div class="radar-chart-container" style="width: 100%; height: 50%;">
    <div ref="chart1" style="width: 100%; height: 100%;"></div>
  </div>

  <!-- 柱状图容器 -->
  <div ref="chart2" style="width: 100%; height: 50%;"></div>
</template>

<script setup >
import * as echarts from 'echarts';
import {onMounted, ref, watch, watchEffect} from 'vue';
import { useStore } from "vuex";
import { computed } from "vue";
import axios from "axios";
import apiServer from "@/components/ApiServer";

// 创建 ref 保存 DOM 元素
const chart1 = ref(null);
const chart2 = ref(null);

const store = useStore();
const poiId_1_2 = computed(() => store.state.poiId_1_2);
let lastTwoValues;

// 监听 lastTwoValues 的变化
watchEffect(async () => {
  // 检查是否为数组并且非空
  if (Array.isArray(poiId_1_2.value) && poiId_1_2.value.length > 0) {
    // 获取数组中最后两个值
    lastTwoValues = poiId_1_2.value.slice(-2);
    console.log("lastTwoValues", lastTwoValues);

    try {
      const response = await axios.post(`${apiServer.apiUrl}/compare_shop`, {
        poiId_1_2: lastTwoValues,
      });

      const data1 = response.data.data.leida;
      console.log('雷达图数据:', data1);

      const data2 = response.data.data.bar;
      console.log('柱状图数据:', data2);

      const chartDom1 = chart1.value;
      const chartInstance1 = echarts.init(chartDom1);
      chartInstance1.setOption({ // 雷达
        legend: {
          left: 'left', // 靠左放
          top: methods.calculateFontSize(20), // 调整图例在垂直方向的位置
          data: [data1[0].name, data1[1].name],
          textStyle: {
            fontSize: methods.calculateFontSize(10), // 根据界面大小动态计算字体大小
            color: 'black',
          }
        },
        series: [
          {
            data: [
              { value: data1[0].value, name: data1[0].name},// data1[0].name
              { value: data1[1].value, name: data1[1].name}//data1[1].name
            ],
          },
        ],
      });

      const chartDom2 = chart2.value;
      const chartInstance2 = echarts.init(chartDom2);
      chartInstance2.setOption({ // 柱状
        legend: {
          left: 'left', // 靠左放
          top: methods.calculateFontSize(20), // 调整图例在垂直方向的位置
          data: [data2[0].name, data2[1].name],
          textStyle: {
            fontSize: methods.calculateFontSize(10), // 根据界面大小动态计算字体大小
            color: 'black',
          }
        },
        series: [
          {
            name: data2[0].name,//data2[0].name
            type: 'bar',
            //stack: '总量',
            data: data2[0].value
          },
          {
            name: data2[1].name,//data2[1].name
            type: 'bar',
            //stack: '总量',
            data: data2[1].value
          }
        ]
      })

    } catch (error) {
      console.error('获取数据时出错:', error.message);
      console.error('错误详情:', error);
    }

  } else {
    // 数组为空或不是数组时的处理逻辑
    lastTwoValues = [];
    console.log("lastTwoValues:", "空")
  }
});


// 定义方法
const methods = {
  // 根据界面大小动态计算字体大小的函数
  calculateFontSize(baseSize) {
    const screenWidth = window.innerWidth || document.documentElement.clientWidth;
    return (baseSize * screenWidth) / 1920; // 1920 是设计稿的宽度
  },

  // 清空 poiId_1_2 数组的方法
  clearPoiId() {
    while (poiId_1_2.value.length > 0) {
      poiId_1_2.value.pop();
    }
    // 重置图表
    const chartDom1 = chart1.value;
    const chartInstance1 = echarts.init(chartDom1);
    chartInstance1.setOption({ // 雷达
      legend: {
        left: 'left', // 靠左放
        top: methods.calculateFontSize(20), // 调整图例在垂直方向的位置
        data: ["店铺A", "店铺B"],
        textStyle: {
          fontSize: methods.calculateFontSize(10), // 根据界面大小动态计算字体大小
          color: 'black',
        }
      },
      series: [
        {
          data: [
            { value: [0,0,0,0], name: "店铺A"},// data1[0].name
            { value: [0,0,0,0], name: "店铺B"}//data1[1].name
          ],
        },
      ],
    });

    const chartDom2 = chart2.value;
    const chartInstance2 = echarts.init(chartDom2);
    chartInstance2.setOption({ // 柱状
      legend: {
        left: 'left', // 靠左放
        top: methods.calculateFontSize(20), // 调整图例在垂直方向的位置
        data: ["店铺A", "店铺B"],
        textStyle: {
          fontSize: methods.calculateFontSize(10), // 根据界面大小动态计算字体大小
          color: 'black',
        }
      },
      series: [
        {
          name: "店铺A",//data2[0].name
          type: 'bar',
          //stack: '总量',
          data: [0,0,0,0]
        },
        {
          name: "店铺B",//data2[1].name
          type: 'bar',
          //stack: '总量',
          data: [0,0,0,0]
        }
      ]
    })
  }
};

// dom 已经挂载的钩子函数
onMounted(() => {
  // 雷达图
  const chartDom1 = chart1.value;
  const chartInstance1 = echarts.init(chartDom1);

  // 使用里面的配置项和数据显示图表。
  chartInstance1.setOption({
    legend: {
      left: 'left', // 靠左放
      top: methods.calculateFontSize(20), // 调整图例在垂直方向的位置
      data: ['店铺A', '店铺B'],
      textStyle: {
        fontSize: methods.calculateFontSize(10), // 根据界面大小动态计算字体大小
        color: 'black',
      }
    },
    radar: {
      radius: '70%', // 将雷达图的半径设置为原来的50%
      indicator: [
        { name: '平均消费', max: 150 },
        { name: '平均得分(5分)', max: 5 },
        { name: '星级(50)', max: 100 },
        { name: '评论', max: 1000 },
      ]
    },
    series: [
      {
        name: '预算 vs 实际开销',
        type: 'radar',
        data: [
          { value: [0, 0, 0, 0], name: '店铺A' },
          { value: [0, 0, 0, 0], name: '店铺B' }
        ]
      }
    ]
  });

  // 柱状图
  const chartDom2 = chart2.value;
  const chartInstance2 = echarts.init(chartDom2);
  chartInstance2.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      left: 'left', // 靠左放
      top: methods.calculateFontSize(20), // 调整图例在垂直方向的位置
      data: ['店铺A', '店铺B'],
      textStyle: {
        fontSize: methods.calculateFontSize(10), // 根据界面大小动态计算字体大小
        color: 'black',
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.05]
    },
    yAxis: {
      type: 'category',
      data: ['平均消费', '平均得分(5分)', '星级(50)', '评论']
    },
    series: [
      {
        name: '店铺A',
        type: 'bar',
        //stack: '总量',
        data: [0, 0, 0, 0]
      },
      {
        name: '店铺B',
        type: 'bar',
        //stack: '总量',
        data: [0, 0, 0, 0]
      }
    ]
  });
});
</script>

<style scoped>
.radar-chart-container {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

.container {
  position: relative;
  /* 添加其他样式属性 */
}

.button-container {
  position: absolute;
  top: 10px; /* 距离顶部的距离 */
  right: 10px; /* 距离右侧的距离 */
  bottom: 10px;
  z-index: 999;
}



</style>