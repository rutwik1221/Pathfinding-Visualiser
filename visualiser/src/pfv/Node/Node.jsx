import React, { Component } from 'react';
import "./Node.css";

export default class node extends Component{
    render(){
        const extraclassName = this.props.isEnd? 'node-end': this.props.isStart? 'node-start': this.props.isWall?'node-wall':'';
        return <td 
        id={`${this.props.row}-${this.props.col}`}
        className={`node ${extraclassName}`}
        onMouseDown={() => this.props.onMouseDown(this.props.row, this.props.col)}
        onMouseEnter={() => this.props.onMouseEnter(this.props.row, this.props.col)}
        onMouseUp={() => this.props.onMouseUp(this.props.row, this.props.col)}
        />
    }
}