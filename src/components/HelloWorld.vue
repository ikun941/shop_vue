<template>
  <h1>hello</h1>
  {{props.data}}
</template>

<script setup>
// 接收传来的参数
let props = defineProps({
  data:{
    type: Number,// 参数类型
    required: true,//是否必传
    default: 666,//默认值
  },
})
</script>

<style scoped>

</style>