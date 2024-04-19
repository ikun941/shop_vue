<template>
  <dv-decoration-11 style="width:800px;height:100px;">
    <div color-green font-600 bg="~ dark/0">
      <div class="top-section">
        <!-- Your top section content goes here -->
        <h1 class="ziti">团购网站餐饮类消费可视化系统</h1>
        <slot name="top"></slot>
      </div>
    </div>
  </dv-decoration-11>
</template>

<style lang="scss" scoped>
@import '../../assets/font/font.css';

.ziti {
  font-family: 'sky', sans-serif;
  font-size: 45px;
  color: #B22222;
  text-transform: uppercase; /* 转换为大写字母 */
  letter-spacing: 2px; /* 字符间距 */
  text-shadow: 2px 2px 4px rgba(52, 152, 219, 0.5); /* 文字阴影 */
  animation: glow 2s infinite alternate; /* 添加动画效果 */
}

@keyframes glow {
  from {
    text-shadow: 2px 2px 4px rgba(52, 152, 219, 0.5);
  }
  to {
    text-shadow: 2px 2px 8px rgba(52, 152, 219, 1);
  }
}
</style>

<script setup>
</script>
