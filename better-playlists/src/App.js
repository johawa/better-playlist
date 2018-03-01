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
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>    
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>           
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


    fetch('https://api.spotify.com/v1/search?q=michael+jackson&type=album', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    })
      .then(response => response.json())
      .then(data => {
        const uris = data.albums.items.map(item => {
          return item.id;
        }).slice(0, 10);
        const tasks = uris.map(id => fetch('https://api.spotify.com/v1/albums/' + id, {
          headers: { 'Authorization': 'Bearer ' + accessToken }
        }))
        return Promise.all(tasks);
      })
      .then(responses => Promise.all(responses.map(r => r.json())))
      .then(albums => Promise.all(albums.map(album => fetch(album.images[0].url))))
      .then(responses => Promise.all(responses.map(r => r.blob())))
      .then(blobs => blobs.map(blob => URL.createObjectURL(blob)))
      .then(urls => {
        return Promise.all(urls.map(url => {
          return new Promise(resolve => {
            const image = new Image();
            image.addEventListener('load', () => {
              resolve(image);
            });
            image.src = url;
          })
        }));
      })
      .then(images => {
        let imgArr = [];
        images.forEach(image => {
          imgArr.push(image.outerHTML);
        });
        const ul = document.getElementById("items");
        const li = Array.from(ul.children);
        for (let i = 0; i < li.length; i++) {
          li[i].style.zIndex = [i]*-1;
          li[i].innerHTML = imgArr[i];
        };
      });








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


    /* 'https://api.spotify.com/v1/me' */
 /*   .then(data => this.setState({serverData: {email: data.email } })) */