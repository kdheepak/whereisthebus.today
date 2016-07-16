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

        var buses = []

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
