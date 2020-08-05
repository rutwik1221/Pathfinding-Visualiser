export function astar(grid, start, end) {
	if (start === end) {
    	return false;
	}
	let visitOrder=[];
	let openSet= new Set();
	openSet.add(start);
	let closedSet = new Set();
	let gCost = new Map();
	let hCost = new Map();
	let fCost = new Map();
	let prev = new Map();
	gCost.set(start,setgCost(start,start));
	hCost.set(start,sethCost(start,end));
	fCost.set(start,gCost.get(start) + hCost.get(start));

	while(openSet.size>0){
		let current = min(fCost,hCost);
		visitOrder.push(current);
		openSet.delete(current);
		closedSet.add(current);

    	if(current===end){
        	return {
				visitedOrder:visitOrder,
				path:path(end),
			};
    	}
		let neighbours = getNeighbours(current,grid);
		for(let node of neighbours){
			if(!closedSet.has(node)){
				/*if(!openSet.has(node)){
					gCost.set(node,setgCost(node,start));
					hCost.set(node,sethCost(node,end));
					fCost.set(node, gCost.get(node) + hCost.get(node));
					prev.set(node,current);
					if(!openSet.has(node))
						openSet.add(node);
				}*/
				var gScore = gCost.get(current)+1;
				var gBest=false;
				if(!openSet.has(node)){
					gBest=true;
					hCost.set(node,sethCost(node,end));
					openSet.add(node);
				}
				else if(gCost.has(node) && gScore<gCost.get(node)){
					gBest=true;
				}

				if(gBest){
					prev.set(node,current);
					gCost.set(node,gScore);
					fCost.set(node,gCost.get(node)+hCost.get(node));
				}
			}
		}
		fCost.delete(current);
	}
	console.log(prev);
	function path(node){
		let path=[];
		while(prev.has(node)){
			path.push(node);
			node=prev.get(node);
		}
		return path;
	}
	return {
		visitOrder:visitOrder,
		path:path(end),
	};
}
function setgCost(node,start){
	return manhattanDistance(node,start);
}
function sethCost(node,end){
	return manhattanDistance(node,end);
}
function min(fCost,hCost){
	let minKey, minVal=Infinity;
	let d = [];
	for(let [key,value] of fCost){
    	if(value<minVal){
        	minVal=value;
        	minKey=key;
		}
	}
	for(let [key,value] of fCost){
    	if(value===minVal){
        	d.push(key);
		}
	}
	minVal=Infinity;
	for(let i=0;i<d.length;d++){
		if(hCost.get(d[i])>minVal){
			minKey=d[i];
			minVal=hCost.get(d[i]);
		}
	}
    return minKey;
}

function getNeighbours(node, grid) {
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
    return neighbours.filter(neighbour => !neighbour.isWall);
}

function manhattanDistance(n1, n2) {
	let x=Math.abs(n2.row-n1.row);
	let y=Math.abs(n2.col-n1.col);
	return (x+y);
}
