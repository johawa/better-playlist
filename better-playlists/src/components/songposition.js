import React, { Component } from 'react'
import { player } from "../App";
import Slider from 'react-rangeslider'

export class Songposition extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            position: 0,
        }
    }

    componentWillReceiveProps() {
        this.setState({
            position: this.props.position
        })
    }

    seekPosition = (value) => {
        console.log('seeking');
        this.setState({
            position: value
        })
    }

    putSeekedPosition = () => {
        const position = this.state.position
        console.log(position)
        player.seek(position).then(() => {
            console.log('Changed position!');
        });
    }




    render() {

        const duration = this.props.duration
        return (

            <div>
                <p>{this.state.position}</p>
                <p>{'Dauer ' + this.props.duration + ' ms __ Titel: ' + this.props.playing + ' __ Von: ' + this.props.artist}</p>
                <Slider
                    min={0}
                    max={duration}
                    value={this.state.position}
                    onChange={this.seekPosition}
                    onChangeComplete={this.putSeekedPosition}
                    orientation="horizontal"
                />
            </div>
        )
    }
}
