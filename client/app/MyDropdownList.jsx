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

    logChange : function (val) {
    console.log("Selected: " + val);
    },

    render : function () {
    return (
        <Select
            name="form-field-name"
            value="one"
            options={options}
            loadOptions={getOptions}
            onChange={this.logChange}
        /> 
        );
    },

});

export default MyDropdownList;
