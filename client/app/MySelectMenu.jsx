import React from 'react';

var MySelectMenu = React.createClass({
    render: function() {

        var optionRender = this.props.routeOptions.map(function(opt) {
              return (
                <option key={opt.value} value={opt.value}>
                    {opt.value}
                </option>
              );
            });


        return (
          <div>
              <select className="selectpicker"
                        data-live-search="true"
                        id='routename'
                        onChange={this.props.onChange}
                        data-width="100%"
                        title="Select Bus Route..."
                        >
                    {optionRender}
              </select>
          </div>
        );
    },

})

export default MySelectMenu;
