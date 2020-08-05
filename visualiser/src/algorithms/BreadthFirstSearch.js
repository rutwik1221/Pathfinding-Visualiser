export function BreadthFirstSearch(grid,startNode,endNode){
    let visitedNodesInOrder = [];
    let unvisitedNodes=[];
    startNode.isVisited=true;
    unvisitedNodes.push(startNode);

    while(unvisitedNodes.length>0){
        let currentNode = unvisitedNodes.shift();
        console.log(currentNode);
        visitedNodesInOrder.push(currentNode);
        if(currentNode===endNode){
            return {
				visitedOrder:visitedNodesInOrder,
				path:visitedNodesInOrder,
			};
        }
        currentNode.isVisited=true;
        unvisitedNodes.push(...getUnvisitedNeighbours(currentNode,grid));
        console.log("Current node:"+currentNode);     
    }
}
export function DepthFirstSearch(grid,startNode,endNode){
    let visitedNodesInOrder = [];
    let unvisitedNodes=[];
    startNode.isVisited=true;
    unvisitedNodes.unshift(startNode);
    while(unvisitedNodes.length>0){
        let currentNode = unvisitedNodes.shift();
        visitedNodesInOrder.push(currentNode);
        if(currentNode===endNode){
            return {
				visitedOrder:visitedNodesInOrder,
				path:visitedNodesInOrder,
			};
        }
        currentNode.isVisited=true;
        unvisitedNodes.unshift(...getUnvisitedNeighbours(currentNode,grid));     
    }
}
function getUnvisitedNeighbours(node, grid) {
    const neighbours = [];
    const {col, row} = node;
    if (row > 0){
        neighbours.push(grid[row - 1][col]);
    } 
    if (row < grid.length - 1){
        neighbours.push(grid[row + 1][col]);
    }
    if (col > 0){
        neighbours.push(grid[row][col - 1]);
    }
    if (col < grid[0].length - 1){
        neighbours.push(grid[row][col + 1]);
    }
    return neighbours.filter(neighbour => !neighbour.isVisited&&!neighbour.isWall);
}