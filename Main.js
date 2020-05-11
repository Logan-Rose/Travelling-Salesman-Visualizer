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
        context.strokeStyle = 'blue'
        context.stroke()
        context.fill()
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
    draw(){
        context.beginPath();
        context.moveTo(this.startX, this.startY);
        context.lineTo(this.endX, this.endY);
        context.strokeStyle = "black";
        context.lineWidth = 3;
        context.stroke();
    }
}
let lines = []

//Event Listeners
let solveButton = document.getElementById("solve")
solveButton.addEventListener('click',
    function(){
        lines = []
        for(let i =0; i < circles.length -1; i++){
            lines.push(new Line(circles[i].x, circles[i].y, circles[i+1].x, circles[i+1].y))
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



//Drawing Function

function animate(){
    requestAnimationFrame(animate)
    context.clearRect(0,0, WIDTH, HEIGHT)
    for(let i=0; i < circles.length; i++){
        circles[i].draw()
    }
    for(let i=0; i < lines.length; i++){
        lines[i].draw()
    }
}
animate()