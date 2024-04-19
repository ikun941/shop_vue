<template>
  <div class="bottom-section">
    <h1 class="">下布局</h1>
    {{shop_name}}
<!--    <p>{{ responseData.data }}</p>-->
  </div>
</template>

<script setup>
import {computed} from "vue";
import {useStore} from "vuex";

const apiBaseUrl = 'http://127.0.0.1:5000';
const store = useStore();
const shop_name = computed(()=> store.state.shop_name)

// import axios from 'axios';
//
// export default {
//   data() {
//     return {
//       responseData: {},
//     };
//   },
//
//   mounted() {
//     // 发起后端请求
//     axios.get('http://47.115.210.52:5000/test')
//         .then(response => {
//           // 请求成功时更新组件数据
//           this.responseData = response.data;
//         })
//         .catch(error => {
//           // 处理请求失败的情况
//           console.error('Error fetching data:', error);
//         });
//   },
// };
</script>
