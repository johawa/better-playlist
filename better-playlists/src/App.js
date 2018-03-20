import React from 'react';
import queryString from 'query-string';

import { Album } from "./components/album";
import { Scrollable } from "./components/scrollable";
import { Searchform } from "./components/searchform";




class App extends React.Component {
  constructor() {
    super();
    this.state = {
      serverData: { email: null },
      filterString: 'oasis',
      albumNames: [],
    }
  }



  componentDidMount() {
    this.scrollAnimation();
    this.fetchEmail();
    this.initializeQuery();
    this.fetchAlbumData();
  }

  scrollAnimation() {
    const scrollable = document.getElementById("scrollable")
    const items = document.getElementById("items")
    //Scroll Animation
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
      const target = clicked.target;
      console.log(target);
      //getAlbumsNames();
      Array.from(items.children).forEach(item => {
        const cl = clicked.path[1];
        cl.style.transform = `rotateY(0deg)`;
      })
    })


  }

  fetchEmail() {
    const parsed = queryString.parse(window.location.search)
    const accessToken = parsed.access_token

    //Get Personal Data //Email,
    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    })
      .then(response => response.json())
      /*  .then(data => console.log(data)) */
      .then(data => this.setState({
        serverData: { email: data.email }
      }))
  }

  initializeQuery() {
    //Setting up query form and its eventlistener
    const searchForm = document.getElementById('search-form');

    searchForm.addEventListener('submit', event => {
      event.preventDefault();
      const value = document.getElementById('query').value;
      this.setState({ filterString: value })
      this.setState({ status: "1" })
      this.fetchAlbumData();
    }, false);


  }

  fetchAlbumData() {
    const Names = [];
    //Fetch Spotify Data   
    const parsed = queryString.parse(window.location.search)
    const accessToken = parsed.access_token
    const search = this.state.filterString

    fetch('https://api.spotify.com/v1/search?q=' + search + '&type=album', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    })
      .then(response => response.json())
      .then(data => {
        const uris = data.albums.items.map(item => {
          return item.id;
        }).slice(0, 10);

        const names = data.albums.items.map(item => {
          return item.name;
        }).slice(0, 10);


        Names.push(names);
        if (this.state.status === "1") {
          this.setState({
            albumNames: Names,
            status: "0"
          })
        }




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
  }


  render() {
    return (
      <div>
        <h3>Logged in as: {this.state.serverData.email}</h3>
        <Searchform />
        <Scrollable />
        <Album albumNames={this.state.albumNames} />
      </div>
    );
  }
}

export default App;


    /* 'https://api.spotify.com/v1/me' */
 /*   .then(data => this.setState({serverData: {email: data.email } })) */