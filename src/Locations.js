import React, { Component } from 'react';
import request from './utils/request';
import { Toast } from 'antd-mobile';
import { normalize } from './utils/util';
import area from './utils/area';
import echarts from 'echarts';
import 'echarts/map/js/china';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mapData: []
    }
  }
  getLocationData() {
    request({
      url: '/ncov_cases/FeatureServer/1/query',
      method: 'get',
      data: {
        'f': 'json',
        'where': '1=1',
        'returnGeometry': false,
        'outFields': '*',
        'orderByFields': 'Confirmed%20desc%2CCountry_Region%20asc%2CProvince_State%20asc'
      }
    }).then(res => {
      let Arry = [];
      let CityInfo = [];
      // eslint-disable-next-line
      res.features.map(item => {
        Arry.push(item.attributes);
      });
      
      let dad = normalize(Arry)[0].Province;
      // eslint-disable-next-line
      dad.map(res => {
        let loc = area.areaList.filter(item => item.eng === res.name)
        CityInfo.push({
          name: loc[0].name,
          value: res.value
        })

        this.setState({
          mapData: CityInfo
        })
      })
    })
  }

  getMaps() {
    let myChart = echarts.init(document.getElementById('maps'));
    let option = {
      title: {
        text: '全国新型冠状病毒确诊情况',
        left: 'center',
        top: '5%'
      },
      tooltip: {
        triggerOn: "click",
        formatter: function (e, t, n) {
          // eslint-disable-next-line
          return e.value? e.name + "<br />" + e.seriesName + "：" + e.value + '例' : e.name + "<br />" + '暂无数据';
        }
      },
      visualMap: {
        min: 0,
        max: 1000,
        left: 26,
        bottom: 10,
        showLabel: !0,
        text: ["高", "低"],
        pieces: [{
          gt: 500,
          label: "> 500人",
          color: "#7f1100"
        }, {
          gte: 100,
          lte: 500,
          label: "100 - 500人",
          color: "#ff5428"
        }, {
          gte: 0,
          lt: 99,
          label: "< 100人",
          color: "#ff8c71"
        }],
        show: !0
      },
      geo: {
        map: "china",
        label: {
          emphasis: {
            show: false,
          }
        },
        roam: !1,
        scaleLimit: {
          min: 1,
          max: 2
        },
        zoom: 1.23,
        top: 120,
        itemStyle: {
          normal: {
            //shadowBlur: 50,
            //shadowColor: 'rgba(0, 0, 0, 0.2)',
            borderColor: "rgba(0, 0, 0, 0.2)"
          },
          emphasis: {
            areaColor: "#f2d5ad",
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            borderWidth: 0
          }
        }
      },
      series: [{
        name: "已确诊",
        type: "map",
        geoIndex: 0,
        data: this.state.mapData
      }]
    };

    myChart.setOption(option, true)
  }

  componentDidUpdate() {
    this.getMaps();
    
    if(this.state.mapData.length>0){
      Toast.hide();
    }
  }
  componentDidMount() {
    Toast.loading('加载中', 0);
    this.getLocationData();
  }

  render() {
    return (
      <div id="maps" style={{ height: '600px' }}></div>
    );
  }
}

export default App;