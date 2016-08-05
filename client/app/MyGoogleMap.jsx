import React from 'react';
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";
const Loading = require('react-loading-animation');

import MyCurrentLocation from './MyCurrentLocation.jsx';
import MyRoute from './MyRoute.jsx';

const DEFAULT_REF = 'map';
const DEFAULT_HEIGHT = '100%';

const image = new google.maps.MarkerImage(
    '/static/img/bus.png',
    null,
    null,
    null,
    new google.maps.Size(32, 32)
)


class MyGoogleMap extends React.Component {
    constructor(props, context) {
        super(props, context);

        // initial state
        this.state = {
            routes: this.props.routes,
            zoom: 14,
            coords: {
              lat: 39.7433,
              lng: -104.9891
          },
            loading: false
        };
}

  render() {
        return <div className="GMap" style={{width: '100%', height: '95vh'}}>
            <Loading isLoading={this.state.loading}></Loading>
            <div className='GMap-canvas' ref="mapCanvas" style={{width: '100%', height: '95vh'}}>
            </div>
        </div>
}

componentDidMount() {
  // create the map, marker and infoWindow after the component has
  // been rendered because we need to manipulate the DOM for Google =(
    this.map = this.createMap()

  // have to define google maps event listeners here too
  // because we can't add listeners on the map until its created
    google.maps.event.addListener(this.map, 'zoom_changed', ()=> this.handleZoomChange())


    navigator.geolocation.getCurrentPosition(function(loc) {
        this.setState({
            coords: {
                lat: loc.coords.latitude,
                lng: loc.coords.longitude,
                acc: loc.coords.accuracy
            }
        })
    }.bind(this));

    this.minimum_lat = this.state.lat;
    this.minimum_lng = this.state.lng;

    fetch('/api/markers/'+this.props.routes)
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

}

componentWillUpdate(nextProps, nextState) {

    this.bounds = new google.maps.LatLngBounds();

    if( !(this.state.data === nextState.data) ) {
        for (var i = 0; i < nextState.data.length; i++) {
          var bus = nextState.data[i];
          var marker = new google.maps.Marker({
            position: {lat: bus[0], lng: bus[1]},
            map: this.map,
            title: bus[2],
            icon: image,
            optimized: false,
          });

          this.bounds.extend(new google.maps.LatLng(bus[0], bus[1]));

      }
        this.map.fitBounds(this.bounds);

    }

    if ( !( (nextState.coords.lat === this.state.coords.lat) && (nextState.coords.lng === this.state.coords.lng) ) ) {
        // Location has changed
        try {
            this.marker.setMap(null)
        }
        catch(err) {
            console.log('Marker does not exist')
        }

        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(nextState.coords.lat, nextState.coords.lng),
            animation: google.maps.Animation.DROP,
            map: this.map
        })

        this.map.setCenter(new google.maps.LatLng(nextState.coords.lat, nextState.coords.lng));

        this.bounds.extend(new google.maps.LatLng(nextState.coords.lat, nextState.coords.lng));

    }

    if( !(this.props.routes === nextProps.routes) ) {
        // selectedRoute has changed

        this.setState({
            loading: true
        })

        fetch('/api/markers/'+nextProps.routes)
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
                    data: buses,
                    loading: false
                })

          }.bind(this)).catch(function(ex) {
              console.log('parsing failed', ex);
          })


    }

}


// clean up event listeners when component unmounts
componentDidUnMount() {
  google.maps.event.clearListeners(map, 'zoom_changed')
}

createMap() {
  let mapOptions = {
    zoom: this.state.zoom,
    center: new google.maps.LatLng(this.state.coords.lat, this.state.coords.lng),
  }
  return new google.maps.Map(this.refs.mapCanvas, mapOptions)
}

handleZoomChange() {
  this.setState({
    zoom: this.map.getZoom()
  })
}

}

export default MyGoogleMap;
