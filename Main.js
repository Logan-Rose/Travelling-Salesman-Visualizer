let canvas = document.querySelector('canvas')
let context = canvas.getContext('2d')
let WIDTH = 760
let HEIGHT = 500
let RADIUS = 5
let mouseDown = false

canvas.width = WIDTH
canvas.height = HEIGHT

//Objects

class Circle{
    constructor(x, y, rad){
        this.x = x
        this.y = y
        this.rad = rad
    }
    draw(){
        context.beginPath()
        context.arc(this.x,this.y, this.rad,0,Math.PI*2, false)
        context.strokeStyle = 'red'
        context.stroke()
        context.fill()
        context.fillStyle='red'
    }
}
let circles = []

class Line{
    constructor(startX, startY, endX, endY){
        this.startX = startX
        this.startY = startY
        this.endX = endX
        this.endY = endY
    }
    draw(val){
        context.beginPath();
        context.moveTo(this.startX, this.startY);
        context.lineTo(this.endX, this.endY);
        context.strokeStyle = "black";
        context.lineWidth = 3;
        context.stroke();
        context.fillStyle = "red";
        context.font = "bold 16px Arial";
        console.log(Math.pow((this.startX - this.endX), 2))
        console.log(Math.pow((this.startY - this.endY), 2))
        let distance = Math.round(Math.sqrt(Math.pow((this.startX - this.endX), 2) + Math.pow((this.startY - this.endY), 2)))
        console.log("=======" + distance )
        if(distance !=0){
            context.fillText(distance, (this.endX + this.startX )/2 +20, (this.endY + this.startY)/2 + 20); 
        }  
    }
}
let lines = []
let totalLength = 0
let draw = false
//Event Listeners
let solveButton = document.getElementById("solve")
solveButton.addEventListener('click',
    function(){
        if(draw ===false){
            draw = true
        } else{
            draw =false
        }
    }
)

let nearest = -1

window.addEventListener('mousemove',
    function(event){
        if(mouseDown === true && event.clientX < WIDTH && event.clientY < HEIGHT){
            if(nearest === -1){
                circles[circles.length-1] = new Circle(event.clientX, event.clientY, RADIUS)
            } else{
                circles[nearest] = new Circle(event.clientX, event.clientY, RADIUS)
            }
        }
    } 
)
window.addEventListener('mousedown',
    function(){
        mouseDown = true
        if(event.clientX < WIDTH && event.clientY < HEIGHT){
            nearest = near(circles, event.clientX, event.clientY)
            console.log(nearest)
            if(nearest === -1){
                circles[circles.length] = new Circle(event.clientX, event.clientY, RADIUS)
            } else{
                circles[nearest] = new Circle(event.clientX, event.clientY, RADIUS)
            }
        }
    } 
)
window.addEventListener('mouseup',
    function(){
        mouseDown = false
    } 
)

function near(nodes, mouseX, mouseY){
    if(nodes.length === 0){
        return -1
    }
    let closestX = Math.abs(nodes[0].x - mouseX)
    let closestY = Math.abs(nodes[0].y - mouseY)
    let closest =0
    for(let i=0; i < nodes.length; i++){
        if( (Math.abs(nodes[i].x - mouseX) < closestX ) && (Math.abs(nodes[i].y - mouseY) < closestY ) ){
            closestX = Math.abs(nodes[i].x - mouseX)
            closestY = Math.abs(nodes[i].y - mouseY)
            closest = i
        }
    }
    console.log(closestX + "," + closestY)
    if(closestX < 10 && closestY < 10){
        return closest
    } else{
        return -1
    }
    
}
let algorithms = [orderedTraversal, greedy]

function orderedTraversal(){
    lines = []
    totalLength = 0
    for(let i =0; i < circles.length -1; i++){
        lines.push(new Line(circles[i].x, circles[i].y, circles[i+1].x, circles[i+1].y))
        totalLength = totalLength + distance(circles[i], circles[i+1])
    }
    console.log(totalLength)
    return lines
}

function greedy(){
    lines = []
    let visited = []
    let shortest = -1
    let next = -1
    let i =0
    while(visited.length < circles.length){
        shortest = -1
        for(let j =1; j < circles.length; j++){
            if(  (distance(circles[i], circles[j]) < shortest || shortest === -1) && i != j && !visited.includes(circles[j]) ){
                shortest = distance(circles[i], circles[j])
                next = j
            }
        }
        visited.push(circles[next])
        lines.push(new Line(circles[i].x, circles[i].y, circles[next].x, circles[next].y))
        totalLength = totalLength + distance(circles[i], circles[next])
        i = next
        console.log(i)
    }
    return lines
}


function distance(p1, p2){
    return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2))
}

//Drawing Function

function animate(){
    requestAnimationFrame(animate)
    context.clearRect(0,0, WIDTH, HEIGHT)
    for(let i=0; i < circles.length; i++){
        circles[i].draw(i)
    }

    if(draw === true){
        let pos = -1
        let algorithmOptions = document.getElementsByName('algorithmOptions')
        for(let i =0; i < algorithmOptions.length; i++){
            if(algorithmOptions[i].checked){
                pos = i
            }
        }
        lines = algorithms[pos]()
        for(let i=0; i < lines.length; i++){
            lines[i].draw(i)
        }
    }
     

}
animate()