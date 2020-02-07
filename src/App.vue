<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

body {
  background-color: #fbf9fe;
}
.vux-tab .vux-tab-item.vux-tab-selected {
  color: #FF9900 !important;
  border-bottom: 3px solid #FF9900 !important;
}
.vux-tab-ink-bar{
 background-color: #FF9900 !important;
}
</style>
