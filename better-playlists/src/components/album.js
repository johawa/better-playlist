import React from 'react';


export class Album extends React.Component {

  render() {
    const albumNames = this.props.albumNames
    return (
      <div>
        <h3>Album Names :</h3>
        
        {albumNames.map((x, i) => <p key={i}>{x}<br/></p>)}
      </div>
    );
  }
}
