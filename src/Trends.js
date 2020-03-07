import React, { Component } from 'react';
import { NumberComma, normalize } from './utils/util';
import { Toast, SegmentedControl } from 'antd-mobile';
import styles from './Trends.css';
import echarts from 'echarts';
import 'echarts/lib/chart/line';  //折线图是line,饼图改为pie,柱形图改为bar
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import request from './utils/request';
import area from './utils/area'

class App extends Component {
  constructor(prpos) {
    super(prpos);
    this.state = {
      date: [],
      china: [],
      other: [],
      show: 0,
      domenstic: [],
      global: []
    }
  }

  getTrendData() {
    request({
      url: '/api/v2/ncov_cases/3',
    }).then((res) => {
        this.setState({
          date: res.data.time,
          china: res.data.china,
          other: res.data.other
        })
    })
  }

  getGlobalData() {
    request({
      url: '/api/v2/ncov_cases/1'
    }).then((res) => {
      let Arry = []
      // eslint-disable-next-line
      res.data.map((item) => {
        let dad = area.countryList.filter(data => {
          return Object.values(data)[0] === item.attributes.Country_Region
        })

        Arry.push({
          name: Object.keys(dad[0]),
          value: item.attributes.Confirmed
        })

        this.setState({
          global: Arry
        })
      })
    })
  }
  
  getDomensticData() {
    request({
      url: '/api/v2/ncov_cases/2',
    }).then(res => {
      let Arry = [];
      let CityInfo = [];
      // eslint-disable-next-line
      res.data.map(item => {
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
          domenstic: CityInfo
        })
      })
    })
  }

  setShow = (e) => {
    this.setState({
      show: e.nativeEvent.selectedSegmentIndex
    })
  }

  componentDidUpdate() {
    let myChart = echarts.init(document.getElementById('main'));
    let option = {
      title: {
        text: '全球确诊人数',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['中国', '其他'],
        orient: 'vertical',
        x: 'right'
      },
      grid: {
        left: '3%',
        right: '5%',
        top: '20%',
        bottom: '1%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.state.date
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '中国',
          type: 'line',
          data: this.state.china
        },
        {
          name: '其他',
          type: 'line',
          data: this.state.other
        }
      ]
    };
    myChart.setOption(option, true);

    if(this.state.domenstic.length>0){
      Toast.hide();
    }
  }

  componentDidMount() {
    Toast.loading('加载中', 0);
    this.getTrendData();
    this.getGlobalData();
    this.getDomensticData();
  }

  render() {
    const data = this.state;
    return (
      <div className={styles.App}>
        <div id="main" style={{ height: 250 }}></div>
        <div>
          <div className={styles['content-title']}>
            <span style={{fontSize: 20, marginTop: 10}}>已确诊的国家/地区</span>
          </div>

          <div style={{ width: '90%', margin: '0 auto', paddingBottom: 10}}>
            <SegmentedControl
              values={['全球', '国内']}
              onChange={this.setShow}
            />
          </div>

          {data.show === 0 ? (
            <div className={styles['content-scroll']}>
              {data.global.map((item, index) => {
                return (
                  <h3 key={index}>{item.name} <span style={{ color: 'red' }}>{NumberComma(item.value)}</span>例</h3>
                )
              })}
            </div>
          ) : (
            <div className={styles['content-scroll']}>
            {data.domenstic.map((item, index) => {
              return (
                <h3 key={index}>{item.name} <span style={{ color: 'red' }}>{NumberComma(item.value)}</span>例</h3>
              )
            })}
          </div>
            )

          }
        </div>
      </div>
    );
  }
}

export default App;
