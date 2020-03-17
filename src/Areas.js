import React, { Component } from 'react';
import { Picker, List, Accordion, Toast } from "antd-mobile";
import districtData from './assets/location.json';
import provs from "./assets/provinces.json";
import cities from "./assets/cities.json";
import areas from "./assets/areas.json";
import request from './utils/request';
import styles from './Areas.css';

const Item = List.Item;

const CustomChildren = props => (
    <div
        onClick={props.onClick}
        style={{ backgroundColor: '#fff', paddingLeft: 15 }}
    >
        <div className="test" style={{ display: 'flex', height: '45px', lineHeight: '45px' }}>
            <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>{props.children}</div>
            <div style={{ textAlign: 'right', color: '#888', marginRight: 15 }}>{props.extra}</div>
        </div>
    </div>
);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pickerValue: '',
            name: '',
            total: '',
            info: [],
            show: true
        }
    }

    componentDidMount() {
        Toast.info('请选择要查看的区域', 2);
    }

    check(v) {
        Toast.loading('加载中', 0);;
        this.setState({ pickerValue: v })
        let prov = provs.filter(item => item.code === v[0].substring(0, 2))
        let city = cities.filter(item => item.code === v[2].substring(0, 4));
        let area = areas.filter(item => item.code === v[2]);

        //getTotalData
        request({
            url: '/api/getStatusByPosition',
            method: 'get',
            data: {
                'province': prov[0].name,
                'city': city[0].name,
                'district': area[0].name
            }
        }).then((res) => {
            let grandpa = Object.values(res.summary)
            // eslint-disable-next-line
            grandpa.map((item) => {
                this.setState({
                    name: Object.keys(item)
                })
                let dad = Object.values(item);
                // eslint-disable-next-line
                dad.map((sub) => {
                    this.setState({
                        total: sub.cnt_sum_certain
                    })
                })
            })
        })

        //getDetail
        request({
            url: '/api/getCommunity',
            method: 'get',
            data: {
                'province': prov[0].name,
                'city': city[0].name,
                'district': area[0].name
            }
        }).then((res) => {
            let grandpa = Object.values(res.community)
            // eslint-disable-next-line
            grandpa.map((item) => {
                if (Object.values(item).length === 0) {
                    this.setState({
                        info: []
                    })
                }
                let dad = Object.values(item);
                // eslint-disable-next-line
                dad.map((sub) => {
                    if (Object.values(sub).length === 0) {
                        this.setState({
                            info: []
                        })
                    }
                    let son = Object.values(sub)
                    // eslint-disable-next-line
                    son.map((nx) => {
                        this.setState({
                            info: nx
                        })
                    })
                })
            })
            Toast.hide();
        })
    }

    render() {
        const datas = this.state;
        let antdDistrict = [];
        Object.keys(districtData).forEach((index) => {
            let itemLevel1 = {};
            let itemLevel2 = {};
            itemLevel1.value = districtData[index].code;
            itemLevel1.label = districtData[index].name;
            itemLevel1.children = [];
            let data = districtData[index].cities;
            Object.keys(data).forEach((index) => {
                itemLevel2.value = data[index].code;
                itemLevel2.label = data[index].name;
                itemLevel2.children = [];
                let data2 = data[index].districts;
                let itemLevel3 = {};
                itemLevel3.children = [];
                Object.keys(data2).forEach((index) => {
                    itemLevel3.value = index;
                    itemLevel3.label = data2[index];
                    itemLevel2.children.push(itemLevel3);
                    itemLevel3 = {};
                });
                itemLevel1.children.push(itemLevel2);
                itemLevel2 = {};
            });
            antdDistrict.push(itemLevel1)
        });
        return (
            <div className={styles.App}>
                <List
                    className="date-picker-list"
                    style={{ backgroundColor: 'white' }}
                >
                    <Picker
                        data={antdDistrict}
                        value={this.state.pickerValue}
                        onOk={v => this.check(v)}
                    >
                        <CustomChildren>当前区域</CustomChildren>
                    </Picker>
                </List>

                {!datas.info.length ? (<div style={{ marginTop: 50, textAlign: 'center' }}>
                    <span>您所在的区域暂未公布或暂未收录具体的疫情信息</span>
                </div>)
                    :
                    (<Accordion defaultActiveKey="0" openAnimation={{}} className="my-accordion" onChange={this.onChange}>
                        <Accordion.Panel>
                            <List className="my-list" renderHeader={() => {
                                return (
                                    <div style={{ textAlign:'center' }}>
                                        <p style={{ margin: 0 }}>{datas.name} 总共确诊 <span style={{ color: 'red', fontWeight: 'bold' }}>{datas.total}</span> 人</p>
                                        <p style={{ margin: 0 }}>本区 总共发现 <span style={{ color: 'red', fontWeight: 'bold' }}>{datas.info.length}</span> 个地点</p>
                                    </div>
                                )
                            }}>
                                <Item extra={'逗留人数'}>
                                    <div style={{ color: '#888' }}>逗留地点</div>
                                </Item>
                                {datas.info.map((item, index) => {
                                    return (
                                        <Item key={index} extra={item.cnt_sum_certain >= 1 ? item.cnt_sum_certain + '人' : '-'}>{item.community || item.street || item.show_address}</Item>
                                    )
                                })}
                            </List>
                        </Accordion.Panel>
                    </Accordion>)}
            </div>
        );
    }
}

export default App;
