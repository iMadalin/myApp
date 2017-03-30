import React, { Component, PropTypes } from 'react';
import $ from 'jquery';

class OpenFileButton extends Component {
  componentDidMount() {
    $(document).ready(function(){
        $('#file_input').on('change', function(e){
            readFile(this.files[0], function(e) {
                $('#output_field').text(e.target.result);
            });
        });
    });

    function readFile(file, onLoadCallback){
        var reader = new FileReader();
        reader.onload = onLoadCallback;
        reader.readAsText(file);
    }
  }


    render (){

        return (
            <div>
            <input type="file" id="file_input"/>
            </div>
        )
    }
}

export default OpenFileButton;
