import React from 'react';


export class Scrollable extends React.Component {


  render() {
    
    const styleUl = {
      display: 'flex',
      position: 'relative',
      listStyleType: 'none',
      justifyContent: 'space-between',
    }

    const sytleLi = {
      border: 'solid 1px black',
      display: 'flex',
      alignItems: 'center',
      flexShrink: '0',
      justifyContent: 'center',
      margin: '5px',
      transform: 'rotateY(-20deg)',
      height: '25vw',
      width: '25vw',
    }

    return (
      <div id="scrollable">
        <ul style={styleUl} id="items">
          <li style={sytleLi}></li>
          <li style={sytleLi}></li>
          <li style={sytleLi}></li>
          <li style={sytleLi}></li>
          <li style={sytleLi}></li>
          <li style={sytleLi}></li>
          <li style={sytleLi}></li>
          <li style={sytleLi}></li>
          <li style={sytleLi}></li>
          <li style={sytleLi}></li>
        </ul>
      </div>
    );
  }
}