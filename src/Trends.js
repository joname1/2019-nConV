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
    let url = 'http://naives.glitch.me/naive'
    fetch(url).then((i) => {
      return i.json()
    }).then((p)=> {
      this.setState({
        compare: p.data.china.concat(p.data.foreign),
        global: p.data.confirmed.concat(p.data.recovered)
      })

      const data = this.state.compare
      const data1 = this.state.global

      //11
      const chart1 = new F2.Chart({
        id: 'container1',
        pixelRatio: window.devicePixelRatio
      });
      chart1.source(data, {
        time: {
          type: 'cat',
          tickCount: 6,
          range: [ 0, 1 ]
        },
        value: {
          tickCount: 3,
          formatter: function formatter(ivalue) {
            return ivalue / 1000 + 'K'
          }
        }
      });
      chart1.axis('time', {
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
      chart1.axis('tem', {
        grid: function grid(text) {
          if (text === '0%') {
            return {
              lineDash: null,
              lineWidth: 1
            };
          }
        }
      });
      chart1.legend({
        position: 'top',
        align: 'center',
      });
      chart1.line()
        .position('time*value')
        .color('type', ['#e60000', '#76bbda'])
        .shape('smooth');

        chart1.render();

        //22
        const chart2 = new F2.Chart({
          id: 'container2',
          pixelRatio: window.devicePixelRatio
        });
        chart2.source(data1, {
          time: {
            type: 'cat',
            tickCount: 6,
            range: [ 0, 1 ]
          },
          value: {
            tickCount: 3,
            formatter: function formatter(ivalue) {
              return ivalue / 1000 + 'K'
            }
          }
        });
        chart2.axis('time', {
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
        chart2.axis('tem', {
          grid: function grid(text) {
            if (text === '0%') {
              return {
                lineDash: null,
                lineWidth: 1
              };
            }
          }
        });
        chart2.legend({
          position: 'top',
          align: 'center',
        });
        chart2.line()
          .position('time*value')
          .color('type', ['#e60000', '#7bb974'])
          .shape('smooth');
      
      chart2.render();
    })
  }
  componentDidMount() {
    F2.Chart.plugins.register(Legend);
    this.getTrendData();
  }

  render() {
    const data = this.state;
    const wid = document.documentElement.clientWidth
    return (
      <div className={styles.trends}>
          <h3>国内(外)确诊人数</h3>
          <canvas id="container1" width={wid} height="260"></canvas>

          <h3>全球确诊(治愈)人数</h3>
          <canvas id="container2" width={wid} height="260"></canvas>
      </div>
    );
  }
}

export default App;
