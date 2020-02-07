<template>
  <div>
      <iframe :src="src" ref="iframe" style="width: 100%;" :style="{height: height}"></iframe>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "locations",
  data() {
    return {
      src: '../../static/maps.html',
      height: ''
    };
  },
  methods: {
    getLocation() {
      let url =
        "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/1/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Confirmed%20desc%2CCountry_Region%20asc%2CProvince_State%20asc&resultOffset=0&resultRecordCount=250&cacheHint=true";
      let Arry = [];

      axios.get(url).then(res => {
        res.data.features.map(item => {
          Arry.push(item.attributes);
          //   console.log("Arry", Arry);
        });

        var moth = [],
          flag = 0,
          list = Arry;
        var wdy = {
          title: "",
          province: ""
        };
        for (var i = 0; i < list.length; i++) {
          var az = "";
          for (var j = 0; j < moth.length; j++) {
            if (moth[j].title == list[i]["Country_Region"]) {
              flag = 1;
              az = j;
              break;
            }
          }
          if (flag == 1) {
            var ab = moth[az];
            ab.Province.push({
              name: list[i].Province_State || list[i].Country_Region,
              value: list[i].Confirmed
            });
            flag = 0;
          } else if (flag == 0) {
            wdy = {};
            wdy.title = list[i]["Country_Region"];
            wdy.Province = new Array();
            wdy.Province.push({
              name: list[i].Province_State || list[i].Country_Region,
              value: list[i].Confirmed
            });
            moth.push(wdy);
          }
        }

        // console.log(moth);
      });
    }
  },
  
  mounted() {
    this.getLocation();
    this.height = window.innerHeight + 'px';
  }
};
</script>

<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#map {
  width: 100%;
  height: 100%;
}
</style>
