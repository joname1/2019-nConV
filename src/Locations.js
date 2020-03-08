import React, { Component } from 'react';
import request from './utils/request';
import { Toast } from 'antd-mobile';
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mapData: []
    }
  }

  getLocationData() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 0,
        style: 'dark',
        center: [ 103.99215001469588, 35.281597225674773 ],
        zoom: 2.394613775109773,
        maxZoom: 10
      }),
    });

    request({
      url: '/api/v2/ncov_cases/4'
    }).then(data =>  {
        data.features = data.features.filter(item => {
          return item.properties.confirmed > 0;
        });
        
        const pointLayer = new PointLayer({})
          .source(data)
          .shape('circle')
          .size('confirmed', [ 3, 33 ])
          .color('confirmed', ['#DC281E', '#800000'])
          .active(true)
          .style({
            opacity: 0.5,
            strokeWidth: 0
          });
    
        scene.addLayer(pointLayer);

        Toast.hide();
      });
  }

  componentDidMount() {
    Toast.loading('加载中', 0);
    this.getLocationData()
  }

  render() {
    const h = document.documentElement.clientHeight - 186;
    return (
      <div id="map" style={{minHeight: h, touchAction: 'none', position: 'relative'}} />
    );
  }
}

export default App;