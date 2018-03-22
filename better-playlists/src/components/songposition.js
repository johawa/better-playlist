import React, { Component } from 'react'
import { player } from "../App";
import Slider from 'react-rangeslider'

export class Songposition extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            position: this.props.position
        }
    }

    seekPosition = () => {
        console.log('seeking');
    }


    render() {
        return (
            <div>
                <p>{this.props.position}</p>
                <p>{'Dauer ' + this.props.duration + ' ms __ Titel: ' + this.props.playing + ' __ Von: ' + this.props.artist}</p>
                <Slider
                    min={0}
                    max={this.props.duration}
                    value={this.props.position}
                    onChangeComplete={this.seekPosition}
                    orientation="horizontal"                    
                />
            </div>
        )
    }
}
