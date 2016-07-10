import React from 'react';
import GoogleMap from 'google-map-react';

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
            googleApiLoaded: false
        };
    },

    render: function() {
        const height = this.state.height || DEFAULT_HEIGHT;
        const ref = this.props.ref || DEFAULT_REF;
        return (
            <div style={{height: height}} id={this.props.id} ref={ref}>
                <GoogleMap
                    center={this.state.center}
                    zoom={this.state.zoom}
                    bootstrapURLKeys={{key: 'AIzaSyBHeZ1fjiNUfnqlurPslSwmnjquCd60wFU'}}
                    center={this.state.center}
                    zoom={this.state.zoom}
                    onGoogleApiLoaded={this.onGoogleApiLoaded}
                    yesIWantToUseGoogleMapApiInternals
                    options={this.props.options}>
                </GoogleMap>
            </div>
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

        extendCoordsBounds(this.state.coordinates.coords);

        map.fitBounds(bounds);
    }
})

export default MyGoogleMap;
