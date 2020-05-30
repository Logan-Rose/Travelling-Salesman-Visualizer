let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');
let styles = getComputedStyle(canvas),
w = parseInt(styles.getPropertyValue("width"), 10),
h = parseInt(styles.getPropertyValue("height"), 10);
let frame;
let WIDTH = w;
let HEIGHT = h;
let RADIUS = 7;
let mouseDown = false;
let changed = true

canvas.width = WIDTH;
canvas.height = HEIGHT;

//Objects

class Circle{
    constructor(x, y, rad){
        this.x = x;
        this.y = y;
        this.rad = rad;
    }
    draw(){
        context.beginPath();
        context.arc(this.x,this.y, this.rad,0,Math.PI*2, false);
        context.strokeStyle = 'red';
        context.stroke();
        context.fill();
        context.fillStyle='red';
        context.font = "16px Arial";
    }
    getX(){ return this.x }

    getY(){ return this.y }
}
let circles = []

class Line{
    constructor(start, end){
        this.start = start;
        this.end = end;
        this.length = Math.round(Math.sqrt(Math.pow((this.start.getX() - this.end.getX()), 2) + Math.pow((this.start.getY() - this.end.getY()), 2)));
    }
    draw(val){
        context.beginPath();
        context.moveTo(this.start.x, this.start.y);
        context.lineTo(this.end.x, this.end.y);
        context.strokeStyle = "black";
        context.lineWidth = 3;
        context.stroke();
        context.fillStyle = "red";
        
        if(this.length !=0){
            context.fillText(this.length, (this.end.getX() + this.start.getX() )/2 +20, (this.end.getY() + this.start.getY())/2 + 20); 
        }  
    }

    getStart(){ return this.start }

    getEnd(){ return this.end }

}

let lines = [];

let nearest = -1;

//Event Listeners

//Button listners
let solveButton = document.getElementById("solve");
solveButton.addEventListener('click',
    function(){
        if(draw ===false){
            draw = true;
        } else{
            draw =false;
        }
    }
)
let clearButton = document.getElementById("clear");
clearButton.addEventListener('click',
    function(){
        context.clearRect(0,0, WIDTH, HEIGHT);
        draw = false
        circles = []
        lines = []
    }
)


let orderedTraversalButton = document.getElementById("ordered")
let bruteForceButton = document.getElementById("bruteForce")
let nearestNeighbourButton = document.getElementById("nearestNeighbour")
let pairwiseExchangeButton = document.getElementById("pairwiseExchange")

bruteForceButton.addEventListener("mousedown", 
    function(){
        draw = false
        alert("WARNING! \n\nThe Brute Force Algorithm Operates in O(n!) time \nWhile it does find the optimal path, using more than 7 nodes causes severe performance issues \n\n If you are sure you would like to proceed, press draw")
        bruteForceButton.checked = true
        document.getElementById("textbox").style.display = "flex" 
        document.getElementById("algorithmdesc").innerHTML =  
        `<h2>Algorithm: Brute Force</h2>
        <h3>Complexity: O(n!)</h3>
        The Brute Force algorithm operates by calculating every possible path that 
        includes all nodes, and selectingthe shortest. THis algorithm is the only
        one that will find a perfectly optimal path every time, however, its time complexity makes 
        it unfeasable most of the time`
    }
)

pairwiseExchangeButton.addEventListener("mousedown",
    function(){
        document.getElementById("textbox").style.display = "flex"  
        document.getElementById("algorithmdesc").innerHTML =  
        `<h2>Algorithm: Pairwise exchange</h2>
        <h3>Complexity: O(n<sup>2</sup>)</h3>
        The Pairwise Exchange algorithm first completes the nearest neighbour algorithm. 
        Pairs of nodes are then swapped in the traversal order, if swapping the nodes 
        results in a shorter path, the swap is maintianed, if not, the swap is reversed.`;
    }
)


nearestNeighbourButton.addEventListener("mousedown",
    function(){
        document.getElementById("textbox").style.display = "flex" 
        document.getElementById("algorithmdesc").innerHTML =  
        `<h2>Algorithm: Nearest Neighbour</h2>
        <h3>Complexity: O(n<sup>2</sup>)</h3>
        The Nearest Neighbour algorighm starts with the first node, from there it travels to the nearest unvisited node.
        This algorithm usually produces a good, but not optimal result, because at the end of the algorithm, 
        the distance to reach remaining unvisited nodes may be very high`
    }
)


let cellNumbers = 50;
document.getElementById("generatedCells").innerHTML =  cellNumbers;
let generateCells = document.getElementById("generate");
generateCells.addEventListener('click',
    function(){
        circles = [];
        for(let i=0; i < cellNumbers; i++){
            circles[i] = new Circle(Math.floor(Math.random() * Math.floor(WIDTH)), Math.floor(Math.random() * Math.floor(HEIGHT)), RADIUS);
        }
        draw = true;
    }
)

let slider = document.getElementById("slider");
slider.addEventListener('mousedown', 
    function(){
        mouseDown = true;
        document.getElementById("generatedCells").innerHTML = slider.value;
        cellNumbers = slider.value;
    }
)
slider.addEventListener('mouseup', 
    function(){
        mouseDown = false;
        document.getElementById("generatedCells").innerHTML = slider.value;
        cellNumbers = slider.value;
    }
)
slider.addEventListener('mousemove', 
    function(){
        if(mouseDown === true){
            document.getElementById("generatedCells").innerHTML = slider.value;
            cellNumbers = slider.value;
        }

    }
)

let imageUpload = document.getElementById("chooseBackground")
let imageSource = ""
imageUpload.addEventListener('change', function(){
    console.log(imageUpload.files[0].name)
})




//Map listeners
let draw = false;

window.addEventListener('mousemove',
    function(event){
        var rect = canvas.getBoundingClientRect();
        if(mouseDown === true && event.clientX < WIDTH && event.clientY- rect.top < HEIGHT){
            if(nearest === -1){
                circles[circles.length-1] = new Circle(event.clientX, event.clientY- rect.top, RADIUS);
            } else{
                circles[nearest] = new Circle(event.clientX, event.clientY- rect.top, RADIUS);
            }
            changed = true
        }
    } 
)
window.addEventListener('mousedown',
    function(){
        var rect = canvas.getBoundingClientRect();
        mouseDown = true
        if(event.clientX < WIDTH && event.clientY - rect.top < HEIGHT){
            nearest = near(circles, event.clientX, event.clientY- rect.top);
            if(nearest === -1){
                circles[circles.length] = new Circle(event.clientX, event.clientY- rect.top , RADIUS);
            } else{
                circles[nearest] = new Circle(event.clientX, event.clientY- rect.top , RADIUS);
            }
        }
        changed = true
    } 
)

window.addEventListener('dblclick',
    function(){
        var rect = canvas.getBoundingClientRect();
        if(event.clientX < WIDTH && (event.clientY - rect.top) < HEIGHT){
            nearest = near(circles, event.clientX, (event.clientY - rect.top));
            if(nearest != -1){
                circles.splice(nearest, 1);
            }
        }
    } 
)

window.addEventListener('mouseup',
    function(){
        mouseDown = false;
        changed = true
    } 
)


//Algorithms

function orderedTraversal(){
    lines = [];
    for(let i =0; i < circles.length -1; i++){
        lines.push(new Line(circles[i],circles[i+1]));
    }
    return lines;
}

function nearestNeighbour(){
    lines = [];
    let visited = [];
    let shortest = -1;
    let next = -1;
    let i =0;
    while(visited.length < circles.length){
        shortest = -1;
        for(let j =0; j < circles.length; j++){
            if(  (distance(circles[i], circles[j]) < shortest || shortest === -1) && i != j && !visited.includes(circles[j]) && i!=j ){
                shortest = distance(circles[i], circles[j]);
                next = j;
            }
        }
        visited.push(circles[next]);
        i = next;
    }
    console.log(visited)
    for(let i =0; i < visited.length-1; i++){
        lines.push(new Line(visited[i], visited[i+1]));
    }
    return lines;
}

function pairwiseExchange(){
    lines = [];
    let visited = [];
    let shortest = -1;
    let next = -1;
    let i =0;
    while(visited.length < circles.length){
        shortest = -1;
        for(let j =0; j < circles.length; j++){
            if(  (distance(circles[i], circles[j]) < shortest || shortest === -1) && i != j && !visited.includes(circles[j]) && i!=j ){
                shortest = distance(circles[i], circles[j]);
                next = j;
            }
        }
        visited.push(circles[next]);
        i = next;
    }
    console.log(visited)

    let prevLength= totalLengthPoints(visited)
    for(let i =0; i < visited.length; i++){
        for(let j = 0; j < visited.length; j++){
            temp = visited[i]
            visited[i] = visited[j]
            visited[j] = temp
            if(totalLengthPoints(visited) > prevLength){
                temp = visited[i]
                visited[i] = visited[j]
                visited[j] = temp
            }
            //console.log(totalLengthPoints(newVisited) + "is less than" +totalLengthPoints(visited) )
            prevLength = totalLengthPoints(visited)
        } 
    }

    for(let i =0; i < visited.length-1; i++){
        lines.push(new Line(visited[i], visited[i+1]));
    }
    return lines;
 
}

function bruteForce(){
    let lines = [];
    console.log("frig off");
    let paths = [[circles[0]]];
    let prevLength = 0 ;
    for(let j =0; j < paths.length; j++){
        for(let i =0; i < circles.length; i++){
            if(!paths[j].includes(circles[i])){
                paths.push([...paths[j], circles[i]]);
            }
        }
    }
    paths = paths.filter(x => x.length === circles.length);
    let shortest = paths[0];
    for( let i =0; i < paths.length; i++){
        console.log("====");
        console.log(totalLengthPoints(paths[i]));
        if(totalLengthPoints(paths[i]) < totalLengthPoints(shortest)){
            shortest = paths[i];
        }
    }
    for(let i =0; i< paths.length;i++){
        console.log(paths[i]);
        console.log(totalLengthPoints(paths[i]));
    }
    for(let i =0; i < shortest.length -1; i++){
        lines.push(new Line(shortest[i],shortest[i+1]));
    }
    return lines;

}


let algorithms = [orderedTraversal, bruteForce, nearestNeighbour, pairwiseExchange];

//Helper functions

function sameContents(l1, l2){
    for(let i=0; i < l1.length; i++){
        if(!l2.includes(l1[i])){
            return false
        }
    }
    for(let i=0; i < l2.length; i++){
        if(!l1.includes(l2[i])){
            return false
        }
    }
    return true
}

function near(nodes, mouseX, mouseY){
    if(nodes.length === 0){
        return -1;
    }
    let closestX = Math.abs(nodes[0].x - mouseX);
    let closestY = Math.abs(nodes[0].y - mouseY);
    let closest =0;
    for(let i=0; i < nodes.length; i++){
        if( (Math.abs(nodes[i].getX() - mouseX) < closestX ) && (Math.abs(nodes[i].getY() - mouseY) < closestY ) ){
            closestX = Math.abs(nodes[i].getX() - mouseX);
            closestY = Math.abs(nodes[i].getY() - mouseY);
            closest = i;
        }
    }
    console.log(closestX + "," + closestY)
    if(closestX < 20 && closestY < 20){
        return closest;
    } else{
        return -1;
    }
    
}

function swap(passedLines, p1, p2){
    let list = [];
    for(let i=0; i < passedLines.length; i++){
        list[i] = passedLines[i];
    }
    let temp= list[p1].end;
    list[p1].end = list[p2].end;
    list[p2].end = temp;
    list[p1].length = Math.round(Math.sqrt(Math.pow((list[p1].start.getX() - list[p1].end.getX()), 2) + Math.pow((list[p1].start.getY() - list[p1].end.getY()), 2)));
    list[p2].length = Math.round(Math.sqrt(Math.pow((list[p2].start.getX() - list[p2].end.getX()), 2) + Math.pow((list[p2].start.getY() - list[p2].end.getY()), 2)));
    return list;
}
function distance(p1, p2){
    return Math.sqrt(Math.pow((p1.getX() - p2.getX()), 2) + Math.pow((p1.getY() - p2.getY()), 2));
}

function totalLengthLines(list){
    let total = 0;
    for(let i=0; i < list.length; i++){
        total = total + list[i].length;
    }
    return total;
}

function totalLengthPoints(list){
    let total = 0;
    for(let i=0; i < list.length -1; i++){
        total = total + Math.round(Math.sqrt(Math.pow((list[i].getX() - list[i+1].getX()), 2) + Math.pow((list[i].getY() - list[i+1].getY()), 2)));
    }
    return total;
}


function complete(list){
    let startPoint = list[0].getStart();
    let endPoint = list[0].getStart();
    let count =0;
    for(let i =0; i < list.length; i++){
        startPoint = list[i].getStart();

        if(startPoint.getX() !== endPoint.getX()){
            return false;
        }
        endPoint = list[i].getEnd();
        count = i;
    }

    return true;
}

//Drawing Function

function animate(){
    frame = requestAnimationFrame(animate);
    document.getElementById("totalLength").innerHTML = totalLengthLines(lines);
    if(changed){
        context.clearRect(0,0, WIDTH, HEIGHT);
        for(let i=0; i < circles.length; i++){
            circles[i].draw(i);
        }
        if(draw === true){
            let pos = -1;
            let algorithmOptions = document.getElementsByName('algorithmOptions');
            for(let i =0; i < algorithmOptions.length; i++){
                if(algorithmOptions[i].checked){
                    pos = i;
                }
            }
            lines = algorithms[pos]();
            for(let i=0; i < lines.length; i++){
                lines[i].draw(i);
            }
        }
        changed = false
    }

}


animate();