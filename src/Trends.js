import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import styles from './Trends.css';
import F2 from '@antv/f2/lib/core';
import Legend from '@antv/f2/lib/plugin/legend';
import '@antv/f2/lib/geom/line';
import request from './utils/request';

class App extends Component {
  constructor(prpos) {
    super(prpos);
    this.state = {
      compare: [],
      global: []
    }
  }

  getTrendData() {
    request({
      url: '/api/v2/ncov_cases/1'
    }).then((res)=> {
      this.setState({
        compare: res.data.domestic.concat(res.data.foreign),
        global: res.data.confirmed.concat(res.data.recovered)
      })

      const data = this.state.compare
      const data2 = this.state.global

      const chart = new F2.Chart({
        id: 'trend1',
        pixelRatio: window.devicePixelRatio
      });
      chart.source(data, {
        time: {
          type: 'cat',
          tickCount: 3,
          range: [0, 1]
        },
        value: {
          tickCount: 3,
          formatter: function formatter(ivalue) {
            return ivalue / 1000 + 'K'
          }
        }
      });
      chart.axis('time', {
        line: null,
        label: function label(text, index, total) {
          const textCfg = {};
          if (index === 0) {
            textCfg.textAlign = 'left';
          } else if (index === total - 1) {
            textCfg.textAlign = 'right';
          }
          return textCfg;
        }
      });
      chart.legend({
        position: 'top',
        align: 'center',
      });
      chart.line()
        .position('time*value')
        .color('type', ['#e60000', '#76bbda'])
        .shape('smooth');

      chart.render();
      this.drawGlobal(data2)
      Toast.hide();
    })
  }

  drawGlobal(data) {
    const chart = new F2.Chart({
      id: 'trend2',
      pixelRatio: window.devicePixelRatio
    });
    chart.source(data, {
      time: {
        type: 'cat',
        tickCount: 3,
        range: [0, 1]
      },
      value: {
        tickCount: 3,
        formatter: function formatter(ivalue) {
          return ivalue / 1000 + 'K'
        }
      }
    });
    chart.axis('time', {
      line: null,
      label: function label(text, index, total) {
        const textCfg = {};
        if (index === 0) {
          textCfg.textAlign = 'left';
        } else if (index === total - 1) {
          textCfg.textAlign = 'right';
        }
        return textCfg;
      }
    });
    chart.axis('tem', {
      grid: function grid(text) {
        if (text === '0%') {
          return {
            lineDash: null,
            lineWidth: 1
          };
        }
      }
    });
    chart.legend({
      position: 'top',
      align: 'center',
    });
    chart.line()
      .position('time*value')
      .color('type', ['#e60000', '#7bb974'])
      .shape('smooth');

    chart.render();
  }
  componentDidMount() {
    Toast.loading('加载中', 0)
    F2.Chart.plugins.register(Legend);
    this.getTrendData();
  }

  render() {
    const wid = document.documentElement.clientWidth
    return (
      <div className={styles.trends}>
        <h3>国内(外)确诊人数</h3>
        <canvas id="trend1" width={wid} height="240"></canvas>

        <h3>全球确诊(治愈)人数</h3>
        <canvas id="trend2" width={wid} height="240"></canvas>
      </div>
    );
  }
}

export default App;
