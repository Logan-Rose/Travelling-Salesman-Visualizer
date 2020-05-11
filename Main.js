let canvas = document.querySelector('canvas')
let context = canvas.getContext('2d')
let WIDTH = 900
let HEIGHT = 800
let mouseDown = false

canvas.width = WIDTH
canvas.height = HEIGHT

let button = document.getElementById("solve")

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
        context.lineWidth = 5;
        context.stroke();
    }
}
let lines = []

//Event Listeners

button.addEventListener('click',
    function(){
        for(let i =0; i < circles.length -1; i++){
            lines[i] = new Line(circles[i].x, circles[i].y, circles[i+1].x, circles[i+1].y)
        }
        console.log(lines)
    }
)

window.addEventListener('mousemove',
    function(event){
        if(mouseDown === true && event.clientX < WIDTH && event.clientY < HEIGHT){
            circles[circles.length-1] = new Circle(event.clientX, event.clientY, 10)
        }
    } 
)
window.addEventListener('mousedown',
    function(){
        mouseDown = true
        if(event.clientX < WIDTH && event.clientY < HEIGHT){
            console.log("f")
            circles[circles.length] = new Circle(event.clientX, event.clientY, 10)
        }
    } 
)
window.addEventListener('mouseup',
    function(){
        mouseDown = false
    } 
)

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