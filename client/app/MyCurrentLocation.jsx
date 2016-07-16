import React from 'react';

var MyCurrentLocation = React.createClass({

    render: function() {
        return (
            <div style={{
                position: 'absolute',
                width: 10,
                height: 10,
                left: -20 / 2,
                top: -20 / 2,
                border: '5px solid white',
                borderRadius: 20,
                backgroundColor: 'blue',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 'bold',
                padding: 4,
            }} lat={this.props.lat} lng={this.props.lng} >
            </div>
        );
    },

})

export default MyCurrentLocation;
