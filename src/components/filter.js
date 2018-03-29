import React from 'react';



export class Filter extends React.Component {
    render() {
      return (
        <div>
          <img />
          <input type="text" onKeyUp={event => this.props.onTextChange(event.target.value)} />
        </div>
      );
    }
  }