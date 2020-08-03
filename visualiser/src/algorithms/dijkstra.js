export function dijkstra(grid,startNode,endNode){
    let visitedNodesInOrder = [];
    startNode.distance = 0;
    let unvisitedNodes=getNodes(grid);
    while(unvisitedNodes.length>0){
        unvisitedNodes.sort((a,b) => a.distance - b.distance);
        const closestNode = unvisitedNodes.shift();
        if(closestNode.distance=== Infinity){
            return {
				visitedOrder:visitedNodesInOrder,
				path:shortestPath(endNode),
			};
        }
        closestNode.isVisited=true;
        visitedNodesInOrder.push(closestNode);
        if(closestNode===endNode){
            return {
				visitedOrder:visitedNodesInOrder,
				path:shortestPath(endNode),
			};
        }
        updateUnvisitedNeighbours(closestNode,grid);
    }
}
function updateUnvisitedNeighbours(node, grid) {
    const unvisitedNeighbours = getUnvisitedNeighbours(node, grid);
    for (const neighbour of unvisitedNeighbours) {
      neighbour.distance = node.distance + 1;
      neighbour.previousNode = node;
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

function getNodes(grid){
   let nodes = [];
    for(const row of grid){
        for(const node of row){
            if(!node.isWall){
                nodes.push(node);
            }
        }
    }
    return nodes;
}

export function shortestPath(endNode){
    const path = [];
    while(endNode!==null){
        path.unshift(endNode);
        endNode = endNode.previousNode;
    }
    return path;
}