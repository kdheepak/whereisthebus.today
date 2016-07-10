import React from 'react';
import Select from 'react-select';

var options = [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' }
];

const getOptions = (input) => {
  return fetch('/api/routes')
    .then((response) => {
      return response.json();
    }).then((json) => {
        console.log('getting data')
      return { options: json };
    });
}


var MyDropdownList = React.createClass({

    componentDidMount : function() {

      fetch('/api/routes')
          .then(function(response) {
            return response.json()
          }.bind(this)).then(function(json) {
            this.setState({
                'options': json,
            })
             console.log('parsed json', json)
          }.bind(this)).catch(function(ex) {
              console.log('parsing failed', ex);
          })

    }, 

    getInitialState : function() {
        return {
            options: options
        }
    },

    logChange : function (val) {
    console.log("Selected: " + val);
    },

    render : function () {
    return (
        <Select
            name="form-field-name"
            value="one"
            options={this.state.options}
            onChange={this.logChange}
        /> 
        );
    },

});

export default MyDropdownList;
