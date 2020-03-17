import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import styles from './Trends.css';
import echarts from 'echarts';
import 'echarts/lib/chart/line';  //折线图是line,饼图改为pie,柱形图改为bar
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import request from './utils/request';

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
        text: '国内(外)确诊人数',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      color: ['#e60000', '#03a9f4'],
      legend: {
        data: ['国内', '国外'],
        orient: 'vertical',
        x: 'right'
      },
      grid: {
        left: '1%',
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
          name: '国内',
          type: 'line',
          data: this.state.china,
          smooth: true
        },
        {
          name: '国外',
          type: 'line',
          data: this.state.other,
          smooth: true
        }
      ]
    };
    let option2 = {
      title: {
        text: '全球总确诊(治愈)人数',
        left: 'center'
      },
      color: ['#e60000', '#7bb974'],
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['确诊', '治愈'],
        orient: 'vertical',
        x: 'right'
      },
      grid: {
        left: '1%',
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
          data: this.state.totalC,
          smooth: true
        },
        {
          name: '治愈',
          type: 'line',
          data: this.state.totalR,
          smooth: true
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
