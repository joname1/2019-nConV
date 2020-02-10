import React, { Component } from 'react';
import {dateFormat} from "./utils/util";
import request from './utils/request'
import styles from './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      see: ''
    };
  }
  componentDidMount() {
    let url = 'https://gisanddata.maps.arcgis.com/sharing/rest/content/items/bda7594740fd40299423467b48e9ecf6?f=json'
    fetch(url).then(res=> res.json()).then((res) => {
      console.log('resaa', dateFormat(res.modified, "yyyy-MM-dd 下午hh:mm"))
    })
    request({
      url: '/ncov_cases/FeatureServer/1/query',
      method: 'get',
      data: {
        'f': 'json',
        'where': '1=1',
        'returnGeometry': false,
        'spatialRel': 'esriSpatialRelIntersects',
        'outFields': '*',
        'orderByFields': 'Confirmed%20desc%2CCountry_Region%20asc%2CProvince_State%20asc',
        'resultOffset': 0,
        'resultRecordCount': 250,
        'cacheHint': true
      }
    }).then((res) => {
      console.log('res', res)
      this.setState({
        see: res.objectIdFieldName
      })
    })
  }

  render() {
    const data = this.state;
    return (
      <div className={styles.App}>
        <h1>results === {data.see}</h1>
      </div>
    );
  }
}

export default App;
