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
        <input type="text" onKeyUp={event => this.props.onTextChange(event.target.value)} />
      </div>
    );
  }
}

class Search extends Component {
  render() {
    return (
      <form id="search-form">
        <input type="text" id="query" value="" class="form-control" placeholder="Type an Artist Name" />
        <input type="submit" id="search" class="btn btn-primary" value="Search" />
      </form>
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
      filterString: 'oasis',
      albumNames: []

    }
  }


  componentDidMount() {



    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token

    //Scroll Animation

    let scrollable = document.getElementById("scrollable")
    let items = document.getElementById("items")

    function scrollMiddleWare(inertia = 0.8) {
      const delta = {
        x: null,
      }
      const abs = {
        x: 0,
        y: 0,
      }

      return function onScroll(callback) {

        function notify() {
          abs.x += delta.x;
          callback({ abs, delta });
        }

        let requestId;

        function start() {
          requestId = requestAnimationFrame(update);
        }

        function update() {
          delta.x *= inertia;
          notify();
          start();
        }

        function stop() {
          cancelAnimationFrame(requestId);
          requestId = null;
        }

        let prevEvent;

        return function eventHandler(event) {
          event.preventDefault();
          if (prevEvent && event.buttons === 1) {
            delta.x = event.clientX - prevEvent.clientX;
            stop();
            notify();
          }

          if (requestId === null && event.buttons === 0) {
            start();
          }
          prevEvent = event;
        }
      }
    }

    scrollable.addEventListener('mousemove',
      scrollMiddleWare(.89)((scroll) => {
        items.style.left = `${scroll.abs.x}px`;
      }));


    items.addEventListener('click', clicked => {
      Array.from(items.children).forEach(item => {
        const cl = clicked.path[1];
        cl.style.transform = `rotateY(0deg)`;
      })
    })


    //Get Email Name 

    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    })
      .then(response => response.json())
      /*  .then(data => console.log(data)) */
      .then(data => this.setState({ serverData: { email: data.email } }))


    fetch('https://api.spotify.com/v1/search?q=oasis&type=album', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    })
      .then(response => response.json())
      .then(data => {
        const names = data.albums.items;
        console.log(names);
      })












  }

  render() {
    let email = this.state.serverData.email


    //Fetch Spotify Data   
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token
    let search = this.state.filterString

    fetch('https://api.spotify.com/v1/search?q=' + search + '&type=album', {
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
          li[i].style.zIndex = 100 + ([i] * -1);
          li[i].innerHTML = imgArr[i];
        };
      });




    return (
      < div >
        <h1>{email}</h1>
        <h2>{search}</h2>
        <Aggregate />
        <Aggregate />

        <Filter onTextChange={text =>
          this.setState({ filterString: text },
          )} />

        <Scrollable/>
        <Search/>
        <Album />
      </div >
    );
  }
}

export default App;


    /* 'https://api.spotify.com/v1/me' */
 /*   .then(data => this.setState({serverData: {email: data.email } })) */