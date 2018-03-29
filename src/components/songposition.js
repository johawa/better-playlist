import React, { Component } from 'react'
import { player } from "../App";
import Slider from 'react-rangeslider'

export class Songposition extends Component {
    constructor(props, context) {
        super(props, context)

        this.state = {
            seeking: false,
            position: 0,
        }
    }

    componentWillReceiveProps() {
        this.updatePosition();
    }

    updatePosition() {
        if (!this.state.seeking) {
            this.setState({
                position: this.props.position
            })
        }
        else {
            null
        }
    }


    seekPosition = (value) => {
        console.log('seeking');
        this.setState({
            position: value,
            seeking: true
        })
    }

    putSeekedPosition = () => {
        const position = this.state.position
        player.seek(position).then(() => {
            console.log('Changed position!');
        }).then(this.setState({
            seeking: false,
        }));
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
