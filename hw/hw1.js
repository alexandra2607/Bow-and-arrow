//forme custom
let length = 3;
let left_bottom_corner = [1,0,0];
let vertices = [
          left_bottom_corner[0],left_bottom_corner[1],0,
          left_bottom_corner[0]+length,left_bottom_corner[1],0,
          left_bottom_corner[0]+length,left_bottom_corner[1]+length,0,
          left_bottom_corner[0],left_bottom_corner[1]+length,0
        ];
let indices = [0, 1, 2, 3, 4];
let color = [1,1,0];
let colors = [
      color[0],color[1],color[2],
      color[0],color[1],color[2],
      color[0],color[1],color[2],
      color[0],color[1],color[2]
    ];

let unit = 0.1;
let vertices_arrow = [
  0, unit, 0,
  0, -unit, 0,
  11 * unit, - unit, 0,
  11 * unit, unit, 0,
  (11+6) * unit,0 , 0,
  11 * unit, -3 * unit, 0,
  11 * unit, 1.5 * unit, 0
]

let indices_arrow = [1, 1, 2,
                     1, 2, 3,
                     4, 5, 6];

let shuriken_vertices = [
  0, 0, 0,
  -1, 1, 0,
  -1, 0, 0,

  -1, -1, 0,
  0, -1, 0,

  1, -1, 0,
  1, 0, 0,

  1, 1, 0,
  0, 1, 0
  ]

let shuriken_indices = [0, 1, 2, 0, 3, 4, 0, 5, 6, 0, 7, 8, 0]

let vertices_line_baloon = [
  0, 0, 0,
  -1, -0.5, 0,
  1, -1, 0,
  -1, -1.5, 0,
  1, -2, 0
]

let inidces_line_baloon = [0, 1, 2, 3, 4];

let ct = 0;
let lifes = 3;

const newArrow = (x, y, angle, radius) => {
  let arrow = {};
  arrow.x = x;
  arrow.y = y;
  arrow.angle = angle;
  arrow.radius = radius;
  arrow.collide = false;
  arrow.getModelMatrix = () => {
    let modelMatrix = m3.identity();
    modelMatrix = m3.multiply(modelMatrix, Translate(arrow.x, arrow.y));
    modelMatrix = m3.multiply(modelMatrix, Rotate(arrow.angle));
    return modelMatrix;
  }
  arrow.update = (deltaTime) => {
    arrow.x+= Math.cos(arrow.angle) * deltaTime * 6;
    arrow.y+=Math.sin(arrow.angle) * deltaTime * 6;
  }
  arrow.isOutofScreen = () =>
  {
    if(arrow.x >= window.screen.availWidth || arrow.y >= window.screen.availHeight || arrow.collide == true) {
      return true;
    }
    else {
      return false;   
    }
  }
  return arrow;
}


let baloane = [];
let timeToSpawnABallon = 1;

const addBalloon = (vectorBaloane, xSpawnPos, radius) => {
  let balon = {};
  let xScale = 0.8, yScale = 1;
  balon.xScale = xScale;
  balon.yScale = yScale;
  balon.x = xSpawnPos;
  balon.y = 0;
  balon.radius = radius;
  balon.hasCollided = false;
  balon.getModelMatrix = (name) => {
    if(name === 'cerc'){
      let modelMatrix = m3.identity();
      modelMatrix = m3.multiply(modelMatrix,Translate(balon.x, balon.y));
      modelMatrix = m3.multiply(modelMatrix,Scale(balon.xScale, balon.yScale));
      return modelMatrix;  
    } else {
      let modelMatrix = m3.identity();
      modelMatrix = m3.multiply(modelMatrix,Translate(balon.x, balon.y - 0.3 ));
      modelMatrix = m3.multiply(modelMatrix,Scale(xScale - 0.65, yScale - 0.65));
      return modelMatrix;  
    }
  }
  balon.update = (deltaTimeSeconds, name) => {
    if(balon.hasCollided){
      if(balon.xScale <= 0) {
        balon.yScale = 0;  
      } else if (balon.xScale > 0) {   
         balon.xScale -= deltaTimeSeconds / 2;
         balon.yScale -= deltaTimeSeconds;
      }
      balon.y -= deltaTimeSeconds * 2;
    } else {
      balon.y += deltaTimeSeconds;
    }
  }
  balon.isOutofScreen = () => {
    if(balon.y > 5 || balon.y < 0 || balon.hasCollided == true)
	    return true;
	  else
	    return false;
  }

  vectorBaloane.push(balon);
}

let shurikene = [];
let timeToSpawnAShuriken = 1;

const addShuriken = (vectorShurikene, ySpawnPos, radius) => {
  let shuriken = {};
  let xScale = yScale = 0.3;
  let defaultAngle = 1;
  shuriken.xScale = xScale;
  shuriken.yScale = yScale;
  shuriken.x = 4;
  shuriken.y = ySpawnPos;
  shuriken.angle = defaultAngle; 
  shuriken.radius = radius;
  shuriken.hasCollided = false;
  shuriken.getModelMatrix = () => {
    modelMaxtrix = m3.identity();
    modelMaxtrix = m3.multiply(modelMaxtrix,Translate(shuriken.x,shuriken.y));
    modelMaxtrix = m3.multiply(modelMaxtrix,Scale(shuriken.xScale, shuriken.yScale));
    modelMaxtrix = m3.multiply(modelMaxtrix,Rotate(shuriken.angle * 2));
    return modelMaxtrix
  }
  shuriken.update = (deltaTimeSeconds) => {
    if (shuriken.hasCollided) {
      shuriken.xScale /= 2;
      shuriken.yScale /= 2;
    } else {
      shuriken.x -= deltaTimeSeconds * 2;
      shuriken.angle += deltaTimeSeconds;
    }
  }
  shuriken.isOutofScreen = () => {
    if (shuriken.x <= -7 || shuriken.hasCollided == true) 
      return true;
    else 
      return false;
  }
  vectorShurikene.push(shuriken);
}


//bow
let bow = new Mesh2dBow('bow', [0,0,0], 0.75, 1.2);

//arrow
let arrow = new Mesh2DArrow('arrow', [0,0,0], vertices_arrow, indices_arrow);

//baloons
let baloon = new Mesh2DCircle('cerc', [1, 0, 0], 0.5);
let line_baloon = new Mesh2DFromParams('line_baloon', [0, 0, 0], vertices_line_baloon, inidces_line_baloon);
let yellow_baloon = new Mesh2DCircle('yBaloon', [0, 0, 0], 0.7)

//shuriken
let shurikenSuprem = new Mesh2dShuriken('shurikenSuprem', [0, 0, 1], shuriken_vertices, shuriken_indices)

let modelMaxtrix = m3.identity();

const Translate = function(translateX, translateY)
{
  return TransposeMat3([
    1, 0, translateX,
    0, 1, translateY,
    0, 0, 1
  ])
}

const Scale = function(scaleX, scaleY)
{
  return TransposeMat3([
    scaleX, 0, 0,
    0, scaleY, 0,
    0, 0, 1
  ]);
}

const Rotate = function(radians)
{
  return TransposeMat3([
    Math.cos(radians), -Math.sin(radians), 0,
    Math.sin(radians), Math.cos(radians), 0,
    0, 0, 1
  ]);
}

//const geometry = new THREE.FontGeometry("Hello There", {font: font, size: 80})
var then = 0;

let arrow_x = -6;
let arrow_y = 0;

let bow_x = -6;
let bow_y = 0;

let angularStep = 0;
let mouse_x = 0;
let mouse_y = 0;

let vectorArrow = [];

var Update = function(now) {
  if(isNaN(now)) now=0
  now *= 0.001; 
  
  let deltaTime = now - then;
  then = now;
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  let canvasElem = document.querySelector("canvas"); 
  
  canvasElem.addEventListener("mousemove", function(event) 
  {
    var result = followMouse(canvasElem, event, arrow_x, arrow_y);
    angularStep =result.angularStep;
    mouse_x = result.x;
    mouse_y = result.y;
    
  });

  modelMaxtrix = m3.identity();
  modelMaxtrix = m3.multiply(modelMaxtrix,Translate(bow_x, bow_y));
  RenderMesh2D(bow,modelMaxtrix);

  
  modelMaxtrix = m3.identity();
  modelMaxtrix = m3.multiply(modelMaxtrix,Translate(arrow_x, arrow_y));
  modelMaxtrix = m3.multiply(modelMaxtrix, Rotate(angularStep))
  RenderMesh2D(arrow,modelMaxtrix);

  canvas.onmouseup = function (ev){
   let currentAngle = angularStep;
   let nArrow = newArrow(arrow_x, arrow_y, currentAngle, 0.70);
   vectorArrow.push(nArrow);
  }

  vectorArrow.forEach(arrow => {
    arrow.update(deltaTime);
  });
  vectorArrow.forEach(sageata => {
    RenderMesh2D(arrow, sageata.getModelMatrix()); 
  });

  vectorArrow = vectorArrow.filter(sageata => !sageata.isOutofScreen());

  //balon    
    timeToSpawnABallon -= deltaTime * 1.5;
    if(timeToSpawnABallon < 0) {
      let min = 1;
      let max = 10;
      addBalloon(baloane, Math.floor(Math.random() * (max - min + 1) + min), 0.1);
      timeToSpawnABallon = 1;
    }
    
    baloane.forEach(balon => {
      balon.update(deltaTime);
    });
    
    baloane.forEach(balon => {
      RenderMesh2D(baloon, balon.getModelMatrix('cerc'));
      RenderMesh2D(line_baloon, balon.getModelMatrix('linie'));
    });
	
  baloane = baloane.filter(balon => !balon.isOutofScreen());

  //shuriken
  timeToSpawnAShuriken -= deltaTime / 3;
  if (timeToSpawnAShuriken < 0) {
    let min = -3;
    let max = 4;
    addShuriken(shurikene, Math.floor(Math.random() * (max - min + 1) + min), 0.05);
    timeToSpawnAShuriken = 1;
  }
  shurikene.forEach(sh => {
    sh.update(deltaTime);
  });

  shurikene.forEach(shuriken => {
    RenderMesh2D(shurikenSuprem, shuriken.getModelMatrix());
  });

  shurikene = shurikene.filter(sh => !sh.isOutofScreen());
  ;

 let i, j;
 let arrow_radius = 0.7;
 let scorPlayer;
 let scorBaloane;
 let scorShuriken;

 for(j of shurikene) {
   scorPlayer = 0;
   var dx = arrow_x - j.x;
   var dy = arrow_y - j.y;
   var distance = Math.sqrt(dx * dx + dy * dy);
   if (distance < arrow_radius + j.radius) {
     j.hasCollided = true; 
     scorPlayer = 1;
    }
    if (scorPlayer === 1) {
      lifes -=1
      console.log("You lost a life :(. You current number of lifes is: " + lifes);
   }
   if (lifes === 0 && scorPlayer == 1) {
     console.log("Game over!");
   }
 }

 for (i of vectorArrow){
   for(j of baloane) {
    scorBaloane = 0;
     var dx = i.x - j.x;
     var dy = i.y - j.y;
     var distance = Math.sqrt(dx * dx + dy * dy);
     if (distance < i.radius + j.radius) {
       j.hasCollided = true;
       i.collide = true; 
       scorBaloane = 1;
      }
      if (scorBaloane == 1) {
        ct ++;
        console.log("You hit a balloon -> 1 point. Your current score is: " + ct);
     }
     if (ct >= 10 && scorBaloane ==1) {
       console("Congratulations, you won!")
     }
   }
 }

 for (i of vectorArrow){
  for(j of shurikene) {
    scorShuriken = 0;
    var dx = i.x - j.x;
    var dy = i.y - j.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < i.radius + j.radius) {
      j.hasCollided = true;
      i.collide = true; 
      scorShuriken = 1;
     }
    if (scorShuriken == 1) {
       ct += 2;
       console.log("You hit a shuriken -> 2 point. Your current score is: " + ct);
    }
    if (ct >= 10 && scorShuriken ==1) {
      console("Congratulations, you won!")
    }
  }
} 
  requestAnimationFrame(Update);
}

function onInputUpdate(event) {

    if (event.key == 'w') {
        arrow_y +=0.1;
        bow_y +=0.1;
    }

    if (event.key == 's') {
        arrow_y -=0.1;
        bow_y -=0.1;
    }

}