import React from 'react';
import ReactDOM from 'react-dom';
import BurgerMenu from 'react-burger-menu';

import { Button, ButtonToolbar } from 'react-bootstrap';

import MyDropdownList from './MyDropdownList.jsx';
import MyGoogleMap from './MyGoogleMap.jsx';

const coords = {
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

    fetch('/api/routes')
              .then(function(response) {
                console.log(response.headers.get('Content-Type'))
                console.log(response.headers.get('Date'))
                console.log(response.status)
                console.log(response.statusText)
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
        lat: this.props.lat,
        lng: this.props.lng,
        selectedRoute: '',
        routeOptions: [],
    };
  },

  updateSelectButton: function(event) {

      console.log("Received event from select button")
      console.log(event.target.value)

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

  requestRoute(val) {
    this.setState({
        selectedRoute: val.value
    })

    fetch('/api/route/'+val.value)
              .then(function(response) {
                console.log(response.headers.get('Content-Type'))
                console.log(response.headers.get('Date'))
                console.log(response.status)
                console.log(response.statusText)
                if (response.status == 200){
                            return response.json();
                          }
                else {
                  return response.text()
                }
              }.bind(this))
              .then(function(json) {
                    console.log(json)
              }.bind(this)).catch(function(ex) {
                  console.log('parsing failed', ex);
              })


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

        var optionRender = this.state.routeOptions.map(function(opt) {
              return (
                <option value={opt.value}>
                    {opt.value}
                </option>
              );
            });

    return (

      <div className='fill'>

      <div className='row'>

        <div className='column-sm-12'>
            <select className="selectpicker" id='routename' onChange={this.updateSelectButton}>
                {optionRender}
            </select>
        </div>


      </div>

       <MyGoogleMap
        center={{lat: this.state.lat, lng: this.state.lng}}
        zoom={14}
        >
      </MyGoogleMap>
      </div>
    );
  }

});

ReactDOM.render(<App lat={coords.lat} lng={coords.lng} />, document.getElementById('app'));
