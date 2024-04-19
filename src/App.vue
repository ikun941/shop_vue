<!--页面-->
<template>
<!--bg-green-50-->
  <div class="h-screen p-5 flex flex-col overflow-hidden body">
    <!-- 中布局 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左布局 -->
      <div class="flex-1 bg-opacity-50 p-3 flex flex-col">
        <!-- 店铺对比 -->
        <div class="flex-1 bg-emerald-50 p-3 rounded-lg border-2 border-blue-500">
          <Left/>
        </div>

        <div class="flex-1 mt-3 p-3 flex flex-col rounded-lg border-2 border-blue-500 bg-emerald-50">
          <!-- 词云图-->
            <word_cloud />
        </div>

      </div>

      <!-- 中布局 -->
      <div class="w-1/2 p-3 flex flex-col">
        <!-- 上布局 -->
        <div class="bg-opacity-50  p-3  flex justify-center items-center">
          <Top/>

        </div>

        <!-- 中下布局 -->
        <div class="flex-1 bg-opacity-50 p-3 mt-2">
          <!-- 地图-->
          <Map  :map_data="mapUrl"/>
        </div>

        <div class="flex-1 bg-emerald-50 p-3 flex justify-center items-center rounded-lg border-2 border-blue-500">
          <div small-bg>
            <dv-decoration6 style="width:100%;height:100%;" />
          </div>
          <input type="text" id="searchInput" class="p-2 border border-gray-400 mr-2" placeholder="输入店铺名字">
          <button @click="search" class="bg-blue-500 text-white p-2 rounded">店铺查找</button>
          <div small-bg>
            <dv-decoration6 style="width:100%;height:100%;" />
          </div>
        </div>

      </div>

      <!-- 右布局 -->
      <div class="flex-1 bg-opacity-50 p-3 flex flex-col">
        <!-- 按钮 -->
        <div class="flex-1 bg-emerald-50 p-3 border-2 border-blue-500 rounded-lg"  flex="~ col" gap7 justify-center items-center bg-dark>
            <dv-button @click="Shop_all" class="custom-button" border="Border5" color="#a6559d" ><h1 class="font">全部店铺</h1></dv-button>
            <dv-button @click="Hot_Shops" class="custom-button" border="Border5" color="#e18a3b"><h1 class="font">热门店铺</h1></dv-button>
            <dv-button @click="brand_shop" class="custom-button" border="Border5" color="#3CB371"><h1 class="font">品牌店铺</h1></dv-button>
            <dv-button @click="comment_shop" class="custom-button" border="Border5" color="#615ea8"><h1 class="font">网红店铺</h1></dv-button>

        </div>

        <div class="flex-1 bg-emerald-50 p-3 flex flex-col border-2 border-blue-500 rounded-lg mt-3">
        <!--  个性化推荐-->
          <Right/>
        </div>

      </div>
    </div>

  </div>

</template>

<!--javascript-->
<script setup>
import {inject, onMounted, ref, watch} from 'vue';
import Top from './components/model/Top.vue';
import Bottom from './components/model/Bottom.vue';
import Left from './components/model/Left.vue';
import word_cloud from "./components/model/word_cloud.vue"
import Right from './components/model/Right.vue';
import Map from "@/components/map.vue";
import * as echarts from "echarts";
import { BorderBox11 as DvBorderBox11 } from '@kjgl77/datav-vue3'
import { BorderBox9 as DvBorderBox9 } from '@kjgl77/datav-vue3'
import {useStore} from "vuex";
import apiServer from "@/components/ApiServer";

let mapUrl = ref(`${apiServer.apiUrl}/map`);

function Hot_Shops() {
  mapUrl.value = `${apiServer.apiUrl}/hot_shop_map`;
}
function Shop_all() {
  mapUrl.value = `${apiServer.apiUrl}/map`;
}
function brand_shop() {
  mapUrl.value = `${apiServer.apiUrl}/brand_shop`;
}
function comment_shop() {
  mapUrl.value = `${apiServer.apiUrl}/comment_shop`;
}


// 地图查找
const store = useStore();
const shop_name = ref()
function search() {
  // 店铺搜索
  shop_name.value = document.getElementById('searchInput').value;
  store.commit("setshop_name", shop_name.value)
  // 接口
  mapUrl.value = `${apiServer.apiUrl}/select_shop`
}

</script>

<!--样式-->
<style scoped>
/* 自定义按钮样式 */
.custom-button {
  color: white;
  padding: 0.7vw 1.1vw; /* 使用vw单位相对于视口宽度 */
  font-size: 0.5vw;
  border: none;
  border-radius: 1vw;
  cursor: pointer;
  margin: 0.2vw; /* 添加一些外边距 */
  text-align: center;
}

/* 鼠标悬停时的样式 */
.custom-button:hover {
  //background-color: #4169e1;

}
.font{
  font-size: 16px;
  text-align: center;
  letter-spacing: 8px;
}

.body {
  background-image: url('./assets/background1.png');
  background-size: cover; /* 使背景图覆盖整个屏幕 */
  background-position: center; /* 图片居中显示 */
  background-repeat: no-repeat; /* 防止背景图重复显示 */
  margin: 0; /* 移除页面默认的 margin，确保背景图填充整个页面 */
  height: 100vh; /* 设置页面高度为视口高度 */
  overflow: hidden; /* 隐藏超出视口范围的内容 */
}

.first{
  height: 80%;
  width: 80%;
  background-color: #4169e1;
}
</style>

