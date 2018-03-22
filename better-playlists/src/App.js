import React from 'react';
import queryString from 'query-string';



import { Album } from "./components/album";
import { Scrollable } from "./components/scrollable";
import { Searchform } from "./components/searchform";
import { Playbutton } from "./components/playbutton";
import { Volumeslider } from "./components/volumeslider";
import { Songposition } from "./components/songposition";

let player;


class App extends React.Component {
  constructor() {
    super();
    this.startInterval = this.startInterval.bind(this);
    this.state = {
      serverData: { email: null },
      filterString: 'oasis',
      albumNames: [],
      albumTracks: [],
      playing: false,
      device_id: null,
      volume: 0,
      song_duration: 0,
      actual_song: '',
      actual_song_artist: '',
      actual_song_position: 0,
      timer_runnig: false,   
    }
  }

  componentWillMount() {
    this.installPlayer();
  }

  componentDidMount() {
    this.scrollAnimation();
    this.fetchEmail();
    this.initializeQuery();
    this.fetchAlbumData();
    this.playbutton();
  }

  /*  componentWillUnmount() {
     clearInterval(this.getTitlePosition);
   } */

  installPlayer() {
    const parsed = queryString.parse(window.location.search)
    const token = parsed.access_token

    window.onSpotifyPlayerAPIReady = () => {
      player = new window.Spotify.Player({
        name: 'Cover Flow WebApp for Spotify',
        getOAuthToken: cb => {
          cb(token);
        }
      });


      // Error handling
      player.on('initialization_error', e => console.error(e));
      player.on('authentication_error', e => console.error(e));
      player.on('account_error', e => console.error(e));
      player.on('playerback_error', e => console.error(e));

      // playerback status updates
      /*   player.on('player_state_changed', state => {
          console.log(state)
        }); */


      // Ready
      player.on('ready', data => {
        console.log('Ready with Device ID', data.device_id);
        //set device-id to state
        this.setState({
          device_id: data.device_id
        })
      });

      // Connect to the player!
      player.connect().then(success => {
        if (success) {
          console.log('The Web Playback SDK successfully connected to Spotify!');
        }
      });
    }
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



        if (this.state.status === "1") {
          this.setState({
            albumNames: names,
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
    this.getAlbumTracks();
  }

  getAlbumTracks() {  //aufräumen !
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

        const tasks = uris.map(id => fetch('https://api.spotify.com/v1/albums/' + id + '/tracks', {
          headers: { 'Authorization': 'Bearer ' + accessToken }
        }))
        return Promise.all(tasks);
      })
      .then(responses => Promise.all(responses.map(r => r.json())))
      .then(albums => Promise.all(albums.map(album => album.items[0].uri)))
      .then(ids => {
        this.setState({
          albumTracks: ids
        })
      })
  }

  playbutton() {
    const btn = document.getElementById('playbutton');
    btn.addEventListener('click', event => {
      if (!this.state.playing) {
        btn.innerHTML = 'Pause!'
        this.playSong();
      }
      else if (this.state.playing) {
        btn.innerHTML = 'Play!'
        this.stopSong();
      }
    })
  }

  playSong() {
    const device_id = this.state.device_id;
    const parsed = queryString.parse(window.location.search)
    const token = parsed.access_token
    const spotify_uri = 'spotify:track:4JXbqyToOByvYQjzKAflX9'
    /*  const test = this.state.albumTracks.map(track => JSON.stringify({ uris: [track] }))
     console.log(test); */


    fetch("https://api.spotify.com/v1/me/player/play?device_id=" + device_id, {
      headers: { 'Authorization': 'Bearer ' + token },
      method: 'PUT',
      body: JSON.stringify({ uris: [spotify_uri] }),
    }).then(data => console.log(data))

    this.setState({
      playing: true,
      timer_runnig: true
    })
    this.getVolume();
    this.getTitleInfos();
    this.startInterval();
  }

  stopSong() {
    player.togglePlay().then(() => {
      this.setState({
        playing: false,
        timer_runnig: false
      })
    }).then(this.stopInterval())
  }

  getVolume() {
    player.getVolume().then(volume => {
      const volume_percentage = volume;
      this.setState({
        volume: volume_percentage
      })
    });
  }

  getTitleInfos() {
    player.addListener('player_state_changed', ({
      position,
      duration,
      track_window: { current_track }
    }) => {
      this.setState({
        song_duration: duration,
        actual_song: current_track.name,
        actual_song_artist: current_track.artists["0"].name,
      })
    });
  }

  startInterval() {
    this.Interval = setInterval(() => {
      console.log('tick');
    }, 1000);
  }

  stopInterval() {
    clearInterval(this.Interval);
  }

  render() {
    return (
      <div>
        <h3>Logged in as: {this.state.serverData.email}</h3>
        <Searchform />
        <Playbutton />
        <Songposition duration={this.state.song_duration} playing={this.state.actual_song} artist={this.state.actual_song_artist} position={this.state.actual_song_position} />
        <Volumeslider volume_start={this.state.volume} />
        <Scrollable />
        <Album albumNames={this.state.albumNames} />
      </div>
    );
  }
}

export default App;
export { player }



        /* 'https://api.spotify.com/v1/me' */
 /*   .then(data => this.setState({serverData: {email: data.email } })) */