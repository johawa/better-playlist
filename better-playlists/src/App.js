import React, { Component } from 'react';
import logo from './logo.svg';
import queryString from 'query-string';


let defaultStyle = {
  color: '#ffff'
}

class Aggregate extends Component {
  render() {
    return (
      <div style={{ ...defaultStyle, width: '40%', display: 'inline-block' }}>
        <h2>Number Text</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={{ ...defaultStyle }}>
        <img />
        <input type="text" />

      </div>
    );
  }
}


class Scrollable extends Component {
  render() {
    return (
      <div id="scrollable">
        <ul id="items">
          <li>A</li>
          <li>B</li>
          <li>C</li>
          <li>D</li>
          <li>E</li>
          <li>F</li>
          <li>G</li>
          <li>H</li>
          <li>I</li>
          <li>J</li>
          <li>K</li>
          <li>L</li>
          <li>M</li>
          <li>N</li>
          <li>O</li>
          <li>P</li>
          <li>Q</li>
          <li>R</li>
          <li>S</li>
          <li>T</li>
          <li>U</li>
          <li>V</li>
          <li>W</li>
          <li>X</li>
          <li>Y</li>
          <li>Z</li>
        </ul>
      </div>


    );




  }
}


class Album extends Component {
  render() {
    return (
      <div style={{ ...defaultStyle }}>
        <img />
        <h3>Album Name</h3>

      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: { email: null },
    }
  }
  componentDidMount() {
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token

    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json())
    /*   .then(data => this.setState({ serverData: { email: data.email } })) */

  }

  render() {
    let email = this.state.serverData.email 
    return (
      < div >
        <h1>{email}</h1>
        <Aggregate />
        <Aggregate />
        <Filter />
        <Scrollable />
        <Album />
      </div >
    );
  }
}

export default App;


