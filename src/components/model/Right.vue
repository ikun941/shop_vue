<template>
  <div>
    <div class="right-section">
      <!-- Your right section content goes here -->

      <h1 class="font">个性化推荐</h1>
      <div class="center-container">
        <dv-decoration5 :dur="2" style="width:300px;height:40px;" />
      </div>
      <!-- <p>{{ responseData.data }}</p> -->
      <label for="recommendationType" class="selet">店铺类型：</label>
      <select v-model="selectedType" id="recommendationType" class="select-field">
        <option value="火锅">火锅</option>
        <option value="烧烤">烧烤</option>
        <option value="鱼">烤鱼</option>
        <option value="鸡">烧鸡</option>
        <option value="鸭">烧鸭</option>
        <option value="羊">羊肉</option>
        <option value="牛">牛肉</option>
        <option value="兔">烤兔</option>
        <option value="虾">海鲜</option>
        <option value="汤锅">汤锅</option>
        <option value="咖啡">咖啡</option>
        <option value="蛋糕">蛋糕</option>
        <option value="中餐">中餐</option>
        <option value="汉堡">汉堡</option>
        <option value="串串">串串</option>
        <!-- 根据需要添加更多选项 -->
      </select>
    </div>
    <!-- 区间输入部分 -->

    <div class="range-inputs">
      <!-- 起始值输入框 -->
      <label>消费：</label>
      <input v-model="startValue" type="number" class="input-field" style="width: 60px;" />
      <!-- 结束值输入框 -->

      <label>消费：</label>
      <input v-model="endValue" type="number" class="input-field" style="width: 60px;" />
      <!-- 提交按钮 -->
      <button @click="submitRange" class="submit-button">提交</button>

    </div>

    <div class="">
      <!-- ECharts 线图容器 -->
      <div ref="chart_Pie" style="width: 100%; height: 300px;"></div>
    </div>

    <!-- 用于切换店铺的按钮 -->
    <div class="shop-buttons">
      <button @click="switchShop(1)" class="shop-button"><h1 class="font1">价格</h1></button>
      <button @click="switchShop(2)" class="shop-button">得分</button>
      <button @click="switchShop(3)" class="shop-button">星级</button>
      <button @click="switchShop(4)" class="shop-button">评论</button>
    </div>

  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import {useStore} from "vuex";
import apiServer from "@/components/ApiServer";

// 定义用于选择类型、起始值和结束值的响应式变量
const selectedType = ref("火锅");
const startValue = ref(20);
const endValue = ref(70);

// 处理提交按钮点击的函数
const currentShop = ref(1); // 用于跟踪当前显示的店铺
// 切换店铺的函数
const switchShop = (shopNumber) => {
  // 更新当前店铺编号
  currentShop.value = shopNumber;
  updateChart(cost_suggest_data.value)
};

// 使用新数据更新ECharts图表的函数
const updateChart = (data) => {
  // 修改此部分以根据新数据更新图表
  // ...
  console.log("data:",data)
  console.log("currentShop:",currentShop.value)
  // 例如：更新所选店铺的饼图数据
  const chart_pie = echarts.init(chart_Pie.value);

  chart_pie.setOption({
    // ...（根据新数据更新图表选项）
    title: {
      text: data[6][currentShop.value-1],
      left: 'center',
      top: 20,
      textStyle: {
        color: 'black'
      }
    },
    backgroundColor: '#ecfdf5',
    tooltip: {
      trigger: 'item'
    },
    visualMap: {
      show: false,
      min: 80,
      max: 600,
      inRange: {
        colorLightness: [0, 1]
      }
    },

    series: [
      {
        data: [
          { value: data[currentShop.value][0], name: data[0][0], itemStyle: { color: '#CD5C5C' }},
          { value: data[currentShop.value][1], name: data[0][1], itemStyle: { color: '#FF6A6A' }},
          { value: data[currentShop.value][2], name: data[0][2], itemStyle: { color: '#FF8888' }},
          { value: data[currentShop.value][3], name: data[0][3], itemStyle: { color: '#B22222' }},
        ].sort(function (a, b) {
          return a.value - b.value;
        }),
        roseType: 'radius',
        label: {
          color: 'black'
        },
        labelLine: {
          lineStyle: {
            color: 'black'
          },
          smooth: 0.2,
          length: 10,
          length2: 20
        },
        itemStyle: {
          color: '#c23531',
          shadowBlur: 200,
          shadowColor: 'rgba(0, 0, 0, 0)'
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      }
    ]
  });
};

const cost_suggest_data = ref(null) // 推荐店铺数据

const submitRange = async () => {
  // 将选择的类型、起始值和结束值输出到控制台
  console.log("选择的类型：", selectedType.value);
  console.log("起始值：", startValue.value);
  console.log("结束值：", endValue.value);

  try {
    const response = await axios.post(`${apiServer.apiUrl}/cost_suggest`, {
      shop_type: selectedType.value,
      start:startValue.value,
      end:endValue.value
    });
    const data = response.data.data
    cost_suggest_data.value = data
    console.log("cost_suggest_data:",cost_suggest_data.value)

    // 图数据修改
    const chartDom2 = chart_Pie.value;
    const chart_pie = echarts.init(chartDom2)

    // 使用里面的配置项和数据显示图表。
    chart_pie.setOption({
      backgroundColor: '#ecfdf5',
      title: {
        text: 'avgPrice',
        left: 'center',
        top: 20,
        textStyle: {
          color: 'black'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
          colorLightness: [0, 1]
        }
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: [
            { value: data[1][0], name: data[0][0] , itemStyle: { color: '#CD5C5C' }},
            { value: data[1][1], name: data[0][1] , itemStyle: { color: '#FF6A6A' }},
            { value: data[1][2], name: data[0][2] , itemStyle: { color: '#FF8888' }},
            { value: data[1][3], name: data[0][3] , itemStyle: { color: '#B22222' }},
          ].sort(function (a, b) {
            return a.value - b.value;
          }),
          roseType: 'radius',
          label: {
            color: 'black'
          },
          labelLine: {
            lineStyle: {
              color: 'black'
            },
            smooth: 0.2,
            length: 10,
            length2: 20
          },
          itemStyle: {
            color: '#c23531',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0)'
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }
      ]

    });

  } catch (error) {
    console.error('获取数据时出错:', error.message);
    console.error('错误详情:', error);
  }

  // 根据需要在此处添加基于所选值的进一步处理逻辑
};


const chart_Pie = ref(null);
onMounted(async ()=>{

  const chartDom2 = chart_Pie.value;
  const chart_pie = echarts.init(chartDom2)

  // 使用里面的配置项和数据显示图表。
  chart_pie.setOption({
    backgroundColor: '#ecfdf5',
    title: {
      text: 'avgPrice',
      left: 'center',
      top: 20,
      textStyle: {
        color: 'black'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    visualMap: {
      show: false,
      min: 80,
      max: 600,
      inRange: {
        colorLightness: [0, 1]
      }
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        data: [
          { value: 335, name: 'shop1' },
          { value: 310, name: 'shop2' },
          { value: 274, name: 'shop3' },
          { value: 235, name: 'shop4'},
        ].sort(function (a, b) {
          return a.value - b.value;
        }),
        roseType: 'radius',
        label: {
          color: 'black'
        },
        labelLine: {
          lineStyle: {
            color: 'black'
          },
          smooth: 0.2,
          length: 10,
          length2: 10
        },
        itemStyle: {
          color: '#c23531',
          shadowBlur: 200,
          shadowColor: 'rgba(0, 0, 0, 0)'
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      }
    ]

  });

});


</script>

<style scoped>
.pagination {
  margin-top: 10px;
}

.pagination button {
  margin-right: 5px;
  background-color: #ddd;
  padding: 5px 10px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.pagination button:hover {
  background-color: #bbb;
}

/* 区间输入样式 */
.range-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px; /* 上方添加一些间距 */
}

/* 输入框样式 */
.input-field {
  width: 60px;
  padding: 3px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* 提交按钮样式 */
.submit-button {
  background-color: rgba(76, 76, 208, 0.81); /* 设置背景颜色为绿色 */
  border: none; /* 移除边框 */
  color: white; /* 设置文本颜色为白色 */
  padding: 5px 10px; /* 设置内边距 */
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 15px;
  cursor: pointer;
  border-radius: 5px; /* 设置边框圆角 */
}
/* 提交按钮悬停样式 */
.submit-button:hover {
  background-color: #4169e1;
}
/* 下拉表单样式 */
.select-field {
  width: 80px;
  padding: 2px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
/* 个性化推荐部分样式 */
.right-section {
  /* 样式内容可以根据需要自行添加 */
}

/* shop-buttons 样式 */
.shop-buttons {
  display: flex;
  justify-content: center;
  //margin-top: 20px;
}

.shop-button {
  background-color: #FFA500; /* 设置背景颜色为蓝色 */
  color: white; /* 设置文本颜色为白色 */
  padding: 5px 10px; /* 设置内边距 */
  border: none; /* 移除边框 */
  margin: 0 10px; /* 设置外边距 */
  cursor: pointer;
  border-radius: 5px; /* 设置边框圆角 */
}

.shop-button:hover {
  background-color: #3c3c9d; /* 鼠标悬停时的颜色变化 */
}

.font{
  font-size: 18px;
  text-align: center;
  font-weight: bold;
}
.font1{
  font-size: 15px;
  text-align: center;
  font-weight: bold;
}

.selet{
  font-size: 15px;
}
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
