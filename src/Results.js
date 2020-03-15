import React, { Component } from 'react';
import { Toast, Icon, WhiteSpace } from 'antd-mobile';
import { NumberComma, dateFormat } from "./utils/util";
import request from './utils/request'
import styles from './Results.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateTime: '',
      sucess: false,
      showA: true,
      showB: false,
      infos: []
    };
  }

  getData() {
    request({
      url: '/api/v2/ncov_cases/0'
    }).then((res) => {
      this.setState({
        infos: res,
        sucess: true
      })
      Toast.hide();
    })
  }
  showMoreA() {
    this.setState({
      showA: !this.state.showA
    })
  }
  showMoreB() {
    this.setState({
      showB: !this.state.showB
    })
  }
  componentWillMount() {
    Toast.loading('加载中', 0);
    this.getData()
  }

  render() {
    const data = this.state;
    const infos = this.state.infos

    return (
      <div>
        {/* domestic */}
        <div className={styles['ncov']}>
          <div className={styles['ncov-header']}>
            <div className={styles['ncov-header-title']}>全国实时疫情</div>
            <div style={{ fontSize: 11, color: '#00000066' }}>{data.sucess ? infos.domestic.info.time : 0}</div>
          </div>

          <div className={styles['ncov-item']}>
            <div className={styles['ncov-item-content']}>
              <span style={{ fontSize: 13 }}>确诊</span>
              <span className={styles['ncov-item-content-num']} style={{ color: '#e60000' }}>{data.sucess ? NumberComma(infos.domestic.info.t_sure_cnt) : 0}</span>
              <span style={{ background: '#d93d3d0f' }} className={styles['ncov-item-content-add']}>
                较昨日
                <span style={{ color: '#e60000' }}> {data.sucess ? NumberComma(infos.domestic.info.y_sure_cnt) : 0}</span>
              </span>
            </div>

            <div className={styles['ncov-item-content']}>
              <span style={{ fontSize: 13 }}>治愈</span>
              <span className={styles['ncov-item-content-num']} style={{ color: '#7bb974' }}>{data.sucess ? NumberComma(infos.domestic.info.t_cure_cnt) : 0}</span>
              <span style={{ background: '#4175050f' }} className={styles['ncov-item-content-add']}>
                较昨日
                <span style={{ color: '#7bb974' }}> {data.sucess ? NumberComma(infos.domestic.info.y_cure_cnt) : 0}</span>
              </span>
            </div>

            <div className={styles['ncov-item-content']}>
              <span style={{ fontSize: 13 }}>死亡</span>
              <span className={styles['ncov-item-content-num']} style={{ color: '#999999' }}>{data.sucess ? NumberComma(infos.domestic.info.t_die_cnt) : 0}</span>
              <span style={{ background: '#f4f4f4cc' }} className={styles['ncov-item-content-add']}>
                较昨日
                <span style={{ color: '#999999' }}> {data.sucess ? NumberComma(infos.domestic.info.y_die_cnt) : 0}</span>
              </span>
            </div>
          </div>

          {
            data.showA ? (<div className={styles['ncov-item-content-more']} onClick={this.showMoreA.bind(this)}>
              点击收起 <Icon type="up" size={'xxs'} />
            </div>) : (<div className={styles['ncov-item-content-more']} onClick={this.showMoreA.bind(this)}>
              查看更多 <Icon type="down" size={'xxs'} />
            </div>)
          }
        </div>

        <div style={{ display: data.showA ? 'block' : 'none' }} className={styles['ncov-child']}>
          <div>
            <div className={styles['ncov-child-header']}>
              <span>地区</span>
              <span>现存</span>
              <span>确诊</span>
              <span>治愈</span>
              <span>死亡</span>
            </div>

            <div className={styles['content-scroll']} style={{ height: 300 }}>
              {data.sucess ? (
                infos.domestic.list.map((res, index) => {
                  // console.log(res)
                  return (
                    <div className={styles['ncov-child-content']} key={index}>
                      <span className={styles['ncov-child-content-item']}>{res.province}</span>
                      <span className={styles['ncov-child-content-item']} style={{ color: '#ff5500' }}>{NumberComma(res.info.present)}</span>
                      <span className={styles['ncov-child-content-item']} style={{ color: '#e60000' }}>{NumberComma(res.info.sure_cnt)}</span>
                      <span className={styles['ncov-child-content-item']} style={{ color: '#7bb974' }}>{NumberComma(res.info.cure_cnt)}</span>
                      <span className={styles['ncov-child-content-item']} style={{ color: '#999999' }}>{NumberComma(res.info.die_cnt)}</span>
                    </div>
                  )
                })) : ''}
            </div>
          </div>
        </div>

        <WhiteSpace size="xs" />

        {/* foreign */}
        <div className={styles['ncov']}>
          <div className={styles['ncov-header']}>
            <div className={styles['ncov-header-title']}>海外实时疫情</div>
            <div style={{ fontSize: 11, color: '#00000066' }}>数据统计截止{dateFormat(new Date().getTime(), 'MM-dd hh:mm')}</div>
          </div>

          <div className={styles['ncov-item']}>
            <div className={styles['ncov-item-content']}>
              <span style={{ fontSize: 13 }}>确诊</span>
              <span className={styles['ncov-item-content-num']} style={{ color: '#e60000' }}>{data.sucess ? NumberComma(infos.foreign.info.sure_cnt) : 0}</span>
              <span style={{ background: '#d93d3d0f' }} className={styles['ncov-item-content-add']}>
                较昨日
                <span style={{ color: '#e60000' }}> +{data.sucess ? NumberComma(infos.foreign.info.sure_new_cnt) : 0}</span>
              </span>
            </div>

            <div className={styles['ncov-item-content']}>
              <span style={{ fontSize: 13 }}>治愈</span>
              <span className={styles['ncov-item-content-num']} style={{ color: '#7bb974' }}>{data.sucess ? NumberComma(infos.foreign.info.cure_cnt) : 0}</span>
              {/* <span style={{ fontSize: 11 }}>
                较昨日
                <span style={{ color: '#7bb974' }}> +{data.sucess ? NumberComma(infos.yesterday.cure_cnt) : 0}</span>
              </span> */}
            </div>

            <div className={styles['ncov-item-content']}>
              <span style={{ fontSize: 13 }}>死亡</span>
              <span className={styles['ncov-item-content-num']} style={{ color: '#999999' }}>{data.sucess ? NumberComma(infos.foreign.info.die_cnt) : 0}</span>
              {/* <span style={{ fontSize: 11 }}>
                较昨日
                <span style={{ color: '#999999' }}> +{data.sucess ? NumberComma(infos.yesterday.die_cnt) : 0}</span>
              </span> */}
            </div>
          </div>

          {
            data.showB ? (<div className={styles['ncov-item-content-more']} onClick={this.showMoreB.bind(this)}>
              点击收起 <Icon type="up" size={'xxs'} />
            </div>) : (<div className={styles['ncov-item-content-more']} onClick={this.showMoreB.bind(this)}>
              查看更多 <Icon type="down" size={'xxs'} />
            </div>)
          }
        </div>

        <div style={{ display: data.showB ? 'block' : 'none' }} className={styles['ncov-child']}>
          <div>
            <div className={styles['ncov-child-header']}>
              <span>地区</span>
              <span>现存</span>
              <span>确诊</span>
              <span>治愈</span>
              <span>死亡</span>
            </div>

            <div className={styles['content-scroll']} style={{ height: 300 }}>
              {data.sucess ? (
                infos.foreign.list.map((res, index) => {
                  // console.log(res)
                  return (
                    <div className={styles['ncov-child-content']} key={index}>
                      <span className={styles['ncov-child-content-item']}>{res.country}</span>
                      <span className={styles['ncov-child-content-item']} style={{ color: '#ff5500' }}>{NumberComma(res.present)}</span>
                      <span className={styles['ncov-child-content-item']} style={{ color: '#e60000' }}>{NumberComma(res.sure_cnt)}</span>
                      <span className={styles['ncov-child-content-item']} style={{ color: '#7bb974' }}>{NumberComma(res.cure_cnt)}</span>
                      <span className={styles['ncov-child-content-item']} style={{ color: '#999999' }}>{NumberComma(res.die_cnt)}</span>
                    </div>
                  )
                })) : ''}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
