<template>
  <div style="height:44px;">
    <div style="margin: 10px;overflow: hidden;" v-for="(item, index) in list3" :key="index">
      <masker style="border-radius: 2px;">
        <div class="m-img"></div>
        <div slot="content" class="m-title" :style="{color: item.color}">
          {{item.title}}
          <br />
          <span class="m-time">{{item.count | NumFormat}}</span>
        </div>
      </masker>
    </div>
  </div>
</template>

<script>
import { Masker } from "vux";
import sum from "../utils/sum";
import axios from "axios";

export default {
  name: "HelloWorld",
  components: { Masker },

  filters: {
    NumFormat: function(value) {
      if (!value) return " ";

      let intPart = Number(value).toFixed(0); // 获取整数部分

      let intPartFormat = intPart
        .toString()
        .replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); // 将整数部分逢三一断

      return intPartFormat;
    }
  },

  data() {
    return {
      index: 0,
      list3: [
        {
          title: "已确诊",
          color: "rgb(214, 214, 214)",
          count: ""
        },
        {
          title: "已死亡",
          color: "rgb(153, 153, 153)",
          count: ""
        },
        {
          title: "已治愈",
          color: "rgb(123, 185, 116)",
          count: ""
        }
      ]
    };
  },

  methods: {
    getResults() {
      this.$vux.loading.show();
      let url =
        "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/1/query?f=json&where=1=1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Confirmed desc,Country_Region asc,Province_State asc&resultOffset=0&resultRecordCount=250&cacheHint=true";
      axios.get(url).then(res => {
        this.$vux.loading.hide();
        let confirmedArry = [];
        let deathsArry = [];
        let recoveredArry = [];
        // console.log('res', res.data)
        res.data.features.map(item => {
          confirmedArry.push(item.attributes.Confirmed);
          recoveredArry.push(item.attributes.Recovered);
          deathsArry.push(item.attributes.Deaths);
          //  console.log('deaths', sum(deathsArry))

          this.list3[0].count = sum(confirmedArry);
          this.list3[1].count = sum(deathsArry);
          this.list3[2].count = sum(recoveredArry);
        });
      });
    }
  },

  mounted() {
    this.getResults();
  }
};
</script>

<style scoped>
.m-img {
  padding-bottom: 60%;
  display: block;
  position: relative;
  max-width: 100%;
  background-color: #222327;
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  border-radius: 2px;
}

.m-title {
  color: #fff;
  text-align: center;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  font-weight: 500;
  font-size: 40px;
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  text-align: center;
  top: 50%;
  transform: translateY(-50%);
}

.m-time {
  font-size: 70px;
  padding-top: 4px;
  border-top: 1px solid #f0f0f0;
  display: inline-block;
  margin-top: 5px;
}
</style>
