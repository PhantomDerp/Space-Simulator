"use strict";

//todo
//planet creator
//deletion
//fast forward
//settings
//past and future trails


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d')
ctx.canvas.width  = window.innerWidth * 0.8;
ctx.canvas.height = window.innerHeight;
var table = document.getElementById('info');
var fx;
var fy;

//config
const gameframes = 1000 / 120; //120 fps
const camspeed = 3; //camera speed
const expzoom = true; //false if zoom is constant
const zoomspeed = 1.01; //zoom speed
const startWithPlanets = true; //start with a few bodies
const g = 0.0000001; //gravitational constant; gravitational force is multiplied by this
var timespeed = 1; //speed the game goes
var accuracy = 1; //divides speed by this
var follow = -1; //following planet, -1 for none


//camera
var camx = 0;
var camy = 0;
var zoom = 25; //bigger zoom = zoomed out

var wpressed = false;
var apressed = false;
var spressed = false;
var dpressed = false;
var zpressed = false; //also e
var xpressed = false; //also q
var trails = true;


//distance between 2 points
function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

//calculate gravitational force between 2 objects
function gravity(b1, b2) {
  return g * (b1.mass * b2.mass / distance(b1.x, b1.y, b2.x, b2.y));
}

//celestial body
class Body {
  constructor(x, y, mass = 10, xvel = 0, yvel = 0, diameter = 30, color = '#ffffff', name = 'planet') {
    this.x = x;
    this.y = y;
    this.mass = mass;
    this.xvel = xvel;
    this.yvel = yvel;
    this.radius = diameter / 2;
    this.color = color;
    this.name = name;
    
    
    var row = document.createElement('TR');
    
    var newtd1 = document.createElement('TD');
    var newtd2 = document.createElement('TD');
    var newtd3 = document.createElement('TD');
    var newtd4 = document.createElement('TD');
    var newtd5 = document.createElement('TD');
    var newtd6 = document.createElement('TD');
    
    newtd1.innerHTML = name;
    newtd2.innerHTML = color;
    newtd2.style.backgroundColor = color;
    newtd3.innerHTML = mass;
    newtd4.innerHTML = diameter;
    newtd5.innerHTML = 'Follow';
    newtd5.style.backgroundColor = '#1111bb';
    newtd5.index = bodies.length;
    newtd5.onclick = function() {
      follow = this.index;
    }
    newtd6.innerHTML = 'Delete';
    newtd6.style.backgroundColor = '#cc1111';
    
    row.appendChild(newtd1);
    row.appendChild(newtd2);
    row.appendChild(newtd3);
    row.appendChild(newtd4);
    row.appendChild(newtd5);
    row.appendChild(newtd6);
    
    table.appendChild(row);
    bodies.push(this);
  }
  
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc((this.x + camx - fx) / zoom + (ctx.canvas.width / 2), (this.y + camy - fy) / zoom + (ctx.canvas.height / 2), this.radius / zoom, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
  
  delete() {
    
  }
}




var bodies = [];

if (startWithPlanets) {
  new Body(0, 0, 1000000000, 0, 0, 1000, '#ffff00', 'sun');
  new Body(-12000, 0, 1000000, 0, -10, 100, '#0000ff', 'planet');
  new Body(-12000, 340, 100, 0.25, -10, 25, '#ffffff', 'moon');
}

setInterval(function() {
  if (wpressed) {camy += camspeed * zoom}
  if (apressed) {camx += camspeed * zoom}
  if (spressed) {camy -= camspeed * zoom}
  if (dpressed) {camx -= camspeed * zoom}
  if (zpressed) {if (expzoom) {zoom /= zoomspeed} else {zoom += zoomspeed}}
  if (xpressed) {if (expzoom) {zoom *= zoomspeed} else {zoom -= zoomspeed}}
  
  for (var time = 0; time < timespeed; time++) {
    //apply gravity
    for (var i = 0; i < bodies.length; i++) {
      for (var ii = i + 1; ii < bodies.length; ii++) {
        const force = gravity(bodies[i], bodies[ii]);
        const angle = Math.atan2(bodies[i].y - bodies[ii].y, bodies[i].x - bodies[ii].x);
        bodies[i].xvel += force / bodies[i].mass * Math.cos(angle + 180);
        bodies[i].yvel += force / bodies[i].mass * Math.sin(angle + 180);
        bodies[ii].xvel += force / bodies[ii].mass * Math.cos(angle);
        bodies[ii].yvel += force / bodies[ii].mass * Math.sin(angle);
        
      }
    }
    
    for (var i = 0; i < bodies.length; i++) {
      bodies[i].x += bodies[i].xvel;
      bodies[i].y += bodies[i].yvel;
    }
  }
  
  
  
  if (follow === -1) {
    fx = 0;
    fy = 0;
  } else {
    fx = bodies[follow].x;
    fy = bodies[follow].y;
  }
  
  //draw
  if (trails) {ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);}
  for (var i = 0; i < bodies.length; i++) {
    bodies[i].draw();
  }
}, gameframes);

//detect window resizes and adjust ctx
window.onresize = function() {
  ctx.canvas.width  = window.innerWidth * 0.8;
  ctx.canvas.height = window.innerHeight;
};

document.addEventListener('keydown', function(e) {
  if (e.keyCode === 87 || e.keyCode === 38) {wpressed = true;}
  if (e.keyCode === 65 || e.keyCode === 37) {apressed = true;}
  if (e.keyCode === 83 || e.keyCode === 40) {spressed = true;}
  if (e.keyCode === 68 || e.keyCode === 39) {dpressed = true;}
  if (e.keyCode === 90 || e.keyCode === 69) {zpressed = true;}
  if (e.keyCode === 88 || e.keyCode === 81) {xpressed = true;}
  if (e.keyCode === 32) {trails = !trails;}
});

document.addEventListener('keyup', function(e) {
  if (e.keyCode === 87 || e.keyCode === 38) {wpressed = false;}
  if (e.keyCode === 65 || e.keyCode === 37) {apressed = false;}
  if (e.keyCode === 83 || e.keyCode === 40) {spressed = false;}
  if (e.keyCode === 68 || e.keyCode === 39) {dpressed = false;}
  if (e.keyCode === 90 || e.keyCode === 69) {zpressed = false;}
  if (e.keyCode === 88 || e.keyCode === 81) {xpressed = false;}
});
