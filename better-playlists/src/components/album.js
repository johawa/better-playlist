import React from 'react';


export class Album extends React.Component {

  render() {
    return (
      <div>
        <h3>Album Names :</h3>
        <ul>
          {this.props.albumNames.map((alb, i) => <li key={i}> {alb} </li>)}
        </ul>
      </div>
    );
  }
}
