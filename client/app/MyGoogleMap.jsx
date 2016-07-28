import React from 'react';
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";

import MyCurrentLocation from './MyCurrentLocation.jsx';
import MyRoute from './MyRoute.jsx';

const DEFAULT_REF = 'map';
const DEFAULT_HEIGHT = '100%';

function createMapOptions(maps) {
  // next props are exposed at maps
  // "Animation", "ControlPosition", "MapTypeControlStyle", "MapTypeId",
  // "NavigationControlStyle", "ScaleControlStyle", "StrokePosition", "SymbolPath", "ZoomControlStyle",
  // "DirectionsStatus", "DirectionsTravelMode", "DirectionsUnitSystem", "DistanceMatrixStatus",
  // "DistanceMatrixElementStatus", "ElevationStatus", "GeocoderLocationType", "GeocoderStatus", "KmlLayerStatus",
  // "MaxZoomStatus", "StreetViewStatus", "TransitMode", "TransitRoutePreference", "TravelMode", "UnitSystem"
  return {
    zoomControlOptions: {
      position: maps.ControlPosition.RIGHT_CENTER,
      style: maps.ZoomControlStyle.SMALL
    },
    mapTypeControlOptions: {
      position: maps.ControlPosition.TOP_RIGHT
    },
    mapTypeControl: true
  };
}


var MyGoogleMap = React.createClass({
    componentDidMount: function() {
        try {
            console.log('Trying to get current location')
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log(position)
                this.setState({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                });
                }.bind(this));
        }
        catch(err) {
            console.log('Cannot get location')
            console.log(err.message);
        }
    },

    getInitialState: function() {
        return {
            lat: 0,
            lng: 0
        };
    },

    componentWillReceiveProps: function(nextProps) {
      this.setState({
        selectedRoute: nextProps.selectedRoute,
        setCurrentLocation: nextProps.setCurrentLocation
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
                        var keys = [];
                        for(var k in json.markers) keys.push(k);

                        var buses = json.markers[keys[0]]

                        this.setState({
                            data: buses
                        })

                  }.bind(this)).catch(function(ex) {
                      console.log('parsing failed', ex);
                  })

    },

    render: function() {

        return (
            <section style={{height: "100%"}}>
              <GoogleMapLoader
                containerElement={
                  <div
                    style={{
                      height: "100%",
                    }}
                  />
                }
                googleMapElement={
                  <GoogleMap
                    ref={(map) => console.log(map)}
                    defaultZoom={this.props.zoom}
                    defaultCenter={{ lat: this.state.lat, lng: this.state.lng }}
                  >
                  </GoogleMap>
                }
              />
            </section>
        );
    },

})
export default MyGoogleMap;
