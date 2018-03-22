import React, { Component } from 'react'
import { player } from "../App";

export class Songposition extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            position: this.props.position
        }
    }

    render() {
        return (
            <div>
                <p>{this.props.position}</p>
                <p>{'Dauer ' + this.props.duration + ' ms __ Titel: ' + this.props.playing + ' __ Von: ' + this.props.artist }</p>
          
            </div>
        )
    }
}
