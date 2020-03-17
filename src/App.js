import React, { Component } from 'react';
import { Tabs, Badge } from 'antd-mobile';
import Results from './Results';
import Trends from './Trends';
import Areas from './Areas';
import Record from './Record';
import Locations from './Locations';
import styles from './App.css';

const tabs = [
  { title: <Badge>综合</Badge> },
  { title: <Badge>趋势</Badge> },
  { title: <Badge>记疫</Badge> },
  { title: <Badge>查询</Badge> },
  { title: <Badge>地图</Badge> },
];

const TabExample = () => (
  <div style={{paddingBottom: 10}}>
    <Tabs tabs={tabs}
      initialPage={0}
      swipeable={false}
      prerenderingSiblingsNumber={0}
    >

      <Results />

      <div style={{marginTop: 10, background: '#fff'}}>
        <Trends />
      </div>

      <div>
        <Record />
      </div>

      <div>
        <Areas />
      </div>

      <div>
        <Locations />
      </div>
    </Tabs>
  </div>
);

class App extends Component {
  render() {
    // let bannerUrl = 'https://ms.momocdn.com/02/12/549D/57D5.png'
    return (
      <div className={styles.App}>
        <div>
          <img src={require('./assets/banner.png')} alt={'banner'} className={styles.banner} />
        </div>
        <TabExample />
      </div>
    );
  }
}

export default App;
