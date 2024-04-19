<!--页面-->
<template>
  <!--  引用主件-->
  <HelloWorld :data="n"/>

  <h1>num:{{ num }}</h1>
  <h1>obj:{{obj}}</h1>
  <h1>str:{{str}}</h1>

  <!--  点击事件 -->
  <button @click="click">click</button>
</template>

<!--javascript-->
<script setup>
import {computed, reactive, ref, watch} from "vue";
// 导入主件
import HelloWorld from "@/components/HelloWorld.vue";

// 相应式变量
let n = 999;
let num = ref(0); // 任意数据类型
let obj = reactive({
  name: "ikun",
  age: "18"
})

// 名字为click的函数, 让num的相应式变量的值增加
function click(){
  num.value++;
  obj.age++;
  str.value = "8";
}

// 计算属性
let str = computed({
  set(val){
    num.value = val
  },
  get(){
    console.log("111", 111);
    return num.value;
  }
})

// 监听器
watch(num, (newVale, oldValue)=>{
  console.log("监听器",newVale, oldValue );
},{immediate: true})// 初始化监听

</script>

<!--样式-->
<style scoped>

</style>

