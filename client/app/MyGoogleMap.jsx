import React from 'react';
import GoogleMap from 'google-map-react';

import MyCurrentLocation from './MyCurrentLocation.jsx';
import MyRoute from './MyRoute.jsx';

const DEFAULT_REF = 'map';
const DEFAULT_HEIGHT = '100%';

var MyGoogleMap = React.createClass({

    getInitialState: function() {
        return {
            bounds: [],
            zoom: this.props.zoom,
            center: this.props.center,
            coordinates: this.props.coordinates,
            height: this.props.height,
            googleApiLoaded: false,
            selectedRoute: '',
            markerData: []
        };
    },

    componentWillReceiveProps: function(nextProps) {
      this.setState({
        selectedRoute: nextProps.selectedRoute
      });

        fetch('/api/markers/'+nextProps.selectedRoute)
                  .then(function(response) {
                    // console.log(response.headers.get('Content-Type'))
                    // console.log(response.headers.get('Date'))
                    // console.log(response.status)
                    // console.log(response.statusText)
                    if (response.status == 200){
                                return response.json();
                              }
                    else {
                      return {markers: {}, routePaths: {}}
                    }
                  }.bind(this))
                  .then(function(json) {
                        this.setState({
                            markerData: json
                        })

                  }.bind(this)).catch(function(ex) {
                      console.log('parsing failed', ex);
                  })

    },

    render: function() {

        return (
            <GoogleMap
                center={this.state.center}
                zoom={this.state.zoom}
                bootstrapURLKeys={{key: 'AIzaSyBHeZ1fjiNUfnqlurPslSwmnjquCd60wFU'}}
                center={this.state.center}
                zoom={this.state.zoom}
                onGoogleApiLoaded={this.onGoogleApiLoaded}
                yesIWantToUseGoogleMapApiInternals
                options={this.props.options}>

                <MyCurrentLocation setCurrentLocation={this.props.setCurrentLocation} lat={this.state.center.lat} lng={this.state.center.lng}>
                </MyCurrentLocation>


                <MyRoute data={this.state.markerData}>
                </MyRoute>

            </GoogleMap>
        );
    },

    onGoogleApiLoaded: function({map, maps}) {
        this.setState({
            googleApiLoaded: true
        });

        const bounds = new maps.LatLngBounds();

        function extendBounds(lat, lng) {
            const latLng = new maps.LatLng(lat, lng);
            bounds.extend(latLng);
        }
        function extendCoordsBounds(coords) {
            for (var i = 0; i < coords.length; i++) {
                if (coords[i].hasOwnProperty('lat') && coords[i].hasOwnProperty('lng')) {
                    extendBounds(coords[i].lat, coords[i].lng);
                } else if (Array.isArray(coords[i])) {
                    extendCoordsBounds(coords[i]);
                }
            }
        }

    }
})

export default MyGoogleMap;
