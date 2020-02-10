import React, { Component } from 'react';
import { Icon, Tabs, Badge } from 'antd-mobile';
import Results from './Results'
import Trends from './Trends'
import Locations from './Locations'
import styles from './App.css';

const tabs = [
  { title: <Badge>综合</Badge> },
  { title: <Badge>趋势</Badge> },
  { title: <Badge>地图</Badge> },
];

const TabExample = () => (
  <div>
    <Tabs tabs={tabs}
      initialPage={0}
      onChange={(tab, index) => { console.log('onChange', index, tab); }}
      onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
        <Results />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
        <Trends />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
        <Locations />
      </div>
    </Tabs>
  </div>
);

class App extends Component {
  render() {
    return (
      <div className={styles.App}>
        <div className={styles['App-header']}>
          <img src={require('./assets/banner.png')} className={styles.banner} /> 
        </div>
        <TabExample />
      </div>
    );
  }
}

export default App;
