installPlayer() {
    const parsed = queryString.parse(window.location.search)
    const token = parsed.access_token

    window.onSpotifyPlayerAPIReady = () => {
      let player = new window.Spotify.Player({
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
      player.on('player_state_changed', state => {
        console.log(state)
      });


      /*      player.pause().then(() => {
             console.log('Paused!');
           });
      */
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
      return player;
    }



    /*       const play = ({
            spotify_uri,
            playerInstance: {
              _options: {
                getOAuthToken,
                device_id
              }
            }
          }) => {
            getOAuthToken(token => {
              fetch('https://api.spotify.com/v1/me/player/play?device_id=' + device_id, {
                method: 'PUT',
                body: JSON.stringify({ uris: [spotify_uri] }),
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + token
                },
              });
            });
          };
    
          play({
            playerInstance: new window.Spotify.Player({ name: "..." }),
            spotify_uri: 'spotify:track:7xGfFoTpQ2E7fRF5lN10tr',
          }); */





  }
 
