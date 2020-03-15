import React, { Component } from 'react';
import { NumberComma, normalize } from './utils/util';
import { Toast, WhiteSpace } from 'antd-mobile';
import styles from './Trends.css';
import echarts from 'echarts';
import 'echarts/lib/chart/line';  //折线图是line,饼图改为pie,柱形图改为bar
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import request from './utils/request';
import area from './utils/constant'

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
      url: '/api/v2/ncov_cases/1',
    }).then((res) => {
        this.setState({
          date: res.data.time,
          china: res.data.china,
          other: res.data.other,
          totalC: res.data.total_confirmed,
          totalR: res.data.total_recovered
        })

        Toast.hide()
    })
  }

  componentDidUpdate() {
    let myChart1 = echarts.init(document.getElementById('main1'));
    let myChart2 = echarts.init(document.getElementById('main2'));
    let option1 = {
      title: {
        text: '国内外确诊人数',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['中国', '海外'],
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
          name: '海外',
          type: 'line',
          data: this.state.other
        }
      ]
    };
    let option2 = {
      title: {
        text: '全球总确诊/治愈人数',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['确诊', '治愈'],
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
          name: '确诊',
          type: 'line',
          data: this.state.totalC
        },
        {
          name: '治愈',
          type: 'line',
          data: this.state.totalR
        }
      ]
    };
    myChart1.setOption(option1, true);
    myChart2.setOption(option2, true);
  }

  componentDidMount() {
    Toast.loading('加载中', 0);
    this.getTrendData();
  }

  render() {
    const data = this.state;
    return (
      <div className={styles.App}>
        <div id="main1" style={{ height: 250 }}></div>
        <div style={{marginTop: 50}}></div>
        <div id="main2" style={{ height: 250 }}></div>
      </div>
    );
  }
}

export default App;
