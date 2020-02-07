<template>
  <div style="height:44px;">
    <sticky ref="sticky" :check-sticky-support="false">
      <tab v-model="index" prevent-default @on-before-index-change="switchTabItem">
        <tab-item v-for="(item, index) in list2" :key="index">{{item.name}}</tab-item>
      </tab>
    </sticky>

    <component :is="currentView"></component>
  </div>
</template>

<script>
import { Tab, TabItem, Sticky, Swiper, SwiperItem } from "vux";
import Results from "@/views/Results";
import Trendings from "@/views/Trendings";
import Locations from "@/views/Locations";

export default {
  name: "HelloWorld",
  components: {
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    Sticky,
    Results,
    Trendings,
    Locations
  },
  data() {
    return {
      index: 0,
      currentView: "Results",
      list2: [
        { id: 1, name: "综合" },
        { id: 2, name: "趋势" },
        { id: 3, name: "地图" }
      ]
    };
  },
  methods: {
    toggle(i, v) {
      console.log("i, v", i, v);
      // this.active = i;
      // this.currentView = v;
    },
    switchTabItem(index) {
      // this.$vux.loading.show({
      //   text: "loading"
      // });
      // setTimeout(() => {
      //   this.$vux.loading.hide();
      if (index === 1) {
        this.currentView = "Trendings";
      } else if (index === 2) {
        this.currentView = "Locations";
      } else {
        this.currentView = "Results";
      }
      this.index = index;
      // }, 1000);
    }
  }
};
</script>

<style scoped>
</style>
