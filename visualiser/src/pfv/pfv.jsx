import React, {Component} from 'react';
import Node from "./Node/Node"
import Nav from "./Navbar" 
import "./pfv.css";
import {dijkstra} from"../algorithms/dijkstra.js"
import {astar} from"../algorithms/astar.js"
import {BreadthFirstSearch,DepthFirstSearch} from "../algorithms/BreadthFirstSearch"

export default class PFV extends Component{
    static defaultProps = {
        nrows:20,
        ncols:50,
    }
    constructor(props){
        super(props);
        this.state={
            grid: [],
            isMouseDown : false,
            algo:"Dijkstra's",
            START_NODE_ROW : this.props.nrows/2,
            START_NODE_COL : Math.floor(this.props.ncols/4),
            END_NODE_ROW : this.props.nrows/2,
            END_NODE_COL : Math.floor(3*this.props.ncols/4),
        };
        this.visualize=this.visualize.bind(this);
        this.clearVisited=this.clearVisited.bind(this);
    }
    
    componentDidMount(){
        const grid=this.getGrid();
        this.setState({grid});
    }
    createNode(col,row){
        return{
            col,
            row,
            isStart:row === this.state.START_NODE_ROW && col===  this.state.START_NODE_COL,
            isEnd:  row === this.state.END_NODE_ROW   && col === this.state.END_NODE_COL,
            distance: Infinity,
            isVisited: false,
            isWall: false,
            previousNode: null,
        };
    }
    getGrid() {
        const grid = [];
        for(let row=0;row<this.props.nrows;row++){
            const currentRow = [];
            for(let col=0;col<this.props.ncols;col++){
                currentRow.push(this.createNode(col,row));
            }
            grid.push(currentRow);
        }
        return grid;
    }
    clearVisited(){
        const {grid}=this.state;
        for(let row=0;row<this.props.nrows;row++){
            for(let col=0;col<this.props.ncols;col++){
                if(!grid[row][col].isWall){
                    if(grid[row][col].isStart){
                        document.getElementById(`${row}-${col}`).className ='node-start';
                    }
                    else if(grid[row][col].isEnd){
                        document.getElementById(`${row}-${col}`).className ='node-end';
                    }
                    else{ 
                        document.getElementById(`${row}-${col}`).className ='node';
                    }
                }
                grid[row][col].isVisited=false;
            }
        }
        this.setState({grid:grid});
    }

    visualize(){
        this.clearVisited();
        const {grid} = this.state;
        const startNode = grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];
        const endNode = grid[this.state.END_NODE_ROW][this.state.END_NODE_COL];
        let result;
        if(this.state.algo === "Dijkstra's"){
            result = dijkstra(grid, startNode, endNode);

        }
        else if(this.state.algo === "A*"){
            result = astar(grid, startNode, endNode);
        }
        else if(this.state.algo === "BreadthFirstSearch"){
            result = BreadthFirstSearch(grid, startNode, endNode);
        }
        else if(this.state.algo === "DepthFirstSearch"){
            result = DepthFirstSearch(grid, startNode, endNode);
        }
        animateVisitOrder(result.visitedOrder,result.path);
    }

    toggleWall(row, col){
        const newgrid = this.state.grid;
        const node = newgrid[row][col];
        const newnode = {
            ...node,
            isWall:!node.isWall,
        }
        newgrid[node.row][node.col]=newnode;
        this.setState({grid:newgrid});
    }
    handleMouseDown(row, col) {
        if(!this.state.isMouseDown)
            this.setState({isMouseDown:true});
        this.toggleWall(row, col);
    }
    handleMouseEnter(row, col) {
        if(this.state.isMouseDown)
            this.toggleWall(row, col);
    }
    handleMouseUp(){
        this.setState({isMouseDown:false});
    }     
    render(){
        const {grid} = this.state;
        return(
            <>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a 
                        href="#" 
                        className="navbar-brand"
                    > 
                        Pathfinding Visualiser
                    </a>
                    <button 
                        className="btn btn-success" 
                        onClick={this.visualize}
                    >
                        Visualize {this.state.algo} Algorithm
                    </button>
                    <button 
                        className="btn btn-secondary" 
                        onClick={this.clearVisited}
                    >
                        Refresh
                    </button>
                    <li className="nav-item dropdown">
                        <span className="nav-link dropdown-toggle"  id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {this.state.algo}
                        </span>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <span className="dropdown-item" onClick={()=>this.setState({algo:"Dijkstra's"})}>Dijkstra's Algorithm</span>
                            <span className="dropdown-item" onClick={()=>this.setState({algo:"A*"})}>A* Algorithm</span>
                            <span className="dropdown-item" onClick={()=>this.setState({algo:"BreadthFirstSearch"})}>BreadthFirstSearch Algorithm</span>
                            <span className="dropdown-item" onClick={()=>this.setState({algo:"DepthFirstSearch"})}>DepthFirstSearch Algorithm</span>
                        </div>
                    </li>
                </nav>
                <table className="grid">
                    <tbody>
                    {grid.map((row,rowIdx)=>{
                        return (
                            <tr className='row' key ={rowIdx} >
                                {row.map((node,nodeIdx)=>{
                                    return (
                                        <Node
                                            key = {`${rowIdx}-${nodeIdx}`}
                                            {...node}
                                            onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                            onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                            onMouseUp={() => this.handleMouseUp()}
                                        />
                                    );
                                })}
                            </tr>
                        ); 
                    })}
                    </tbody>
                </table>
            </>
        );
    }
}


/*function createNode(col,row){
    return{
        col,
        row,
        isStart:row === START_NODE_ROW && col===START_NODE_COL,
        isEnd: row === END_NODE_ROW && col === END_NODE_COL,
        distance: Infinity,
        totalDistance:Infinity,
        heuristicDistance:null,
        direction:null,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
}*/
function animateVisitOrder(visitedOrder, path) {
    for (let i = 0; i <= visitedOrder.length; i++) {
      if (i === visitedOrder.length) {
        setTimeout(() => {
          animatePath(path);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedOrder[i];
        document.getElementById(`${node.row}-${node.col}`).className ='node node-visited';
      }, 10 * i);
    }
}
function animatePath(path) {
    for (let i = 0; i < path.length; i++) {
      setTimeout(() => {
        const node = path[i];
        document.getElementById(`${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
}