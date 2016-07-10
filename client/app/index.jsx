import React from 'react';
import ReactDOM from 'react-dom';
import {Gmaps, Marker, InfoWindow, Circle} from 'react-gmaps';
import BurgerMenu from 'react-burger-menu';

import MyDropdownList from './MyDropdownList.jsx';

var coords = {
  lat: 39.7433,
  lng: -104.9891
};

const App = React.createClass({

    componentDidMount: function() {
        try {
            navigator.geolocation.getCurrentPosition(function(position) {
                this.setState({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                });
                }.bind(this));
        }
        catch(err) {
            console.log(err.message);
        }
    },

  getInitialState: function() {
    return {
        lat: this.props.lat,
        lng: this.props.lng,
    };
  },

  onMapCreated(map) {
    map.setOptions({
      disableDefaultUI: true
    });
  },

  onDragEnd(e) {
    console.log('onDragEnd', e);
  },

  onCloseClick() {
    console.log('onCloseClick');
  },

  onClick(e) {
    console.log('onClick', e);
  },

  render() {
    return (

      <div className='fill'>

      <MyDropdownList>
      </MyDropdownList>

      <Gmaps
        width={'100%'}
        height={'100%'}
        lat={this.state.lat}
        lng={this.state.lng}
        zoom={14}
        loadingMessage={'Be happy'}
        params={{v: '3.exp', key: 'AIzaSyBHeZ1fjiNUfnqlurPslSwmnjquCd60wFU'}}
        onMapCreated={this.onMapCreated}>
        <Marker
          lat={this.state.lat}
          lng={this.state.lng}
          draggable={true}
          onDragEnd={this.onDragEnd} />
        <InfoWindow
          lat={this.state.lat}
          lng={this.state.lng}
          content={'Hello, React :)'}
          onCloseClick={this.onCloseClick} />
        <Circle
          lat={this.state.lat}
          lng={this.state.lng}
          radius={500}
          onClick={this.onClick} />
      </Gmaps>
      </div>
    );
  }

});

ReactDOM.render(<App lat={coords.lat} lng={coords.lng} />, document.getElementById('app'));
