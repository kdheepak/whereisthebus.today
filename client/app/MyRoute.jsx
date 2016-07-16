import React from 'react';

var MyRoute = React.createClass({

    getInitialState: function() {

        return({
            buses: []
        })

    },

    componentWillReceiveProps: function(nextProps) {
        try {
        } catch (e) {
            console.log(e)
        } finally {

        }

    },

    render: function() {

        try {
            var keys = [];
            for(var k in this.props.data.markers) keys.push(k);

            var buses = this.props.data.markers[keys[0]]
        } catch (e) {
            var buses = []
        } finally {
            console.log('Rendered')
        }
        var busRender =  buses.map(function(bus) {
                  console.log(bus)
                  return (
                    <div
                    lat={bus[0]} lng={bus[1]}>
                    </div>
                  );
                });

        return (
            <div>
            </div>
        );
    },

})

export default MyRoute;
