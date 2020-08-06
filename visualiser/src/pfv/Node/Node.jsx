import React, { Component } from 'react';
import "./Node.css";

export default class node extends Component{
    render(){
        const extraclassName = this.props.isEnd? 'node-end': this.props.isStart? 'node-start': this.props.isWall?'node-wall':'';            
        const svgStart = this.props.isStart? "visible" : "hidden";
        const svgEnd = this.props.isEnd? "visible" : "hidden";
        return <td 
        id={`${this.props.row}-${this.props.col}`}
        className={`node ${extraclassName}`}
        onMouseDown={() => this.props.onMouseDown(this.props.row, this.props.col)}
        onMouseEnter={() => this.props.onMouseEnter(this.props.row, this.props.col)}
        onMouseOut={() => this.props.onMouseOut(this.props.row, this.props.col)}
        onMouseUp={() => this.props.onMouseUp(this.props.row, this.props.col)}
        >
            <svg visibility={svgStart} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 8c1.86.5 4 .83 6 1v13h2v-6h2v6h2V9c2-.17 4.14-.5 6-1l-.5-2zM12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
            </svg>
            <svg className="end-svg" visibility={svgEnd} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
        </td>
    }
}