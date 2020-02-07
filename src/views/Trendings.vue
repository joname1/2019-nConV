<template>
  <div style="margin-top: 30px">
    <div id="myChart" :style="{width: '100%', height: '300px'}"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { dateFormat } from 'vux'
import axios from "axios";

export default {
  name: "trendings",
  data() {
    return {
      date: [],
      china:[],
      other:[]
    };
  },

  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["中国", "其他"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.date
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "中国",
            type: "line",
            smooth: true,
            data: this.china
          },
          {
            name: "其他",
            type: "line",
            smooth: true,
            data: this.other
          }
        ]
      });
    },

    getTrend() {
      let url =
        "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/cases_time/FeatureServer/0/query?f=json&where=Report_Date%3C%272020-02-09%2016%3A00%3A00%27&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Report_Date%20asc&resultOffset=0&resultRecordCount=2000&cacheHint=true";

      axios.get(url).then(res => {
         let dateArry = []
         let chinaArry = []
         let otherArry = []
        res.data.features.map(item => {
          dateArry.push(dateFormat(item.attributes.Report_Date, 'MM月DD日'));
          chinaArry.push(item.attributes.Mainland_China);
          otherArry.push(item.attributes.Other_Locations);

        //   console.log("fxxff", this.chinaArry);
          this.date = dateArry
          this.china = chinaArry
          this.other = otherArry

          this.drawLine()
        });
      });
    }
  },

  mounted() {
      this.getTrend();
    this.drawLine();
  }
};
</script>

<style lang="less">
</style>
