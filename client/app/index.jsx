import React from 'react';
import ReactDOM from 'react-dom';
import {Gmaps, Marker, InfoWindow, Circle} from 'react-gmaps';

var coords = {
  lat: 39.7433,
  lng: -104.9891
};


const App = React.createClass({

    componentDidMount: function() {
    navigator.geolocation.getCurrentPosition(function(position) {
        this.setState({
                lat: position.coords.latitude,
                lng: position.coords.longitude
        });
        }.bind(this));
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
    );
  }

});

ReactDOM.render(<App lat={coords.lat} lng={coords.lng} />, document.getElementById('app'));
