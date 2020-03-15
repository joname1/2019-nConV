import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { Toast, PullToRefresh } from "antd-mobile";
import request from './utils/request';
import { dateFormat } from './utils/util'
import source from './utils/constant'
import styles from './Record.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.pageNum = 1,
        this.ptr,
        this.state = {
            refreshing: false,
            down: false,
            height: document.documentElement.clientHeight,
            infos: []
        }
    }

    getData(hei) {
        request({
            url: '/api/v2/ncov_cases/timeline/page=' + this.pageNum,
        }).then((res) => {
            this.setState({
                height: hei,
                infos: res.data
            })
            if (this.state.infos.length > 0) {
                Toast.hide();
            }
        })
    }
    componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
        Toast.loading('加载中', 0);
        this.getData(hei)
    }

    render() {
        const data = this.state;
        const h = document.documentElement.clientHeight - 230;
        return (
            <div className={styles.App}>
                <div>
                    <div className={styles.navs}>
                        {source.sourceType.map((item, index) => {
                            return (
                                <span key={index} className={`${styles.switch} ${styles['switch' + index]}`}>{item.name}</span>
                            )
                        })}
                    </div>
                </div>
                <div className={styles['content-scroll']}>
                <PullToRefresh
                    damping={60}
                    indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
                    direction={'up'}
                    ref={el => this.ptr = el}
                    style={{
                        height: h,
                        overflow: 'auto',
                      }}
                    refreshing={this.state.refreshing}
                    onRefresh={() => {
                        this.setState({ refreshing: true })
                        const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
                        let num = ++this.pageNum;
                        request({
                            url: '/api/v2/ncov_cases/timeline/page=' + num,
                        }).then((res) => {
                            if(res.data.length===0) {
                                Toast.info('暂无更多资讯', 2);
                            }else {
                                this.setState({
                                    height: hei,
                                    infos: this.state.infos.concat(res.data)
                                })
                            }
                            if (this.state.infos.length > 0) {
                                this.setState({ refreshing: false })
                            }
                        })
                    }}
                >
                    <div className={styles['custom-bg-white']}>
                        <div className={styles['jazz-timeline-wrapper']}>
                            <div className={`${styles['jazz-timeline']} ${styles['white-timeline']} ${styles['bordered-timeline']} ${styles['one-sided']}`}>
                                {data.infos.map((item, index) => {
                                    return (
                                        <div className={styles['timeline-post']} key={index}>
                                            <div className={`${styles['timeline-meta']} ${styles['for-large-icons']}}`}>
                                                <div className={styles['meta-details']}>{dateFormat(new Date(item.title).getTime(), 'yyyy年')}</div>
                                            </div>
                                            <div className={`${styles['timeline-icon']} ${styles['icon-larger']} ${styles['iconbg-black']} ${styles['icon-color-white']}`}>
                                                <div className={styles['icon-placeholder']}>{dateFormat(new Date(item.title).getTime(), 'M月')}<span>{dateFormat(new Date(item.title).getTime(), 'dd')} </span></div>
                                                <div className={styles['timeline-bar']}></div>
                                            </div>
                                            {item.info.map((sub, index) => {
                                                let dad = source.sourceType.filter((i) => {
                                                    return Object.values(i)[0] === sub.category
                                                })

                                                return (
                                                    <div
                                                        key={index}
                                                        className={styles['timeline-content']}
                                                        style={{
                                                            background: (dad[0].type === dad[0].type) ? dad[0].color : ''
                                                        }}
                                                    >
                                                        <div className={styles['icon-arrow']}
                                                            style={{
                                                                borderRightColor: (dad[0].type === dad[0].type) ? dad[0].color : ''
                                                            }}></div>
                                                        <div className={styles['content-details']}>
                                                            <p>{sub.event}</p>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        </div>
                </PullToRefresh>
                    </div>
            </div>
        );
    }
}

export default App;
