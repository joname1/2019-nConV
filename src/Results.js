import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import { dateFormat, NumberComma, calcSum } from "./utils/util";
import request from './utils/request'
import styles from './Results.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateTime: '',
      info: [
        { id: 1, name: '确 诊', count: '', color: '#d6d6d6' },
        { id: 2, name: '死 亡', count: '', color: '#999999' },
        { id: 3, name: '治 愈', count: '', color: '#7bb974' },
      ]
    };
  }

  getUpdateTime() {
    request({
      url: '/cases_time_v2/FeatureServer/0',
      method: 'get',
      data: {
        'f': 'json'
      }
    }).then((res) => {
      this.setState({
        updateTime: dateFormat(res.editingInfo.lastEditDate, "yyyy-MM-dd hh:mm:ss")
      })
    })
  }

  getResultsData() {
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
    }).then((res) => {
      let confirmedArry = [];
      let deathsArry = [];
      let recoveredArry = [];
      // eslint-disable-next-line
      res.features.map((item) => {
        confirmedArry.push(item.attributes.Confirmed);
        recoveredArry.push(item.attributes.Recovered);
        deathsArry.push(item.attributes.Deaths);
      })

      const infos = this.state.info;
      infos[0].count = calcSum(confirmedArry)
      infos[1].count = calcSum(deathsArry)
      infos[2].count = calcSum(recoveredArry)

      this.setState({
        infos
      })

      if(infos[2].count){
        Toast.hide();
      }
    })
  }
  componentDidMount() {
    Toast.loading('加载中');
    this.getUpdateTime();
    this.getResultsData();
  }

  render() {
    const data = this.state;

    return (
      <div  style={{height: 600, overflow: 'hidden'}}>
        <div>
          {data.info.map((item, index) => {
            return (
              <div className={styles['card-item']} key={index}>
                <span style={{ fontSize: 35, color: item.color, borderColor: item.color, borderBottom: '2px solid' }}>{item.name}</span>
                <p style={{ fontSize: 65, color: index === 0 ? '#e60000' : item.color, margin:0 }}>{NumberComma(item.count)}</p>
              </div>
            )
          })}
          <div className={styles['copyright']}>
            <p>为确保真实可靠性, 所有数据均收集于以下网站:</p>
            <p style={{ marginTop: -10 }}>
                <a
                  href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports"
                >WHO</a>,&nbsp;
                <a href="https://www.cdc.gov/coronavirus/2019-ncov/index.html">CDC</a>,&nbsp;
                <a href="https://www.ecdc.europa.eu/en/geographical-distribution-2019-ncov-cases">ECDC</a>,&nbsp;
                <a href="http://www.nhc.gov.cn/yjb/s3578/new_list.shtml">NHC</a>,&nbsp;
                <a href="https://www.jhu.edu">JHU</a>,&nbsp;
                <a href="https://ncov.dxy.cn/ncovh5/view/pneumonia">DXY</a>.
              </p>
              <p style={{ marginTop: -10 }}>数据更新时间: {data.updateTime}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
