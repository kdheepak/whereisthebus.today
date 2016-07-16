import React from 'react';
import GoogleMap from 'google-map-react';

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

    getInitialState: function() {
        return {
            bounds: [],
            zoom: this.props.zoom,
            center: this.props.center,
            coordinates: this.props.coordinates,
            height: this.props.height,
            googleApiLoaded: false,
            selectedRoute: '',
            data: [],
            setCurrentLocation: this.props.setCurrentLocation
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

    _onChildClick: function(key, childProps) {
        console.log(childProps)
    },

    render: function() {

        const RenderBus = this.state.data.map((marker, index) => (
            <div lat={marker[0]}
                 lng={marker[1]}
                 key={marker[10]}
                 >
                <div className='pin'></div>
                <div className='pulse'></div>
            </div>
        ))

        return (
            <GoogleMap
                center={this.state.center}
                zoom={this.state.zoom}
                bootstrapURLKeys={{key: 'AIzaSyBHeZ1fjiNUfnqlurPslSwmnjquCd60wFU'}}
                center={this.state.center}
                zoom={this.state.zoom}
                onChildClick={this._onChildClick}
                options={createMapOptions}
                >

                <MyCurrentLocation setCurrentLocation={this.state.setCurrentLocation} lat={this.state.center.lat} lng={this.state.center.lng}>
                </MyCurrentLocation>

                {RenderBus}
            </GoogleMap>
        );
    },

})

export default MyGoogleMap;
