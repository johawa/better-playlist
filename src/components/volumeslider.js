import React, { Component } from 'react'
import Slider from 'react-rangeslider'
import { player } from "../App";

export class Volumeslider extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      volume: 0
    }
  }


  handleVolume = (value) => {
    this.setState({
      volume: value
    })
    const vol = this.state.volume / 100;
    player.setVolume(vol).then(() => {
      console.log('Volume updated to: ', Math.round(vol*100));
    });    
  }

  render() {
    const { volume } = this.state
    return (
      <Slider
        value={volume}
        orientation="horizontal"
        onChange={this.handleVolume}
      />
    )
  }
}



