import React, {Component} from 'react';
import Node from "./Node/Node"
import "./pfv.css";
import {dijkstra} from"../algorithms/dijkstra.js"
import {astar} from"../algorithms/astar.js"
///import {BreadthFirstSearch,DepthFirstSearch} from "../algorithms/BreadthFirstSearch"

export default class PFV extends Component{
    static defaultProps = {
        nrows:Math.floor(0.80*window.innerHeight/25),
        ncols:Math.floor(0.9*window.innerWidth/25),
    }
    constructor(props){
        super(props);
        this.state={
            grid: [],
            isMouseDown : false,
            movingStart : false,
            movingEnd   : false,
            algo:"Dijkstra's",
            done:false,
            START_NODE_ROW : Math.floor(this.props.nrows/2),
            START_NODE_COL : Math.floor(this.props.ncols/4),
            END_NODE_ROW : Math.floor(this.props.nrows/2),
            END_NODE_COL : Math.floor(3*this.props.ncols/4),
        };
        this.visualize=this.visualize.bind(this);
        this.clearGrid=this.clearGrid.bind(this);
        this.clearWalls=this.clearWalls.bind(this);
    }
    
    componentDidMount(){
        const grid=this.getGrid();
        this.setState({grid});
    }
    createNode(col,row){
        let is= row === this.state.START_NODE_ROW && col===  this.state.START_NODE_COL;
        let ie = row === this.state.END_NODE_ROW   && col === this.state.END_NODE_COL;
        return{
            col,
            row,
            isStart:is,
            isEnd:  ie,
            distance: Infinity,
            isVisited: false,
            isWall: false,
            previousNode: null,            
        };
    }
    getGrid() {
        alert("Instructions! \nDrag the cursor to create walls, then pick an algorithm to visualise.\nDrag the nodes to reposition them.");
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
    clearGrid(){
        const {grid}=this.state;
        for(let row=0;row<this.props.nrows;row++){
            for(let col=0;col<this.props.ncols;col++){
                if(!grid[row][col].isWall){
                    if(grid[row][col].isStart){
                        document.getElementById(`${row}-${col}`).className ='node node-start';
                    }
                    else if(grid[row][col].isEnd){
                        document.getElementById(`${row}-${col}`).className ='node node-end';
                    }
                    else{ 
                        document.getElementById(`${row}-${col}`).className ='node';
                    }
                }
                else{
                    document.getElementById(`${row}-${col}`).className ='node node-wall';
                }
                grid[row][col].isVisited=false;
            }
        }
        this.setState({grid:grid});
    }
    clearWalls(){
        const {grid}=this.state;
        for(let row=0;row<this.props.nrows;row++){
            for(let col=0;col<this.props.ncols;col++){
                if(grid[row][col].isWall){
                    grid[row][col].isWall=false;
                }
            }
        }
        this.setState({grid:grid});
    }
    visualize(){
        this.clearGrid();
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
        console.log(result.visitedOrder)
        console.log(result.path)
        if(result.path.length>1)
            animateVisitOrder(result.visitedOrder,result.path);
        else{
            alert("No path exits!");
        }
        this.setState({done:true})
    }
    async quickVisualize(){
        if(!this.state.done)
            return;
        this.clearGrid();
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
        if(result.path.length>1)
            quickAnimateVisitOrder(result.visitedOrder,result.path);
        else{
            alert("No path exits!");
        }
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
    toggleStart(row, col){
        const newgrid = this.state.grid;
        const node = newgrid[row][col];
        const newnode = {
            ...node,
            isStart:!node.isStart,
            isWall:false,
        }
        newgrid[node.row][node.col]=newnode;
        this.setState({
            grid:newgrid,
            START_NODE_ROW : row,
            START_NODE_COL : col,
        });
    }
    toggleEnd(row, col){
        const newgrid = this.state.grid;
        const node = newgrid[row][col];
        const newnode = {
            ...node,
            isEnd:!node.isEnd,
            isWall:false,
        }
        newgrid[node.row][node.col]=newnode;
        this.setState({
            grid:newgrid,
            END_NODE_ROW : row,
            END_NODE_COL : col,
        });
        
    }
    handleMouseDown(row, col) {
        if(this.state.grid[row][col].isStart===true){
            this.setState({movingStart:true});
        }
        else if(this.state.grid[row][col].isEnd===true){
            this.setState({movingEnd:true});
        }
        else if(!this.state.isMouseDown){
            this.setState({isMouseDown:true});
            this.toggleWall(row, col);
        }
    }
    handleMouseEnter(row, col) {
        if(this.state.movingStart){
            this.toggleStart(row, col);

        }
        else if(this.state.movingEnd){
            this.toggleEnd(row, col);

        }
        else if(this.state.isMouseDown)
            this.toggleWall(row, col);
    }
    handleMouseOut(row, col) {
        if(this.state.movingStart){
            this.toggleStart(row, col);
        }
        else if(this.state.movingEnd){
            this.toggleEnd(row, col);
        }   
    }
    async handleMouseUp(){
        if(this.state.movingEnd){
            await this.quickVisualize();
        }
        if(this.state.movingStart){
            await this.quickVisualize();
        }
        this.setState({isMouseDown:false});
        this.setState({movingEnd:false});
        this.setState({movingStart:false});
    }     
    render(){
        const {grid} = this.state;
        return(
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <a 
                        href="/" 
                        className="navbar-brand"
                    > 
                        Pathfinding Visualiser
                    </a>
                    <span className="nav-item dropdown rounded" style={{color:"#ffffff"}}>
                        <span className="nav-link dropdown-toggle"  id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Algorithms
                        </span>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <span className="dropdown-item" onClick={()=>this.setState({algo:"Dijkstra's"})}>Dijkstra's Algorithm</span>
                            <span className="dropdown-item" onClick={()=>this.setState({algo:"A*"})}>A* Algorithm</span>
                        </div>
                    </span>
                    <button 
                        className="btn "
                        style={{color:"#ffffff"}}
                        onClick={this.visualize}
                    >
                        Visualize {this.state.algo} Algorithm
                    </button>
                    <button 
                        className="btn"
                        style={{color:"#ffffff"}} 
                        onClick={this.clearWalls}
                    >
                        Clear Walls
                    </button>                    
                </nav>
                <div className = "text-center font-weight-bold" style={{height:"7vh",fontSize:"1.5rem"}}>
                    Pick an algorithm and visualise it!
                </div>
                <table className="grid align-middle" >
                    <tbody>
                    {grid.map((row,rowIdx)=>{
                        return (
                            <tr className='row flex-row' key ={rowIdx} >
                                {row.map((node,nodeIdx)=>{
                                    return (
                                        <Node
                                            key = {`${rowIdx}-${nodeIdx}`}
                                            {...node}
                                            onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                            onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                            onMouseOut={(row, col) => this.handleMouseOut(row, col)}
                                            onMouseUp={() => this.handleMouseUp()}
                                        />
                                    );
                                })}
                            </tr>
                        ); 
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}

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
function quickAnimateVisitOrder(visitedOrder, path) {
    for (let i = 0; i <= visitedOrder.length; i++) {
      if (i === visitedOrder.length) {
        setTimeout(() => {
            quickAnimatePath(path);
        }, 0 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedOrder[i];
        document.getElementById(`${node.row}-${node.col}`).className ='node node-visited-quick';
      }, 0 * i);
    }
}
function quickAnimatePath(path) {
    for (let i = 0; i < path.length; i++) {
      setTimeout(() => {
        const node = path[i];
        document.getElementById(`${node.row}-${node.col}`).className =
          'node node-shortest-path-quick';
      }, 0 * i);
    }
}
function randomMaze(grid){
    console.log("HEllo")
    let newGrid=grid;
    for(let row of newGrid){
        for(let node of row){
            node.isWall=false;
            if(!(node.isStart||node.isEnd)){
                node.isWall = (Math.random()>0.6);
            }
        }
    }
    console.log(newGrid)
    return newGrid
}