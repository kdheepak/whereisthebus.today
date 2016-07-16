import React from 'react';
import ReactDOM from 'react-dom';
import BurgerMenu from 'react-burger-menu';

import { Button, ButtonToolbar } from 'react-bootstrap';

import MyGoogleMap from './MyGoogleMap.jsx';
import MySelectMenu from './MySelectMenu.jsx';

const coords = {
  lat: 39.7433,
  lng: -104.9891
};

const App = React.createClass({

    componentDidMount: function() {
        try {
            console.log('Trying to get current location')
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log(position)
                this.setState({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        setCurrentLocation: true
                });
                }.bind(this));
        }
        catch(err) {
            console.log('Cannot get location')
            console.log(err.message);
        }

    fetch('/api/routes')
              .then(function(response) {
                // console.log(response.headers.get('Content-Type'))
                // console.log(response.headers.get('Date'))
                // console.log(response.status)
                // console.log(response.statusText)
                if (response.status == 200){
                            return response.json();
                          }
                else {
                  return response.text()
                }
              }.bind(this))
              .then(function(json) {
                    this.setState({
                        routeOptions: json
                    })
                    console.log(json)
              }.bind(this)).catch(function(ex) {
                  console.log('parsing failed', ex);
              })


    },

  getInitialState: function() {
    return {
        lat: coords.lat,
        lng: coords.lng,
        selectedRoute: '',
        routeOptions: [],
        setCurrentLocation: true
    };
  },

  updateSelectButton: function(event) {

      console.log("Received event from select button")
      console.log(event.target.value)

      this.setState({
          selectedRoute: event.target.value
      })

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
        const defaultOptions = {
            strokeWidth: 1,
            stroke: '#FF5106',
            strokeOpacity: '0.8',
            fill: '#FF4234',
            fillOpacity: '0.3',
            onMouseEnter: function(e) {
            },
            onMouseLeave: function(e) {
            }
        };

    return (

    <div id="wrapper">

          <MySelectMenu onChange={this.updateSelectButton} routeOptions={this.state.routeOptions}>
          </MySelectMenu>


          <div id="map-canvas" style={{width: '100%', height: '100vh'}}>
              <MyGoogleMap
               center={{lat: this.state.lat, lng: this.state.lng}}
               zoom={14}
               selectedRoute={this.state.selectedRoute}
               setCurrentLocation={this.state.setCurrentLocation}
               >
             </MyGoogleMap>
          </div>
    </div>

    );
  }

});

ReactDOM.render(<App/>, document.getElementById('app'));
